"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [initialLoad, setInitialLoad] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if this is the first load using sessionStorage
    const isFirstLoad = sessionStorage.getItem("firstLoadDone") !== "true"

    if (isFirstLoad) {
      // First time loading the site in this session
      setLoading(true)
      const timer = setTimeout(() => {
        setLoading(false)
        setInitialLoad(false)
        // Mark that first load is complete for this session
        sessionStorage.setItem("firstLoadDone", "true")
      }, 800)
      return () => clearTimeout(timer)
    } else {
      // Not first load, don't show loading
      setLoading(false)
      setInitialLoad(false)
    }
  }, [])

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
