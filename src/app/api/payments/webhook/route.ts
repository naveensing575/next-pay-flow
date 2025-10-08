import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import { rateLimit, webhookLimiter } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting by IP for webhooks (since they're not user-authenticated)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitResponse = await rateLimit(ip, webhookLimiter);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature") as string;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    const client = await clientPromise;
    const db = client.db();

    if (event.event === "payment.captured") {
      await db.collection("subscriptions").updateOne(
        { orderId: event.payload.payment.entity.order_id },
        { $set: { status: "active", updatedAt: new Date() } }
      );
    }

    if (event.event === "payment.failed") {
      await db.collection("subscriptions").updateOne(
        { orderId: event.payload.payment.entity.order_id },
        { $set: { status: "failed", updatedAt: new Date() } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Error in webhook:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
