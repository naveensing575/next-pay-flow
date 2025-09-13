'use client'

import { motion } from "framer-motion"
import { CreditCard, Users, Database, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatItem {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  change: string
}

export default function StatsGrid() {
  const stats: StatItem[] = [
    {
      label: 'Active Projects',
      value: '12',
      icon: TrendingUp,
      change: '+23%'
    },
    {
      label: 'Total Transactions',
      value: '1,429',
      icon: CreditCard,
      change: '+12%'
    },
    {
      label: 'Team Members',
      value: '8',
      icon: Users,
      change: '+2'
    },
    {
      label: 'Storage Used',
      value: '2.1 GB',
      icon: Database,
      change: '12%'
    }
  ]

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <Card className="border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}