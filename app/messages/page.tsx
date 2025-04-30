"use client"

import { motion } from "framer-motion"
import { PageNavigation } from "@/components/page-navigation"

export default function MessagesPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-8">
      <motion.div
        className="card w-full max-w-2xl p-6"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h1
          className="text-3xl font-bold text-pink-600 dark:text-pink-300 mb-2 text-center"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Messages <span className="text-pink-400 dark:text-pink-200">♡</span>
        </motion.h1>

        <motion.p
          className="text-center text-gray-500 dark:text-gray-400 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Send me an anonymous message!
        </motion.p>

        <motion.div
          className="mb-8 w-full overflow-hidden rounded-xl"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          style={{ height: "600px" }}
        >
          <iframe
            src="https://secreto.site/a7x8u7"
            width="100%"
            height="100%"
            style={{ border: "none", borderRadius: "12px" }}
            title="Secreto Messages"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </motion.div>

        <PageNavigation />
      </motion.div>
    </div>
  )
}
