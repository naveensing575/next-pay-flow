import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature") as string;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    const client = await clientPromise;
    const db = client.db();

    if (event.event === "payment.failed") {
      await db.collection("subscriptions").updateOne(
        { orderId: event.payload.payment.entity.order_id },
        { $set: { status: "failed", updatedAt: new Date() } }
      );
    }

    if (event.event === "subscription.charged") {
      await db.collection("subscriptions").updateOne(
        { razorpaySubscriptionId: event.payload.subscription.entity.id },
        { $set: { status: "active", updatedAt: new Date() } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error in verify-payment:", err.message, err.stack);
    } else {
      console.error("Unknown error in verify-payment:", err);
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
