import "./globals.css"
import type { Metadata } from "next"
import AuthProvider from "@/components/providers/SessionProvider"

export const metadata: Metadata = {
  title: "NextAuth + Mongo Demo",
  description: "Auth.js with MongoDB adapter",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
