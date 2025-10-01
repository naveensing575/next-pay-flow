"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import {
  Download,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Receipt,
  ArrowLeft
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/dashboard/layout/Navbar"
import Link from "next/link"
import { notify } from "@/components/notification"

interface Payment {
  id: string
  orderId: string
  paymentId: string
  planId: string
  status: string
  amount: number
  currency: string
  createdAt: string
  updatedAt: string
}

export default function BillingPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      fetchPaymentHistory()
    }
  }, [status])

  const fetchPaymentHistory = async () => {
    try {
      const res = await fetch("/api/payments/history")
      const data = await res.json()

      if (data.payments) {
        setPayments(data.payments)
      } else {
        notify("error", "Failed to fetch payment history")
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
      notify("error", "Failed to load payment history")
    } finally {
      setIsLoading(false)
    }
  }

  const downloadInvoice = async (payment: Payment) => {
    try {
      notify("info", "Generating invoice...")

      const res = await fetch("/api/payments/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: payment.id }),
      })

      if (!res.ok) throw new Error("Failed to generate invoice")

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${payment.orderId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      notify("success", "Invoice downloaded successfully")
    } catch (error) {
      console.error("Error downloading invoice:", error)
      notify("error", "Failed to download invoice")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "pending":
      case "created":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "failed":
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Receipt className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      case "pending":
      case "created":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      case "failed":
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getPlanName = (planId: string) => {
    const names: Record<string, string> = {
      basic: "Basic Plan",
      professional: "Professional Plan",
      business: "Business Plan",
    }
    return names[planId] || planId
  }

  if (status === "loading" || isLoggingOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-black dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-black dark:to-gray-900">
      <Navbar
        session={session}
        onLogoutStart={() => setIsLoggingOut(true)}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            asChild
            variant="ghost"
            className="mb-4"
          >
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Billing & Invoices</h1>
              <p className="text-muted-foreground">
                View your payment history and download invoices
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : payments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-blue-200">
              <CardContent className="py-16 text-center">
                <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No payment history</h3>
                <p className="text-muted-foreground mb-6">
                  You haven&apos;t made any payments yet
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/dashboard">
                    View Plans
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {payments.map((payment, index) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getStatusIcon(payment.status)}
                        </div>
                        <div>
                          <CardTitle className="text-lg mb-1">
                            {getPlanName(payment.planId)}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Order ID: {payment.orderId}
                          </p>
                          {payment.paymentId && (
                            <p className="text-xs text-muted-foreground">
                              Payment ID: {payment.paymentId}
                            </p>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">
                            ₹{payment.amount}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {payment.currency}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(payment.createdAt)}
                        </p>
                      </div>

                      {payment.status === "active" && (
                        <Button
                          onClick={() => downloadInvoice(payment)}
                          variant="outline"
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {payments.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-6 bg-blue-50 dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-gray-700"
          >
            <p className="text-sm text-muted-foreground text-center">
              Need help with billing?{" "}
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium underline"
              >
                Contact support
              </Link>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
