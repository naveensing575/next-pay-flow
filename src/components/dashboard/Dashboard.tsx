'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, ArrowRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import LogoutButton from "@/components/auth/LogoutButton"
import SubscriptionModal from "@/components/dashboard/SubscriptionModal"
import StatsGrid from "@/components/dashboard/StatsGrid"
import FeaturesList from "@/components/dashboard/FeaturesList"
import AccountCard from "@/components/dashboard/AccountCard"
import QuickActions from "@/components/dashboard/QuickActions"
import { ThemeToggle } from "../theme-toggle"

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
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleUpgrade = (planId: string) => {
    console.log('Upgrading to plan:', planId)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="w-4 h-4 text-white dark:text-black" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Next-Pay-Flow
              </h1>
            </motion.div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {session.user?.name}
                </p>
                <Badge
                  variant={session.user?.plan === 'free' ? 'secondary' : 'default'}
                  className="text-xs"
                >
                  {session.user?.plan || 'Free'} Plan
                </Badge>
              </div>
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full border border-gray-300"
                />
              )}
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here&apos;s what&apos;s happening with your Next-Pay-Flow account today.
          </p>
        </motion.div>

        <StatsGrid />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Unlock Premium Features
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Get unlimited projects, advanced analytics, and priority support.
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                      Upgrade to Pro
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </div>
                <div className="hidden md:block ml-6">
                  <div className="w-16 h-16 bg-black/5 dark:bg-white/10 rounded-full flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-gray-700 dark:text-gray-200" />
                  </div>
                </div>
              </div>
            </motion.div>

            <FeaturesList />
          </div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AccountCard session={session} />
            <QuickActions />
          </motion.div>
        </div>
      </div>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  )
}
