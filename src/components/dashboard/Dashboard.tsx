"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Crown, Star, Gem } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import SubscriptionPlans from "@/components/dashboard/SubscriptionPlans"
import Navbar from "@/components/dashboard/layout/Navbar"
import Loader from "../ui/loader"
import { useSession } from "next-auth/react"
import { notify } from "@/components/notification"
import { useRouter } from "next/navigation"
import Image from "next/image"

declare global {
  interface Window {
    Razorpay: new (options: unknown) => { open: () => void }
  }
}

export default function Dashboard() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [optimisticPlan, setOptimisticPlan] = useState<string | null>(null)
  const { data: session, status, update } = useSession()
  const router = useRouter()

  useEffect(() => {
    const pendingPlan = sessionStorage.getItem('pendingPlanUpdate')
    if (pendingPlan) {
      setOptimisticPlan(pendingPlan)
      notify("success", `Successfully upgraded to ${pendingPlan} plan!`)

      // Force session update and wait for it to complete
      update().then(() => {
        // Remove from session storage after update completes
        sessionStorage.removeItem('pendingPlanUpdate')

        // Small delay to ensure UI updates
        setTimeout(() => {
          setOptimisticPlan(null)
        }, 300)
      })
    }
  }, [update])

  const userPlan = (optimisticPlan || session?.user?.plan)?.toLowerCase() || "free"

  const handleUpgrade = async (planId: string) => {
    if (!window.Razorpay) {
      notify("error", "Payment system not loaded")
      return
    }

    if (!session?.user?.id) {
      notify("error", "Please log in again")
      return
    }

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
          try {
            notify("info", "Verifying payment...")

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
              // Store pending plan update
              sessionStorage.setItem('pendingPlanUpdate', planId)

              // Update session and refresh
              await update()

              // Use router.refresh() for better performance
              router.refresh()
            } else {
              notify("error", "Payment verification failed")
            }
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError)
            notify("error", "Payment verification failed")
          }
        },
        modal: {
          ondismiss: () => {
            console.log("Payment modal closed")
          }
        },
        prefill: {
          name: session?.user?.name || "User",
          email: session?.user?.email || "",
        },
        theme: { color: "#2563eb" },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error("Error upgrading:", err)
      notify("error", "Something went wrong")
    }
  }

  if (status === "loading" || isLoggingOut) {
    return <Loader />
  }

  const renderPlanBadge = () => {
    switch (userPlan) {
      case "basic":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 text-sm sm:text-base shadow-md">
            <Star className="w-4 h-4 mr-2" /> Basic Plan
          </Badge>
        )
      case "professional":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm sm:text-base shadow-md">
            <Crown className="w-4 h-4 mr-2" /> Professional Plan
          </Badge>
        )
      case "business":
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm sm:text-base shadow-md">
            <Gem className="w-4 h-4 mr-2" /> Business Plan
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 px-4 py-2 text-sm sm:text-base shadow-md">
            <Gem className="w-4 h-4 mr-2" /> Free Plan
          </Badge>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-black dark:to-gray-900">
      <Navbar
        session={session}
        onLogoutStart={() => setIsLoggingOut(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* User Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="border-border shadow-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                {/* Left Section - Profile Info */}
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Profile Picture */}
                  <div className="relative">
                    {session?.user?.image ? (
                      <motion.div
                        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-700 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                        {/* Shimmer overlay */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
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
                      </motion.div>
                    ) : (
                      <motion.div
                        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold ring-4 ring-white dark:ring-gray-700 shadow-lg overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {session?.user?.name?.[0]?.toUpperCase() || "U"}
                        {/* Shimmer overlay */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
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
                      </motion.div>
                    )}
                  </div>

                  {/* User Details */}
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      Welcome back, {session?.user?.name?.split(" ")[0] || "User"}!
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>

                {/* Right Section - Plan Badge */}
                <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Current Plan
                  </span>
                  {renderPlanBadge()}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription Plans Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-border shadow-lg">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <SubscriptionPlans onUpgrade={handleUpgrade} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}