"use client"

import type React from "react"

import { useState, createContext, useContext } from "react"

type MusicPlayerContextType = {
  isPlaying: boolean
  togglePlay: () => void
  currentSongIndex: number
  setCurrentSongIndex: React.Dispatch<React.SetStateAction<number>>
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <MusicPlayerContext.Provider value={{ isPlaying, togglePlay, currentSongIndex, setCurrentSongIndex }}>
      {children}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)

  if (context === undefined) {
    // Return a default implementation if used outside provider
    return {
      isPlaying: false,
      togglePlay: () => {},
      currentSongIndex: 0,
      setCurrentSongIndex: () => {},
    }
  }

  return context
}
