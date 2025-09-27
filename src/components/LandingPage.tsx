'use client';
import React, { useState } from 'react';
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Shield, Zap, BarChart3, Loader2 } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {/* Left Side - Hero Content */}
        <motion.div className="text-white space-y-8" variants={fadeInUp}>
          <div className="space-y-6">
            <motion.div
              className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm"
              variants={fadeInUp}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Trusted by 10,000+ businesses
            </motion.div>

            <motion.h1
              className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              variants={fadeInUp}
            >
              Next Pay Flow
            </motion.h1>

            <motion.p
              className="text-lg text-gray-400 leading-relaxed max-w-lg"
              variants={fadeInUp}
            >
              Streamline your payment processes with our powerful platform.
              Experience seamless transactions and real-time analytics.
            </motion.p>
          </div>

          {/* Features */}
          <motion.div className="space-y-4" variants={stagger}>
            {[
              { icon: Zap, text: "Real-time payment processing", color: "text-blue-500" },
              { icon: Shield, text: "Advanced security & encryption", color: "text-green-500" },
              { icon: BarChart3, text: "Comprehensive analytics", color: "text-purple-500" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 text-gray-300"
                variants={fadeInUp}
                whileHover={{ x: 5 }}
              >
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div className="grid grid-cols-3 gap-6 pt-4" variants={stagger}>
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "$2B+", label: "Processed" },
              { value: "50ms", label: "Response" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Sign In Card */}
        <motion.div
          className="flex justify-center lg:justify-end"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <CardHeader className="text-center space-y-4 pb-6">
              <motion.div
                className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <ArrowRight className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Get Started
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Join thousands of businesses using Next Pay Flow
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-8">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-base rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Signing you in...
                    </>
                  ) : (
                    <>
                      <svg className="mr-3 h-6 w-6" viewBox="0 0 48 48">
                        <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
              </motion.div>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Protected by enterprise-grade security</span>
              </div>

              <div className="space-y-3 pt-2">
                {["Free 30-day trial", "No credit card required", "Cancel anytime"].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="text-center text-xs text-gray-500 pt-4 border-t border-white/10">
                By continuing, you agree to our{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 underline">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Simple background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full filter blur-xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full filter blur-xl"
          animate={{ scale: [1, 0.8, 1], rotate: [0, -180, -360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}