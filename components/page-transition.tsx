"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [initialLoad, setInitialLoad] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only show loading on initial page load
    if (initialLoad) {
      const timer = setTimeout(() => {
        setLoading(false)
        setInitialLoad(false)
      }, 800)
      return () => clearTimeout(timer)
    } else {
      setLoading(false)
    }
  }, [initialLoad])

  return (
    <AnimatePresence mode="wait">
      {loading && initialLoad ? (
        <LoadingSpinner />
      ) : (
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          className="page-transition"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
