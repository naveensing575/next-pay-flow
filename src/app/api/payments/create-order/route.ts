import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { planId, userId } = await req.json();

    if (!planId || !userId) {
      return NextResponse.json({ error: "Plan ID and User ID required" }, { status: 400 });
    }

    // Plans in rupees
    const plans: Record<string, number> = {
      free: 0,
      basic: 5,
      professional: 25,
      business: 45,
    };

    if (plans[planId] === undefined) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const options = {
      amount: plans[planId] * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save subscription draft in DB
    const client = await clientPromise;
    const db = client.db();

    await db.collection("subscriptions").insertOne({
      userId: new ObjectId(userId),
      planId,
      orderId: order.id,
      status: "created",
      createdAt: new Date(),
    });

    return NextResponse.json({ order });
  } catch (err: unknown) {
    console.error("Error in create-order:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
