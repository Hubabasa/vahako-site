interface Env {
  VAHAKO_ORDER_SCRIPT_URL: string;
  VAHAKO_ORDER_SECRET: string;
  PUBLIC_FIREBASE_API_KEY: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });

// Identity Toolkit validates the ID token on Google's servers. The API key
// selects the Firebase project; it is NOT an authentication secret.
async function verifiedFirebaseUid(token: string, apiKey: string): Promise<string> {
  const response = await fetch(
    'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' +
      encodeURIComponent(apiKey),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token })
    }
  );
  if (!response.ok) throw new Error('Firebase ID token verification failed.');
  const data = await response.json() as {
    users?: Array<{ localId?: string }>;
  };
  const uid = data.users?.[0]?.localId;
  if (!uid || !/^[A-Za-z0-9_-]{1,128}$/.test(uid)) {
    throw new Error('Firebase user identity missing.');
  }
  return uid;
}

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
  const { request, env } = context;
  try {
    const origin = request.headers.get('Origin');
    if (!origin || !['https://vahako.com', 'https://www.vahako.com'].includes(origin)) {
      return json({ success: false, message: 'Request origin not allowed.' }, 403);
    }
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
      return json({ success: false, message: 'JSON content required.' }, 415);
    }
    const lengthHeader = request.headers.get('content-length');
    if (lengthHeader !== null && Number(lengthHeader) > 50000) {
      return json({ success: false, message: 'Order request is too large.' }, 413);
    }
    const raw = await request.text();
    if (raw.length > 50000) {
      return json({ success: false, message: 'Order request is too large.' }, 413);
    }
    const payload = JSON.parse(raw) as Record<string, unknown>;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
        !payload.customer || !Array.isArray(payload.items) ||
        payload.items.length < 1 || payload.items.length > 30 ||
        typeof payload.requestId !== 'string' ||
        !/^[a-zA-Z0-9_-]{16,100}$/.test(payload.requestId)) {
      return json({ success: false, message: 'Invalid order information.' }, 400);
    }
    if (!env.VAHAKO_ORDER_SCRIPT_URL || !env.VAHAKO_ORDER_SECRET) {
      return json({ success: false, message: 'Order service is not configured.' }, 503);
    }

    let firebaseUid = '';
    if (payload.firebaseIdToken !== undefined && payload.firebaseIdToken !== null) {
      if (typeof payload.firebaseIdToken !== 'string' ||
          !payload.firebaseIdToken || payload.firebaseIdToken.length > 10000) {
        return json({ success: false, message: 'Invalid sign-in token.' }, 401);
      }
      if (!env.PUBLIC_FIREBASE_API_KEY) {
        return json({ success: false, message: 'Sign-in verification is unavailable.' }, 503);
      }
      try {
        firebaseUid = await verifiedFirebaseUid(payload.firebaseIdToken, env.PUBLIC_FIREBASE_API_KEY);
      } catch (error) {
        console.error('Firebase identity verification error:', error);
        return json({ success: false, message: 'Your sign-in expired. Please sign in again.' }, 401);
      }
    }

    const upstream = await fetch(env.VAHAKO_ORDER_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        requestId: payload.requestId,
        customer: payload.customer,
        items: payload.items,
        firebaseUid,
        secret: env.VAHAKO_ORDER_SECRET
      }),
      redirect: 'follow'
    });
    if (!upstream.ok) {
      return json({ success: false, message: 'Order service is temporarily unavailable.' }, 502);
    }
    const result = await upstream.json() as {
      success?: boolean;
      orderNumber?: string;
      message?: string;
      orderStatus?: string;
      paymentStatus?: string;
      productTotal?: number;
      itemCount?: number;
      currency?: string;
      duplicate?: boolean;
    };
    if (!result.success || typeof result.orderNumber !== 'string') {
      return json({ success: false, message: 'Order could not be processed.' }, 422);
    }
    return json({
      success: true,
      orderNumber: result.orderNumber,
      orderStatus: result.orderStatus,
      paymentStatus: result.paymentStatus,
      productTotal: result.productTotal,
      itemCount: result.itemCount,
      currency: result.currency,
      duplicate: result.duplicate === true
    });
  } catch (error) {
    console.error('Vahako order gateway error:', error);
    return json({ success: false, message: 'Unable to process order. Please try again.' }, 500);
  }
};
