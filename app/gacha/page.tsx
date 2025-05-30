"use client"

import { motion } from "framer-motion"
import { WordOfDayGacha } from "@/components/word-of-day-gacha"
import { PageNavigation } from "@/components/page-navigation"

export default function GachaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-8">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <WordOfDayGacha />

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-pink-600 dark:text-pink-300 text-sm">
            Specially handpicked by Pien, with love! ♡
          </p>
        </motion.div>

        <PageNavigation />
      </motion.div>
    </div>
  )
}
