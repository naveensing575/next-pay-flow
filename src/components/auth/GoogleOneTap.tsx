"use client"

import { useEffect } from "react"
import { signIn, useSession } from "next-auth/react"

interface CredentialResponse {
  credential: string
  select_by: string
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
          prompt: () => void
        }
      }
    }
  }
}

export default function GoogleOneTap() {
  const { status } = useSession()

  useEffect(() => {
    if (status !== "unauthenticated") return

    const initOneTap = () => {
      if (!window.google?.accounts?.id) {
        setTimeout(initOneTap, 100)
        return
      }

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: CredentialResponse) => {
          if (!response?.credential) return
          await signIn("google-onetap", {
            credential: response.credential,
            redirect: true, // NextAuth will handle redirect via callback
          })
        },
      })

      window.google.accounts.id.prompt()
    }

    initOneTap()
  }, [status])

  return null
}
