'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import LogoutButton from "@/components/auth/LogoutButton"

interface AccountCardProps {
  session: {
    user: {
      name?: string | null
      email?: string | null
      plan?: string
    }
  }
}

export default function AccountCard({ session }: AccountCardProps) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Account Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Email</p>
          <p className="font-medium text-gray-900">{session.user?.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Current Plan</p>
          <Badge
            variant={session.user?.plan === 'free' ? 'secondary' : 'default'}
            className="capitalize"
          >
            {session.user?.plan || 'Free'}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Member Since</p>
          <p className="font-medium text-gray-900">January 2024</p>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <LogoutButton />
        </div>
      </CardContent>
    </Card>
  )
}