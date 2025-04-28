"use client"

import type React from "react"
import { MusicPlayer } from "@/components/music-player"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MusicPlayer />
      {children}
    </>
  )
}
