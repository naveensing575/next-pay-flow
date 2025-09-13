"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import StatsGrid from "@/components/dashboard/StatsGrid"
import FeaturesList from "@/components/dashboard/FeaturesList"
import AccountCard from "@/components/dashboard/AccountCard"
import QuickActions from "@/components/dashboard/QuickActions"
import SubscriptionPlans from "@/components/dashboard/SubscriptionPlans"
import Navbar from "@/components/dashboard/layout/Navbar"
import Loader from "../ui/loader"
import { useSession } from "next-auth/react"

interface DashboardProps {
  session: {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      plan?: string | null
    }
  }
}

export default function Dashboard({ session }: DashboardProps) {
  const [showPlans, setShowPlans] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { status } = useSession()

  const handleUpgrade = (planId: string) => {
    console.log("Upgrading to plan:", planId)
  }

  // Show loader if session is loading or logout triggered
  if (status === "loading" || isLoggingOut) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <Navbar session={session} onLogoutStart={() => setIsLoggingOut(true)} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {session?.user?.name?.split(" ")[0] || "User"}!
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your Next-Pay-Flow account today.
          </p>
        </motion.div>

        <StatsGrid />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="bg-card p-6 rounded-xl border border-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    Unlock Premium Features
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Get unlimited projects, advanced analytics, and priority support.
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setShowPlans(!showPlans)}
                      className="bg-foreground text-background hover:opacity-90"
                    >
                      {showPlans ? "Hide Plans" : "Upgrade to Pro"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </div>
                <div className="hidden md:block ml-6">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </motion.div>

            {showPlans && <SubscriptionPlans onUpgrade={handleUpgrade} />}
            <FeaturesList />
          </div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AccountCard session={session} />
            <QuickActions />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
