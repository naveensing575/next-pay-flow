"use client"

import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import LogoutButton from "@/components/auth/LogoutButton"

interface UserDropdownProps {
  session: {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      plan?: string | null
    }
  }
}

export default function UserDropdown({ session }: UserDropdownProps) {
  const { name, email, image, plan } = session.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring">
          {image ? (
            <Image
              src={image}
              alt={name || "User"}
              width={36}
              height={36}
              className="rounded-full border border-border"
            />
          ) : (
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-muted text-sm font-semibold">
              {name?.[0] || "U"}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-72 p-4 space-y-4 rounded-xl shadow-lg">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          {image ? (
            <Image
              src={image}
              alt={name || "User"}
              width={48}
              height={48}
              className="rounded-full border border-border"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-muted text-lg font-semibold">
              {name?.[0] || "U"}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <p className="font-semibold text-sm truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Plan Info */}
        <div className="flex flex-col space-y-1 text-sm">
          <span className="text-muted-foreground">Current Plan</span>
          <Badge
            className="w-fit px-2 py-0.5 text-xs"
            variant={plan?.toLowerCase() === "free" ? "secondary" : "default"}
          >
            {plan || "Free"}
          </Badge>
        </div>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem asChild className="p-0">
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}