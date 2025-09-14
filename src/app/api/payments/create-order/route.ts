import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();
    if (!planId) {
      return NextResponse.json({ error: "Plan ID required" }, { status: 400 });
    }

    // Plan prices in rupees
    const plans: Record<string, number> = {
      basic: 5,
      professional: 25,
      business: 45,
    };

    if (!plans[planId]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Create Razorpay order
    const options = {
      amount: plans[planId] * 100, // Convert rupees to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Store order details for verification later
    const client = await clientPromise;
    const db = client.db();
    await db.collection("subscriptions").insertOne({
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