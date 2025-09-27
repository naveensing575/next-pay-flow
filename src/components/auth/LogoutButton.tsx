"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface LogoutButtonProps {
  onLogoutStart?: () => void
}

export default function LogoutButton({ onLogoutStart }: LogoutButtonProps) {
  const handleLogout = async () => {
    onLogoutStart?.()
    await signOut({
      callbackUrl: "/",
      redirect: true,
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="bg-transparent text-foreground hover:bg-muted"
    >
      Logout
    </Button>
  )
}
