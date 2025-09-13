'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Check, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  popular?: boolean
}

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade?: (planId: string) => void
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onUpgrade
}) => {
  const [selectedPlan, setSelectedPlan] = useState('professional')
  const [isLoading, setIsLoading] = useState(false)

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 5,
      features: [
        'Up to 3 projects',
        '20GB of storage',
        'Up to 1 device',
        'Email support'
      ]
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      price: 25,
      features: [
        'Unlimited projects',
        '150GB of storage',
        'Up to 5 devices',
        'Priority support',
        'Advanced analytics'
      ],
      popular: true
    },
    {
      id: 'business',
      name: 'Business Plan',
      price: 45,
      features: [
        'Unlimited projects',
        'Unlimited storage',
        'Unlimited devices',
        '24/7 phone support',
        'Custom integrations',
        'Team collaboration'
      ]
    }
  ]

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      onUpgrade?.(selectedPlan)
      onClose()
    } catch (error) {
      console.error('Upgrade failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Choose the right pricing plan for you
                </h2>
                <div className="flex items-center mt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"
                      />
                    ))}
                  </div>
                  <div className="ml-3 flex items-center">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4].map((i) => (
                        <span key={i}>★</span>
                      ))}
                      <span className="text-gray-300">★</span>
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      4/5 from 150+ reviews
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === plan.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                    } ${plan.popular ? 'ring-2 ring-black ring-opacity-20' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </motion.div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      ${plan.price}.00
                    </div>
                    <p className="text-gray-600">per month</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Features</p>
                    {plan.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <Button
                    className={`w-full ${selectedPlan === plan.id
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    variant={selectedPlan === plan.id ? 'default' : 'secondary'}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Choose plan'}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <motion.div
              className="mt-8 pt-6 border-t border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Selected:{' '}
                    <span className="font-medium">
                      {plans.find(p => p.id === selectedPlan)?.name}
                    </span>
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${plans.find(p => p.id === selectedPlan)?.price}.00/month
                  </p>
                </div>
                <Button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="bg-black text-white hover:bg-gray-800 min-w-[140px]"
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
              </div>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

export default SubscriptionModal