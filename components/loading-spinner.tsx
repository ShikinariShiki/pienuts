"use client"

import { motion } from "framer-motion"

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <motion.div
          className="inline-block"
          animate={{ rotate: 360 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
        >
          <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-500"></div>
        </motion.div>
        <p className="mt-4 text-pink-600 dark:text-pink-400">Loading kawaii content...</p>
      </div>
    </div>
  )
}
