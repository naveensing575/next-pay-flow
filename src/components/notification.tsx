"use client"

import { toast } from "sonner"

type NotificationType = "success" | "error" | "info" | "warning"

export function notify(type: NotificationType, message: string) {
  switch (type) {
    case "success":
      toast.success(message)
      break
    case "error":
      toast.error(message)
      break
    case "info":
      toast(message)
      break
    case "warning":
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      toast.warning ? toast.warning(message) : toast(message)
      break
    default:
      toast(message)
  }
}
