"use client"

import type React from "react"
import { useEffect } from "react"
import { MusicPlayer } from "@/components/music-player"
import { TaskBar } from "@/components/task-bar"
import { PageTransition } from "@/components/page-transition"

export default function Template({ children }: { children: React.ReactNode }) {
  // Set up client-side navigation without loading
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

        // Use History API for client-side navigation
        window.history.pushState({}, "", link.href)

        // Dispatch a popstate event to trigger route change
        window.dispatchEvent(new PopStateEvent("popstate"))
      }
    }

    document.addEventListener("click", handleLinkClick)

    return () => {
      document.removeEventListener("click", handleLinkClick)
    }
  }, [])

  return (
    <>
      <TaskBar />
      <PageTransition>{children}</PageTransition>
      <MusicPlayer />
    </>
  )
}
