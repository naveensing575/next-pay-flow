import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();
    if (!planId) {
      return NextResponse.json({ error: "Plan ID required" }, { status: 400 });
    }

    // Plan pricing (could also be in DB)
    const plans: Record<string, number> = {
      basic: 500, // in INR paise (₹5.00 => 500 paise)
      professional: 2500, // ₹25.00
      business: 4500, // ₹45.00
    };

    if (!plans[planId]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Create order
    const options = {
      amount: plans[planId] * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save to DB
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
    if (err instanceof Error) {
      console.error("Error in verify-payment:", err.message, err.stack);
    } else {
      console.error("Unknown error in verify-payment:", err);
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
