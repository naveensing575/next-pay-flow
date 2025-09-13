'use client'

import { motion } from "framer-motion"
import { CreditCard, BarChart3, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface ActionItem {
  title: string
  desc: string
  icon: React.ComponentType<{ className?: string }>
}

export default function QuickActions() {
  const actions: ActionItem[] = [
    {
      title: "Create New Project",
      desc: "Start a new payment flow",
      icon: CreditCard
    },
    {
      title: "View Analytics",
      desc: "Check your performance",
      icon: BarChart3
    },
    {
      title: "Manage Team",
      desc: "Invite team members",
      icon: Users
    }
  ]

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action, index) => (
            <motion.button
              key={action.title}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
              whileHover={{ x: 4 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center">
                <action.icon className="w-4 h-4 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-600">{action.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}