"use client"

import { motion } from "framer-motion"

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <motion.div
          className="inline-block"
          animate={{ rotate: 360 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, ease: "linear" }}
        >
          <div className="w-10 h-10 rounded-full border-3 border-pink-200 border-t-pink-500"></div>
        </motion.div>
      </div>
    </div>
  )
}
