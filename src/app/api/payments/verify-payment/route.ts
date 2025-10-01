import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId, paymentId, signature, planId, userId } = await req.json()

    if (!orderId || !paymentId || !signature || !planId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (session.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(orderId + "|" + paymentId)
      .digest("hex")

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("nextauth")

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
      },
      { upsert: true }
    )

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
    )

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error("Error in verify-payment:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}