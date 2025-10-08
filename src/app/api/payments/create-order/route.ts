import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { rateLimitByIP, createOrderLimiter } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitResponse = await rateLimitByIP(ip, createOrderLimiter);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      userId: session.user.id,
      status: "created",
      createdAt: new Date(),
    });

    return NextResponse.json({ order });
  } catch (err: unknown) {
    console.error("Error in create-order:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}