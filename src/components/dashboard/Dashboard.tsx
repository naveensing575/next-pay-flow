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
import Notification from "@/components/notification"

interface DashboardProps {
  session: {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      plan?: string | null
    }
  }
}

// ✅ declare Razorpay type
declare global {
  interface Window {
    Razorpay: new (options: unknown) => { open: () => void }
  }
}

export default function Dashboard({ session }: DashboardProps) {
  const [showPlans, setShowPlans] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const { status } = useSession()

  const handleUpgrade = async (planId: string) => {
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })

      const data = await res.json()
      if (!data.order) throw new Error(data.error || "Order creation failed")

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Next Pay Flow",
        description: `Subscribe to ${planId} plan`,
        order_id: data.order.id,
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          const verifyRes = await fetch("/api/payments/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              planId,
              userId: session?.user?.id,
            }),
          })

          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            setNotification({ type: "success", message: "Payment successful! 🎉" })
            setTimeout(() => window.location.reload(), 1500)
          } else {
            setNotification({ type: "error", message: "Payment verification failed ❌" })
          }
        },
        prefill: {
          name: session?.user?.name || "User",
          email: session?.user?.email || "test@example.com",
        },
        theme: { color: "#3399cc" },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error("Error upgrading:", err)
      setNotification({ type: "error", message: "Something went wrong ❌" })
    }
  }

  if (status === "loading" || isLoggingOut) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}

      <Navbar session={session} onLogoutStart={() => setIsLoggingOut(true)} />

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
                    {session?.user?.plan
                      ? `Current Plan: ${session.user.plan}`
                      : "Unlock Premium Features"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {session?.user?.plan
                      ? "Manage your subscription below."
                      : "Get unlimited projects, advanced analytics, and priority support."}
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setShowPlans(!showPlans)}
                      className="bg-foreground text-background hover:opacity-90"
                    >
                      {showPlans
                        ? "Hide Plans"
                        : session?.user?.plan
                          ? "Change Plan"
                          : "Upgrade to Pro"}
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
