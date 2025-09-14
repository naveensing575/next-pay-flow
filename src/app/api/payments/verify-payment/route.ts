import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature, planId, userId } = await req.json();

    if (!orderId || !paymentId || !signature || !planId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify Razorpay signature for security
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Update subscription record with payment details
    await db.collection("subscriptions").updateOne(
      { orderId },
      {
        $set: {
          planId,
          paymentId,
          signature,
          userId: new ObjectId(userId),
          status: "active",
          updatedAt: new Date(),
        },
      }
    );

    // Update user's subscription plan - this is what the session callback reads
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          subscription: {
            planId,
            status: "active",
            updatedAt: new Date(),
          },
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Error in verify-payment:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}