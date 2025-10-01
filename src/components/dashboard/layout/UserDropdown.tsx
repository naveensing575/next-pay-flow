"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import LogoutButton from "@/components/auth/LogoutButton"
import { Session } from "next-auth"
import { Receipt, Settings, MessageSquare } from "lucide-react"

interface UserDropdownProps {
  session: Session | null
}

export default function UserDropdown({ session }: UserDropdownProps) {
  if (!session?.user) return null

  const { name, email, image, plan } = session.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring relative overflow-hidden">
          {image ? (
            <>
              <Image
                src={image}
                alt={name || "User"}
                width={36}
                height={36}
                className="rounded-full border border-border"
              />
              {/* Shimmer animation overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-full"
                initial={{ x: "-100%", y: "-100%" }}
                animate={{ x: "100%", y: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                  repeatDelay: 2,
                }}
                style={{
                  background: "linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.8) 50%, transparent 70%)",
                  width: "150%",
                  height: "150%",
                }}
              />
            </>
          ) : (
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-muted text-sm font-semibold relative">
              {name?.[0] || "U"}
              {/* Shimmer animation overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-full"
                initial={{ x: "-100%", y: "-100%" }}
                animate={{ x: "100%", y: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                  repeatDelay: 2,
                }}
                style={{
                  background: "linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.8) 50%, transparent 70%)",
                  width: "150%",
                  height: "150%",
                }}
              />
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-72 p-4 space-y-4 rounded-xl shadow-lg">
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

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/billing"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>Billing & Invoices</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/support"
            className="flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Support</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="p-0">
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}