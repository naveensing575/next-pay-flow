import NextAuth, { type NextAuthOptions, type User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { OAuth2Client } from "google-auth-library"

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
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id

        try {
          const client = await clientPromise
          const db = client.db("nextauth")
          const users = db.collection("users")
          
          const dbUser = await users.findOne({ _id: new ObjectId(user.id) })
          session.user.plan = dbUser?.subscription?.planId || "free"
        } catch (error) {
          console.error("Error fetching user subscription:", error)
          session.user.plan = "free"
        }
      }
      return session
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`
    },
  },
  events: {
    async createUser(message: { user: User }) {
      try {
        const client = await clientPromise
        const db = client.db("nextauth")
        const users = db.collection("users")
        
        await users.updateOne(
          { _id: new ObjectId(message.user.id) },
          {
            $set: {
              subscription: {
                planId: "free",
                status: "active",
                updatedAt: new Date(),
              },
              createdAt: new Date(),
            },
          }
        )
      } catch (error) {
        console.error("Error creating user subscription:", error)
      }
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }