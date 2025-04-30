"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    // Skip loading screen entirely - implement AJAX-like behavior
    setInitialLoad(false)
  }, [])

  return (
    <AnimatePresence mode="wait">
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
    </AnimatePresence>
  )
}
