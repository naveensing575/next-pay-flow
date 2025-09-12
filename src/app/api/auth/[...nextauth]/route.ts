import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { MongoClient } from "mongodb"
import { ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db("nextauth")
const users = db.collection("users")

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async createUser(message) {
      // Ensure user gets default plan
      await users.updateOne(
        { _id: new ObjectId(message.user.id) },
        { $set: { plan: "free", createdAt: new Date() } }
      )
      console.log("✅ User created with plan: free", message.user.email)
    },
  },
}
  
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
