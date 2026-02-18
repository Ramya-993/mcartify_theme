import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Payment webhook received:", body);

    // Handle Cashfree webhook notifications
    if (body.type && body.data) {
      const { type, data } = body;

      if (type === "PAYMENT_SUCCESS_WEBHOOK") {
        console.log("Payment successful:", data);

        // Redirect to payment status page with success
        const redirectUrl = new URL("/payment-status", request.url);
        redirectUrl.searchParams.set("order_id", data.order.order_id);
        redirectUrl.searchParams.set(
          "cf_payment_id",
          data.payment.cf_payment_id
        );
        redirectUrl.searchParams.set(
          "payment_status",
          data.payment.payment_status
        );

        return NextResponse.json({
          Status: 1,
          Message: "Payment successful",
          RedirectUrl: redirectUrl.toString(),
        });
      }

      if (type === "PAYMENT_FAILED_WEBHOOK") {
        console.log("Payment failed:", data);

        // Redirect to payment failed page
        const redirectUrl = new URL("/payment-failed", request.url);
        redirectUrl.searchParams.set(
          "reason",
          data.payment.payment_message || "Payment failed"
        );
        redirectUrl.searchParams.set("orderId", data.order.order_id);

        return NextResponse.json({
          Status: 0,
          Message: "Payment failed",
          RedirectUrl: redirectUrl.toString(),
        });
      }
    }

    // Handle general payment status updates
    return NextResponse.json({
      Status: 1,
      Message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        Status: 0,
        Message: "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Handle return URL from Cashfree
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order_id");
  const paymentId = url.searchParams.get("cf_payment_id");
  const orderToken = url.searchParams.get("order_token");

  console.log("Payment return URL accessed:", {
    orderId,
    paymentId,
    orderToken,
  });

  if (orderId) {
    // Redirect to payment status page
    const redirectUrl = new URL("/payment-status", request.url);
    redirectUrl.searchParams.set("order_id", orderId);
    if (paymentId) redirectUrl.searchParams.set("cf_payment_id", paymentId);
    if (orderToken) redirectUrl.searchParams.set("order_token", orderToken);

    return NextResponse.redirect(redirectUrl);
  }

  // If no order ID, redirect to payment failed
  return NextResponse.redirect(
    new URL("/payment-failed?reason=Invalid+payment+return", request.url)
  );
}
