"use client"

import { motion } from "framer-motion"
import { DrawingCanvas } from "@/components/drawing-canvas"
import { PageNavigation } from "@/components/page-navigation"

export default function DrawPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-16 pb-8">
      <div className="w-full max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-pink-600 dark:text-pink-300 mb-2">Drawing Canvas ♡</h1>
          <p className="text-gray-600 dark:text-gray-400">Create a cute drawing to share with Pien!</p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-pink-200 dark:border-pink-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="p-4 bg-gradient-to-b from-pink-50 to-white dark:from-gray-800 dark:to-gray-900">
            <DrawingCanvas />
          </div>
        </motion.div>

        <div className="mt-6">
          <PageNavigation />
        </div>
      </div>
    </div>
  )
}
