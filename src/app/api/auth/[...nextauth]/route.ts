import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { OAuth2Client } from "google-auth-library"

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
            audience: process.env.GOOGLE_CLIENT_ID,
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
    async jwt({ token, user, account, trigger }) {
      // Initial sign in - handle both OAuth (Google button) and Credentials (One Tap)
      if (user) {
        try {
          const client = await clientPromise
          const db = client.db("nextauth")
          const users = db.collection("users")
          const accounts = db.collection("accounts")

          // Find existing user by email
          const dbUser = await users.findOne({ email: user.email })

          if (!dbUser) {
            // Create new user
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

            // If OAuth login, store account info for future reference
            if (account && account.provider === "google") {
              await accounts.insertOne({
                userId: result.insertedId,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                refresh_token: account.refresh_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              })
            }
          } else {
            // Existing user
            token.plan = dbUser.subscription?.planId || "free"
            token.userId = dbUser._id.toString()

            // If OAuth login and account doesn't exist, link it
            if (account && account.provider === "google") {
              const existingAccount = await accounts.findOne({
                userId: dbUser._id,
                provider: account.provider,
              })

              if (!existingAccount) {
                await accounts.insertOne({
                  userId: dbUser._id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  refresh_token: account.refresh_token,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                })
              }
            }
          }
        } catch (error) {
          console.error("JWT callback error:", error)
          token.plan = "free"
          token.userId = user.id
        }
      }

      // CRITICAL: Refresh token data on any update or signin trigger
      if ((trigger === "update" || trigger === "signIn") && token.userId) {
        try {
          const client = await clientPromise
          const db = client.db("nextauth")
          const users = db.collection("users")

          const dbUser = await users.findOne({ _id: new ObjectId(token.userId as string) })
          if (dbUser) {
            // Update all relevant fields from database
            token.plan = dbUser.subscription?.planId || "free"
            token.name = dbUser.name
            token.email = dbUser.email
            token.picture = dbUser.image
          }
        } catch (error) {
          console.error("JWT update error:", error)
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