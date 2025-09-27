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
        
        try {
          const ticket = await googleClient.verifyIdToken({
            idToken: credentials.credential,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          })
          
          const payload = ticket.getPayload()
          if (!payload || !payload.email) return null

          // Check if user exists in MongoDB and create/update
          const client = await clientPromise
          const db = client.db("nextauth")
          const users = db.collection("users")
          
          let user = await users.findOne({ email: payload.email })
          
          if (!user) {
            // Create new user with same structure as OAuth flow
            const newUser = {
              email: payload.email,
              name: payload.name,
              image: payload.picture,
              emailVerified: new Date(), // Google emails are verified
              subscription: {
                planId: "free",
                status: "active",
                updatedAt: new Date(),
              },
              createdAt: new Date(),
            }
            
            const result = await users.insertOne(newUser)
            user = { ...newUser, _id: result.insertedId }
          }

          return {
            id: user._id.toString(),
            email: payload.email,
            name: payload.name,
            image: payload.picture,
          }
        } catch (error) {
          console.error("Google One Tap verification error:", error)
          return null
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Important: Use JWT for credentials provider
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Store user info in JWT for credentials provider
      if (user) {
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string

        try {
          const client = await clientPromise
          const db = client.db("nextauth")
          const users = db.collection("users")
          
          const dbUser = await users.findOne({ _id: new ObjectId(token.userId as string) })
          session.user.plan = dbUser?.subscription?.planId || "free"
        } catch (error) {
          console.error("Error fetching user subscription:", error)
          session.user.plan = "free"
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard for successful logins
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
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
  pages: {
    signIn: '/login',
    error: '/login',
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }