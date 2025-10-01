import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("nextauth")

    // Get all payment history for the user
    const payments = await db
      .collection("subscriptions")
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ createdAt: -1 })
      .toArray()

    // Format the response
    const formattedPayments = payments.map((payment) => ({
      id: payment._id.toString(),
      orderId: payment.orderId,
      paymentId: payment.paymentId,
      planId: payment.planId,
      status: payment.status,
      amount: getAmountForPlan(payment.planId),
      currency: "INR",
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }))

    return NextResponse.json({ payments: formattedPayments })
  } catch (err: unknown) {
    console.error("Error fetching payment history:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// Helper function to get amount for plan
function getAmountForPlan(planId: string): number {
  const plans: Record<string, number> = {
    basic: 5,
    professional: 25,
    business: 45,
  }
  return plans[planId] || 0
}
