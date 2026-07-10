export async function onRequestPost(context) {
  try {
    const data = await context.request.json();

    const contactNumber = String(data.contactNumber || "").trim();

    if (!contactNumber) {
      return Response.json(
        {
          success: false,
          message: "Contact number is required."
        },
        {
          status: 400
        }
      );
    }

    const appsScriptUrl = context.env.APPS_SCRIPT_QUOTE_URL;

    if (!appsScriptUrl) {
      throw new Error("Quote submission service is not configured.");
    }

    const googleResponse = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8"
      },
      body: JSON.stringify({
        sourcePage: String(data.sourcePage || ""),
        companyName: String(data.companyName || ""),
        contactPerson: String(data.contactPerson || ""),
        contactNumber,
        alternativeContactNumber: String(
          data.alternativeContactNumber || ""
        ),
        email: String(data.email || "")
      })
    });

    if (!googleResponse.ok) {
      throw new Error("Google submission request failed.");
    }

    const result = await googleResponse.json();

    if (!result.success) {
      throw new Error(result.message || "Spreadsheet verification failed.");
    }

    return Response.json({
      success: true,
      submissionId: result.submissionId,
      message: "Successful. You will be contacted soon."
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Submission failed. Please contact us on WhatsApp."
      },
      {
        status: 500
      }
    );
  }
}