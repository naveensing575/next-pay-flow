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

      <DropdownMenuContent className="w-64 p-3 space-y-3">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          {image && (
            <Image
              src={image}
              alt={name || "User"}
              width={40}
              height={40}
              className="rounded-full border border-border"
            />
          )}
          <div>
            <p className="font-medium text-sm">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Plan Info */}
        <div className="flex items-center justify-between text-sm">
          <span>Plan:</span>
          <Badge variant={plan === "free" ? "secondary" : "default"}>
            {plan || "Free"}
          </Badge>
        </div>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem asChild>
          <LogoutButton/>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
