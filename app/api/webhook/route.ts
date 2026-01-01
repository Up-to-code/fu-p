import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const headers = Object.fromEntries(req.headers);

    console.log("---------------------------------");
    console.log("📝 [WEBHOOK RECEIVED]");
    console.log("Time:", new Date().toISOString());
    console.log("Headers:", JSON.stringify(headers, null, 2));
    console.log("Body:", JSON.stringify(body, null, 2));
    console.log("---------------------------------");

    // -------------------------------------------------------------
    // [INTERNAL PROCESSING]
    // Example: Master backend sends a global announcement or sync command
    // Validated by the same internal secret if needed
    // -------------------------------------------------------------
    if (body.event === 'order.cancelled_by_admin') {
      // logic to handle cancellation from master backend
    }

    return NextResponse.json({
      success: true,
      message: "Webhook received and processed",
      received_at: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ [WEBHOOK ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Invalid JSON or internal error" },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Webhook endpoint is active. Send POST requests here." });
}
