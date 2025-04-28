"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { TaskBar } from "@/components/task-bar"
import { PageTransition } from "@/components/page-transition"

export default function Template({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  // Fix navigation issues
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

        // Use Next.js router for navigation
        router.push(newPathname)
      }
    }

    document.addEventListener("click", handleLinkClick)

    return () => {
      document.removeEventListener("click", handleLinkClick)
    }
  }, [router])

  return (
    <>
      <TaskBar />
      <PageTransition>{children}</PageTransition>
    </>
  )
}
