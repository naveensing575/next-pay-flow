"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle } from "lucide-react"

interface NotificationProps {
  type: "success" | "error"
  message: string
}

export default function Notification({ type, message }: NotificationProps) {
  return (
    <Alert
      className={`fixed top-5 right-5 max-w-sm shadow-lg ${type === "success"
          ? "border-green-500 text-green-700 bg-green-50"
          : "border-red-500 text-red-700 bg-red-50"
        }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : (
        <XCircle className="h-5 w-5" />
      )}
      <AlertTitle>{type === "success" ? "Success" : "Error"}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
