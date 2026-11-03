
interface Env {
  VAHAKO_ORDER_SCRIPT_URL: string;
  VAHAKO_ORDER_SECRET: string;
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

export const onRequestPost = async (
  context: PagesContext
): Promise<Response> => {
  const { request, env } = context;

  try {
    const origin = request.headers.get('Origin');

    const allowedOrigins = [
      'https://vahako.com',
      'https://www.vahako.com'
    ];

    if (!origin || !allowedOrigins.includes(origin)) {
      return json({
        success: false,
        message: 'Request origin not allowed.'
      }, 403);
    }

    if (!request.headers.get('content-type')
      ?.toLowerCase().startsWith('application/json')) {
      return json({
        success: false,
        message: 'JSON content required.'
      }, 415);
    }

    const length = Number(request.headers.get('content-length'));

    if (Number.isFinite(length) && length > 50000) {
      return json({
        success: false,
        message: 'Order request is too large.'
      }, 413);
    }

    const raw = await request.text();

    if (raw.length > 50000) {
      return json({
        success: false,
        message: 'Order request is too large.'
      }, 413);
    }

    const payload = JSON.parse(raw);

    if (!payload || typeof payload !== 'object' ||
        Array.isArray(payload) ||
        !payload.customer ||
        !Array.isArray(payload.items) ||
        payload.items.length < 1 ||
        payload.items.length > 30 ||
        typeof payload.requestId !== 'string' ||
        !/^[a-zA-Z0-9_-]{16,100}$/.test(payload.requestId)) {
      return json({
        success: false,
        message: 'Invalid order information.'
      }, 400);
    }

    if (!env.VAHAKO_ORDER_SCRIPT_URL ||
        !env.VAHAKO_ORDER_SECRET) {
      return json({
        success: false,
        message: 'Order service is not configured.'
      }, 503);
    }

    const upstream = await fetch(
      env.VAHAKO_ORDER_SCRIPT_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          requestId: payload.requestId,
          customer: payload.customer,
          items: payload.items,
          secret: env.VAHAKO_ORDER_SECRET
        }),
        redirect: 'follow'
      }
    );

    if (!upstream.ok) {
      return json({
        success: false,
        message: 'Order service is temporarily unavailable.'
      }, 502);
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

    if (!result.success ||
        typeof result.orderNumber !== 'string') {
      return json({
        success: false,
        message: 'Order could not be processed.'
      }, 422);
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

    return json({
      success: false,
      message: 'Unable to process order. Please try again.'
    }, 500);
  }
};
