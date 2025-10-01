"use client"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-red-50 dark:from-black dark:to-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Something went wrong!
          </h1>
          <p className="text-lg text-muted-foreground">
            We encountered an unexpected error
          </p>
        </motion.div>

        {process.env.NODE_ENV === "development" && error.message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg text-left"
          >
            <p className="text-sm font-mono text-red-800 dark:text-red-200 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-base text-muted-foreground mb-8 max-w-md mx-auto"
        >
          Don&apos;t worry, this happens sometimes. Try refreshing the page or go back to the homepage.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={reset}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white min-w-[160px]"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="min-w-[160px]"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <p className="text-sm text-muted-foreground">
            If this problem persists, please{" "}
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium underline"
            >
              contact support
            </Link>{" "}
            with the error details above.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}