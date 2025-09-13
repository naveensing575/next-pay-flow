"use client"

import { motion } from "framer-motion"

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <motion.div
        className="w-10 h-10 border-4 border-foreground border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  )
}
