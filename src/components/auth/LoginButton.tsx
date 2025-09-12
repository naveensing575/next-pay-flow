"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function LoginButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-sm">Hi, {session.user?.name}</p>
        <Button variant="outline" onClick={() => signOut()}>
          Logout
        </Button>
      </div>
    )
  }

  return <Button onClick={() => signIn("google")}>Login with Google</Button>
}
