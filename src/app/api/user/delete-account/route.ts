import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("nextauth")

    const userId = new ObjectId(session.user.id)

    // Delete user data (GDPR compliance)
    // 1. Delete all subscriptions
    await db.collection("subscriptions").deleteMany({ userId })

    // 2. Delete all sessions
    await db.collection("sessions").deleteMany({
      userId: session.user.id,
    })

    // 3. Delete accounts (OAuth connections)
    await db.collection("accounts").deleteMany({ userId: session.user.id })

    // 4. Finally delete the user
    await db.collection("users").deleteOne({ _id: userId })

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully"
    })
  } catch (err: unknown) {
    console.error("Error deleting account:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
