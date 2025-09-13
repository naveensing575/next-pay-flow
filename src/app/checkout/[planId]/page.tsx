"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"
import { useSession } from "next-auth/react"
import Notification from "@/components/notification"
declare global {
  interface Window {
    Razorpay: new (options: unknown) => { open: () => void }
  }
}

const plans = {
  basic: {
    name: "Basic Plan",
    price: 5,
    features: ["Up to 3 projects", "20GB storage", "1 device"],
  },
  professional: {
    name: "Professional Plan",
    price: 25,
    features: ["Unlimited projects", "150GB storage", "5 devices"],
  },
  business: {
    name: "Business Plan",
    price: 45,
    features: ["Unlimited projects", "Unlimited storage", "Unlimited devices"],
  },
}

export default function CheckoutPage() {
  const { planId } = useParams<{ planId?: string }>()
  const router = useRouter()
  const { data: session } = useSession()

  const [isPaying, setIsPaying] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const plan = planId ? plans[planId as keyof typeof plans] : undefined
  if (!plan) {
    return <p className="p-8">Invalid plan</p>
  }

  const handlePayNow = async () => {
    setIsPaying(true)
    try {
      // Step 1: Create order
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })

      const data = await res.json()
      if (!data.order) throw new Error(data.error || "Order creation failed")

      // Step 2: Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Next Pay Flow",
        description: `Subscribe to ${plan.name}`,
        order_id: data.order.id,
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          // Step 3: Verify payment
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
            setNotification({ type: "success", message: "Payment successful ✅" })
            setTimeout(() => router.push("/dashboard"), 1500)
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
      console.error("Checkout failed:", err)
      setNotification({ type: "error", message: "Something went wrong ❌" })
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}

      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
        <p className="text-2xl font-bold mb-4">${plan.price}.00 / month</p>
        <ul className="mb-4 list-disc list-inside text-muted-foreground">
          {plan.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <Button
          onClick={handlePayNow}
          disabled={isPaying}
          className="bg-foreground text-background hover:opacity-90"
        >
          {isPaying ? (
            "Processing..."
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
