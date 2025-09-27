import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
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

          return {
            id: payload.sub,
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
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        // Handle user creation/lookup here for better performance
        try {
          const client = await clientPromise
          const db = client.db("nextauth")
          const users = db.collection("users")
          
          const dbUser = await users.findOne({ email: user.email })
          
          if (!dbUser) {
            const newUser = {
              email: user.email,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
              subscription: {
                planId: "free",
                status: "active",
                updatedAt: new Date(),
              },
              createdAt: new Date(),
            }
            
            const result = await users.insertOne(newUser)
            token.plan = "free"
            token.userId = result.insertedId.toString()
          } else {
            token.plan = dbUser.subscription?.planId || "free"
            token.userId = dbUser._id.toString()
          }
        } catch (error) {
          console.error("JWT callback error:", error)
          token.plan = "free"
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string
        session.user.plan = token.plan as string || "free"
      }
      return session
    },
    async redirect({ baseUrl }) {
      // Simple, fast redirect
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }