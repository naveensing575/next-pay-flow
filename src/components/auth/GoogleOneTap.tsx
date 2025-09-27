"use client"

import { useEffect, useState, createContext, useContext } from "react"
import { signIn, useSession } from "next-auth/react"

interface CredentialResponse {
  credential: string
  select_by: string
}

// Create a context to share loading state
const OneTapLoadingContext = createContext({
  isOneTapLoading: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsOneTapLoading: (_loading: boolean) => { }
})

export const useOneTapLoading = () => useContext(OneTapLoadingContext)

// Provider component to wrap your app
export function OneTapLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isOneTapLoading, setIsOneTapLoading] = useState(false)

  return (
    <OneTapLoadingContext.Provider value={{ isOneTapLoading, setIsOneTapLoading }}>
      {children}
      {/* Global loading overlay */}
      {isOneTapLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-700 font-medium">Signing you in...</span>
            </div>
          </div>
        </div>
      )}
    </OneTapLoadingContext.Provider>
  )
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
  const { setIsOneTapLoading } = useOneTapLoading()

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

          // Show loading immediately
          setIsOneTapLoading(true)

          try {
            const result = await signIn("google-onetap", {
              credential: response.credential,
              callbackUrl: "/dashboard",
              redirect: false,
            })

            if (result?.ok) {
              // Keep loading until redirect completes
              window.location.href = "/dashboard"
            } else {
              console.error("One Tap sign in failed:", result?.error)
              setIsOneTapLoading(false)
            }
          } catch (error) {
            console.error("One Tap error:", error)
            setIsOneTapLoading(false)
          }
        },
      })

      window.google.accounts.id.prompt()
    }

    initOneTap()
  }, [setIsOneTapLoading, status])

  return null
}