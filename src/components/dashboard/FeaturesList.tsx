'use client'

import { motion } from "framer-motion"
import { Zap, Shield, TrendingUp, Smartphone } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
}

export default function FeaturesList() {
  const features: FeatureItem[] = [
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Process payments in milliseconds",
    },
    {
      icon: Shield,
      title: "Bank-level Security",
      desc: "Your data is always protected",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      desc: "Deep insights into your business",
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      desc: "Works perfectly on all devices",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="border-border bg-background text-foreground">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Why Choose Next-Pay-Flow?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <feature.icon className="w-5 h-5 text-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
