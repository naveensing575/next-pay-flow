import "./globals.css"
import type { Metadata } from "next"
import AuthProvider from "@/components/providers/SessionProvider"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "NextAuth + Mongo Demo",
  description: "Auth.js with MongoDB adapter and Google One Tap",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>

        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
