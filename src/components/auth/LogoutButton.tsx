"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50"
    >
      Logout
    </button>
  )
}
