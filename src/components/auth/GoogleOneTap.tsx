"use client"

import { useEffect } from "react"
import { signIn, useSession } from "next-auth/react"

interface CredentialResponse {
  credential: string
  select_by: string
}

interface PromptMomentNotification {
  isNotDisplayed: () => boolean
  getNotDisplayedReason: () => string
  isSkippedMoment: () => boolean
  getSkippedReason: () => string
  isDismissedMoment: () => boolean
  getDismissedReason: () => string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string
            callback: (response: CredentialResponse) => void
          }) => void
          prompt: (notification?: (not: PromptMomentNotification) => void) => void
        }
      }
    }
  }
}

export default function GoogleOneTap() {
  const { status } = useSession()

  useEffect(() => {
    // Don't show One Tap if user is already authenticated or still loading
    if (status !== "unauthenticated") return

    const initOneTap = () => {
      if (!window.google?.accounts?.id) {
        // Retry after a short delay if Google hasn't loaded yet
        setTimeout(initOneTap, 100)
        return
      }

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: CredentialResponse) => {
          if (!response?.credential) {
            console.error("No credential received from Google One Tap")
            return
          }

          try {
            console.log("Google One Tap: Signing in...")
            const result = await signIn("google-onetap", {
              credential: response.credential,
              callbackUrl: "/dashboard",
              redirect: true, // Ensure redirect happens
            })

            if (result?.error) {
              console.error("Google One Tap sign-in error:", result.error)
            } else {
              console.log("Google One Tap: Sign-in successful, redirecting...")
            }
          } catch (error) {
            console.error("Google One Tap sign-in failed:", error)
          }
        },
      })

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.warn("One Tap not displayed:", notification.getNotDisplayedReason())
        }
        if (notification.isSkippedMoment()) {
          console.warn("One Tap skipped:", notification.getSkippedReason())
        }
        if (notification.isDismissedMoment()) {
          console.warn("One Tap dismissed:", notification.getDismissedReason())
        }
      })
    }

    // Try to initialize immediately, with retries if Google hasn't loaded
    initOneTap()
  }, [status])

  return null
}