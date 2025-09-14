"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Check, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  popular?: boolean
}

interface SubscriptionPlansProps {
  onUpgrade: (planId: string) => Promise<void> | void
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("professional")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const plans: Plan[] = [
    {
      id: "basic",
      name: "Basic Plan",
      price: 5,
      features: ["Up to 3 projects", "20GB of storage", "Up to 1 device"],
    },
    {
      id: "professional",
      name: "Professional Plan",
      price: 25,
      features: ["Unlimited projects", "150GB of storage", "Up to 5 devices"],
      popular: true,
    },
    {
      id: "business",
      name: "Business Plan",
      price: 45,
      features: ["Unlimited projects", "Unlimited storage", "Unlimited devices"],
    },
  ]

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      await onUpgrade(selectedPlan)
    } catch (err) {
      console.error("Error in handleUpgrade:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold text-center mb-8"
      >
        Choose your plan
      </motion.h2>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id
          return (
            <motion.div
              key={plan.id}
              layoutId={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative flex flex-col justify-between p-6 md:p-8 rounded-2xl border cursor-pointer transition-all h-full ${isSelected
                  ? "border-indigo-500 shadow-xl"
                  : "border-border hover:border-indigo-400/60"
                } ${plan.popular ? "ring-1 ring-indigo-300/40" : ""}`}
              whileHover={{ y: -4 }}
              animate={{
                scale: isSelected ? 1.05 : 1,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {plan.popular && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </motion.div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-1">${plan.price}.00</div>
                <p className="text-muted-foreground">per month</p>
              </div>

              <div className="space-y-2 mb-6 flex-1">
                <p className="text-sm font-medium mb-2">Features</p>
                {plan.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Check className="w-4 h-4 text-foreground mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                className={`w-full ${isSelected
                    ? "bg-indigo-600 text-white border border-indigo-600 hover:bg-indigo-700 hover:text-white"
                    : "bg-transparent text-foreground border border-foreground hover:bg-indigo-600 hover:text-white"
                  }`}
              >
                {isSelected ? "Selected" : "Choose plan"}
              </Button>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div
        className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div>
          <p className="text-sm text-muted-foreground">
            Selected: {" "}
            <span className="font-medium">
              {plans.find((p) => p.id === selectedPlan)?.name}
            </span>
          </p>
          <p className="text-2xl font-bold">
            ${plans.find((p) => p.id === selectedPlan)?.price}.00/month
          </p>
        </div>
        <Button
          onClick={handleUpgrade}
          disabled={isLoading}
          className="bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white min-w-[160px]"
          size="lg"
        >
          {isLoading ? (
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Upgrade Now
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}

export default SubscriptionPlans