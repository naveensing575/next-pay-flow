"use client"

import { motion } from "framer-motion"
import { CreditCard } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import UserDropdown from "./UserDropdown"

interface NavbarProps {
  session: {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      plan?: string | null
    }
  }
  onLogoutStart?: () => void
}

export default function Navbar({ session }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center mr-3">
              <CreditCard className="w-4 h-4 text-background" />
            </div>
            <h1 className="text-sm font-bold">Next Pay Flow</h1>
          </motion.div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserDropdown session={session} />
          </div>
        </div>
      </div>
    </header>
  )
}
