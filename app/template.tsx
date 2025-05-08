"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { TaskBar } from "@/components/task-bar"
import { motion, AnimatePresence } from "framer-motion"

export default function Template({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [prevPathname, setPrevPathname] = useState(pathname)
  const contentRef = useRef<HTMLDivElement>(null)

  // Track pathname changes for transitions
  useEffect(() => {
    if (pathname !== prevPathname) {
      // Start transition
      setIsTransitioning(true)

      // After transition completes
      const timer = setTimeout(() => {
        setPrevPathname(pathname)
        setIsTransitioning(false)

        // Scroll to top smoothly
        if (contentRef.current) {
          contentRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        } else {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [pathname, prevPathname])

  // Fix navigation issues and implement AJAX-like transitions
  useEffect(() => {
    // Add event listener for link clicks to prevent full page reloads
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")

      if (
        link &&
        link.href &&
        link.href.startsWith(window.location.origin) &&
        !link.hasAttribute("target") &&
        !link.hasAttribute("download") &&
        !(e.ctrlKey || e.metaKey || e.shiftKey)
      ) {
        e.preventDefault()

        // Extract the pathname from the link
        const url = new URL(link.href)
        const newPathname = url.pathname

        // Don't reload if clicking the current page
        if (newPathname === pathname) return

        // Start transition animation
        setIsTransitioning(true)

        // Short delay to allow animation to start
        setTimeout(() => {
          // Use Next.js router for navigation
          router.push(newPathname)
        }, 50)
      }
    }

    document.addEventListener("click", handleLinkClick)

    return () => {
      document.removeEventListener("click", handleLinkClick)
    }
  }, [router, pathname])

  return (
    <>
      <TaskBar />
      <div ref={contentRef} className="page-container overflow-auto h-[calc(100vh-3rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-[calc(100vh-3rem)]"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
