import "./globals.css"
import type { Metadata } from "next"
import AuthProvider from "@/components/providers/SessionProvider"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "sonner"
import { OneTapLoadingProvider } from "@/components/auth/GoogleOneTap"

export const metadata: Metadata = {
  title: "Next Pay Flow",
  description: "Subscription demo with NextAuth, MongoDB, and Razorpay",
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
            <OneTapLoadingProvider>
              <Toaster position="top-right" richColors closeButton />
              {children}
            </OneTapLoadingProvider>
          </ThemeProvider>
        </AuthProvider>

        {/* Razorpay Checkout script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        {/* Google One Tap */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}