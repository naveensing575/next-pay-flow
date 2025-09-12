"use client"

import { useEffect } from "react"
import { signIn } from "next-auth/react"

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

export default function GoogleOneTap() {
  useEffect(() => {
    if (!window.google) {
      console.warn("Google One Tap SDK not loaded yet")
      return
    }

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: (response: CredentialResponse) => {
        console.log("One Tap response:", response)
        signIn("google-onetap", {
          credential: response.credential,
          callbackUrl: "/dashboard",
        })
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
  }, [])

  return null
}
