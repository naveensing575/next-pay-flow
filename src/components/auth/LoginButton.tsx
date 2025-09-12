"use client"

import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function LoginButton() {
  const { data: session } = useSession()

  if (session) return null

  return (
    <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
      Login with Google
    </Button>
  )
}
