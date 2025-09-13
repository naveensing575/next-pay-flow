import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature, planId, userId } = await req.json();

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Update subscriptions collection
    await db.collection("subscriptions").updateOne(
      { orderId },
      {
        $set: {
          paymentId,
          signature,
          userId,
          status: "active",
          updatedAt: new Date(),
        },
      }
    );

    // Handle ObjectId vs string IDs
    const userQuery = ObjectId.isValid(userId)
      ? { _id: new ObjectId(userId) }
      : { _id: userId };

    await db.collection("users").updateOne(userQuery, {
      $set: {
        subscription: {
          planId,
          status: "active",
          updatedAt: new Date(),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Error in verify-payment:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
