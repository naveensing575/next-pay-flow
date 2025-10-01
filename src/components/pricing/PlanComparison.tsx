"use client"
import { motion } from "framer-motion"
import { Check, X, Star, Crown, Gem } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Feature {
  name: string
  free: boolean | string
  basic: boolean | string
  professional: boolean | string
  business: boolean | string
}

export default function PlanComparison() {
  const features: Feature[] = [
    {
      name: "Projects",
      free: "1 project",
      basic: "Up to 3 projects",
      professional: "Unlimited",
      business: "Unlimited",
    },
    {
      name: "Storage",
      free: "5GB",
      basic: "20GB",
      professional: "150GB",
      business: "Unlimited",
    },
    {
      name: "Devices",
      free: "1 device",
      basic: "Up to 1 device",
      professional: "Up to 5 devices",
      business: "Unlimited",
    },
    {
      name: "Team Members",
      free: false,
      basic: false,
      professional: "Up to 5",
      business: "Unlimited",
    },
    {
      name: "24/7 Support",
      free: false,
      basic: false,
      professional: true,
      business: true,
    },
    {
      name: "Advanced Analytics",
      free: false,
      basic: false,
      professional: true,
      business: true,
    },
    {
      name: "Custom Integrations",
      free: false,
      basic: false,
      professional: false,
      business: true,
    },
    {
      name: "Priority Support",
      free: false,
      basic: false,
      professional: false,
      business: true,
    },
    {
      name: "API Access",
      free: false,
      basic: false,
      professional: false,
      business: true,
    },
    {
      name: "Dedicated Account Manager",
      free: false,
      basic: false,
      professional: false,
      business: true,
    },
  ]

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      description: "Perfect for trying out",
      icon: Gem,
      color: "gray",
      popular: false,
    },
    {
      id: "basic",
      name: "Basic",
      price: 5,
      description: "For personal use",
      icon: Star,
      color: "yellow",
      popular: false,
    },
    {
      id: "professional",
      name: "Professional",
      price: 25,
      description: "For professionals",
      icon: Crown,
      color: "blue",
      popular: true,
    },
    {
      id: "business",
      name: "Business",
      price: 45,
      description: "For growing teams",
      icon: Gem,
      color: "purple",
      popular: false,
    },
  ]

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "string") {
      return <span className="text-sm font-medium">{value}</span>
    }
    if (value === true) {
      return <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
    }
    return <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />
  }

  return (
    <div className="w-full py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Compare Plans
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your needs. All plans include core features.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="overflow-x-auto"
      >
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-border rounded-lg">
            <table className="min-w-full divide-y divide-border">
              {/* Header */}
              <thead className="bg-muted/50">
                <tr>
                  <th
                    scope="col"
                    className="py-6 px-6 text-left text-sm font-semibold"
                  >
                    Features
                  </th>
                  {plans.map((plan, index) => {
                    const Icon = plan.icon
                    return (
                      <th
                        key={plan.id}
                        scope="col"
                        className="py-6 px-6 text-center relative"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          {plan.popular && (
                            <Badge className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs">
                              Most Popular
                            </Badge>
                          )}
                          <div className="flex items-center justify-center gap-2 mb-2 mt-4">
                            <Icon className={`w-5 h-5 text-${plan.color}-600`} />
                            <span className="text-lg font-bold">{plan.name}</span>
                          </div>
                          <div className="text-2xl font-bold mb-1">
                            ${plan.price}
                            <span className="text-sm font-normal text-muted-foreground">
                              /mo
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            {plan.description}
                          </p>
                          <Button
                            asChild
                            size="sm"
                            variant={plan.popular ? "default" : "outline"}
                            className={
                              plan.popular
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : ""
                            }
                          >
                            <Link href={plan.id === "free" ? "/login" : "/login"}>
                              {plan.id === "free" ? "Get Started" : "Choose Plan"}
                            </Link>
                          </Button>
                        </motion.div>
                      </th>
                    )
                  })}
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-border bg-card">
                {features.map((feature, featureIndex) => (
                  <motion.tr
                    key={feature.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + featureIndex * 0.02 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm font-medium">
                      {feature.name}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {renderFeatureValue(feature.free)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {renderFeatureValue(feature.basic)}
                    </td>
                    <td className="py-4 px-6 text-center bg-blue-50/50 dark:bg-blue-950/20">
                      {renderFeatureValue(feature.professional)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {renderFeatureValue(feature.business)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>

              {/* Footer CTAs */}
              <tfoot className="bg-muted/50">
                <tr>
                  <td className="py-6 px-6"></td>
                  {plans.map((plan) => (
                    <td key={`footer-${plan.id}`} className="py-6 px-6 text-center">
                      <Button
                        asChild
                        variant={plan.popular ? "default" : "outline"}
                        className={
                          plan.popular
                            ? "bg-blue-600 hover:bg-blue-700 text-white w-full"
                            : "w-full"
                        }
                      >
                        <Link href={plan.id === "free" ? "/login" : "/login"}>
                          {plan.id === "free" ? "Start Free" : "Get Started"}
                        </Link>
                      </Button>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-8"
      >
        <p className="text-sm text-muted-foreground">
          All plans include 30-day money-back guarantee. No credit card required for Free plan.
        </p>
      </motion.div>
    </div>
  )
}