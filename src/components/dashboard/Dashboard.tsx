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
import { useSearchParams, useRouter } from "next/navigation"
import { notify } from "@/components/notification"

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

declare global {
  interface Window {
    Razorpay: new (options: unknown) => { open: () => void }
  }
}

export default function Dashboard({ session }: DashboardProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isComponentLoaded, setIsComponentLoaded] = useState(false)
  const { data: sessionData, status, update } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentSession = sessionData || session
  const userPlan = currentSession?.user?.plan?.toLowerCase() || "free"

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComponentLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isComponentLoaded) {
      const paymentStatus = searchParams.get("payment")
      if (paymentStatus === "success") {
        setTimeout(() => {
          notify("success", "Payment successful! 🎉")
        }, 500)

        router.replace("/dashboard", { scroll: false })
      }
    }
  }, [isComponentLoaded, searchParams, router])

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
          try {
            const verifyRes = await fetch("/api/payments/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                planId,
                userId: currentSession?.user?.id,
              }),
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              setTimeout(() => {
                notify("success", "Payment successful! 🎉")
              }, 300)
              await update()
            } else {
              notify("error", "Payment verification failed ❌")
            }
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError)
            notify("error", "Payment verification failed ❌")
          }
        },
        prefill: {
          name: currentSession?.user?.name || "User",
          email: currentSession?.user?.email || "test@example.com",
        },
        theme: { color: "#2563eb" },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error("Error upgrading:", err)
      notify("error", "Something went wrong ❌")
    }
  }

  if (status === "loading" || isLoggingOut) {
    return <Loader />
  }

  const renderPlanBadge = () => {
    switch (userPlan) {
      case "basic":
        return (
          <Badge className="bg-yellow-500 text-white">
            <Star className="w-3 h-3 mr-1" /> Basic
          </Badge>
        )
      case "professional":
        return (
          <Badge className="bg-blue-600 text-white">
            <Crown className="w-3 h-3 mr-1" /> Professional
          </Badge>
        )
      case "business":
        return (
          <Badge className="bg-purple-600 text-white">
            <Gem className="w-3 h-3 mr-1" /> Business
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            <Gem className="w-3 h-3 mr-1" /> Free
          </Badge>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-black dark:to-gray-900">
      <Navbar
        session={currentSession}
        onLogoutStart={() => setIsLoggingOut(true)}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-center justify-between"
        >
          <h2 className="text-3xl font-bold">
            Welcome, {currentSession?.user?.name?.split(" ")[0] || "User"}
          </h2>
          {renderPlanBadge()}
        </motion.div>

        <Card className="border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <SubscriptionPlans onUpgrade={handleUpgrade} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}