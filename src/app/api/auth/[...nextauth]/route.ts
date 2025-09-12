import NextAuth, { type NextAuthOptions, type User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { MongoClient, ObjectId } from "mongodb"
import { OAuth2Client } from "google-auth-library"

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db("nextauth")
const users = db.collection("users")

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "google-onetap",
      name: "Google One Tap",
      credentials: {
        credential: { label: "Google ID Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.credential) return null

        const ticket = await googleClient.verifyIdToken({
          idToken: credentials.credential,
          audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload()
        if (!payload) return null

        return {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          image: payload.picture,
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ baseUrl }) {
      // Always land on dashboard after login
      return `${baseUrl}/dashboard`
    },
  },
  events: {
    async createUser(message: { user: User }) {
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
