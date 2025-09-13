'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import LogoutButton from "@/components/auth/LogoutButton"

interface AccountCardProps {
  session: {
    user: {
      name?: string | null
      email?: string | null
      plan?: string | null
      subscription?: {
        planId?: string
        status?: string
        updatedAt?: string
      }
    }
  }
}

export default function AccountCard({ session }: AccountCardProps) {
  const subscription = session.user?.subscription
  const plan = subscription?.planId || session.user?.plan || "free"
  const status = subscription?.status || (plan !== "free" ? "active" : "inactive")

  return (
    <Card className="border-border bg-background text-foreground">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Account Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Email</p>
          <p className="font-medium text-foreground">{session.user?.email}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
          <Badge
            variant={plan === "free" ? "secondary" : "default"}
            className="capitalize"
          >
            {plan}
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">Status: {status}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Member Since</p>
          <p className="font-medium text-foreground">January 2024</p>
        </div>
        <div className="pt-4 border-t border-border">
          <LogoutButton />
        </div>
      </CardContent>
    </Card>
  )
}
