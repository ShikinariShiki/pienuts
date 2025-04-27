"use client"

import type React from "react"

import { TaskBar } from "@/components/task-bar"
import { PageTransition } from "@/components/page-transition"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TaskBar />
      <PageTransition>{children}</PageTransition>
    </>
  )
}
