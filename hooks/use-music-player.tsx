"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext, useRef } from "react"

type Song = {
  title: string
  artist: string
  src: string
}

type MusicPlayerContextType = {
  isPlaying: boolean
  togglePlay: () => void
  currentSongIndex: number
  setCurrentSongIndex: (index: number) => void
  volume: number
  setVolume: (volume: number) => void
  currentTime: number
  duration: number
  progress: number
  seekTo: (time: number) => void
  isLooping: boolean
  toggleLoop: () => void
  isShuffling: boolean
  toggleShuffle: () => void
  nextSong: () => void
  prevSong: () => void
  songs: Song[]
  audioRef: React.RefObject<HTMLAudioElement>
  showQueue: boolean
  toggleQueue: () => void
  isMuted: boolean
  toggleMute: () => void
}

const songs: Song[] = [
  {
    title: "七時の食事(Chocolate Lemon)",
    artist: "Mitsukiyo",
    src: "/music/track1.mp3",
  },
  {
    title: "九時のミルフィーユ",
    artist: "Mitsukiyo",
    src: "/music/track2.mp3",
  },
  {
    title: "Salty Moon",
    artist: "Hoyo-Mix",
    src: "/music/track3.mp3",
  },
  {
    title: "Kawaii Melody",
    artist: "Pastel Dreams",
    src: "/music/track4.mp3",
  },
  {
    title: "Cherry Blossom",
    artist: "Sakura Beats",
    src: "/music/track5.mp3",
  },
]

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [showQueue, setShowQueue] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element only once on client side
  useEffect(() => {
    if (typeof window !== "undefined" && !audioElement) {
      const audio = new Audio()
      audio.preload = "auto"
      setAudioElement(audio)
      audioRef.current = audio
    }
  }, [audioElement])

  // Handle song changes
  useEffect(() => {
    if (!audioElement) return

    // Update source when song changes
    audioElement.src = songs[currentSongIndex].src
    audioElement.load()

    if (isPlaying) {
      const playPromise = audioElement.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Play failed:", error)
          setIsPlaying(false)
        })
      }
    }
  }, [currentSongIndex, audioElement])

  // Handle play/pause
  useEffect(() => {
    if (!audioElement) return

    if (isPlaying) {
      const playPromise = audioElement.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Play failed:", error)
          setIsPlaying(false)
        })
      }
    } else {
      audioElement.pause()
    }
  }, [isPlaying, audioElement])

  // Handle volume and mute changes
  useEffect(() => {
    if (!audioElement) return
    audioElement.volume = isMuted ? 0 : volume
  }, [volume, isMuted, audioElement])

  // Handle loop setting
  useEffect(() => {
    if (!audioElement) return
    audioElement.loop = isLooping
  }, [isLooping, audioElement])

  // Set up event listeners
  useEffect(() => {
    if (!audioElement) return

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime)
      if (audioElement.duration) {
        setProgress((audioElement.currentTime / audioElement.duration) * 100)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration)
    }

    const handleEnded = () => {
      if (isShuffling) {
        // Play a random song excluding the current one
        let nextIndex
        do {
          nextIndex = Math.floor(Math.random() * songs.length)
        } while (nextIndex === currentSongIndex && songs.length > 1)
        setCurrentSongIndex(nextIndex)
      } else if (!isLooping) {
        // Go to next song if not looping
        setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1))
      }
    }

    audioElement.addEventListener("timeupdate", handleTimeUpdate)
    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata)
    audioElement.addEventListener("ended", handleEnded)

    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate)
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audioElement.removeEventListener("ended", handleEnded)
    }
  }, [audioElement, currentSongIndex, isLooping, isShuffling, songs.length])

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  const seekTo = (time: number) => {
    if (audioElement) {
      audioElement.currentTime = time
    }
  }

  const toggleLoop = () => {
    setIsLooping((prev) => !prev)
  }

  const toggleShuffle = () => {
    setIsShuffling((prev) => !prev)
  }

  const toggleQueue = () => {
    setShowQueue((prev) => !prev)
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const nextSong = () => {
    if (isShuffling) {
      // Play a random song excluding the current one
      let nextIndex
      do {
        nextIndex = Math.floor(Math.random() * songs.length)
      } while (nextIndex === currentSongIndex && songs.length > 1)
      setCurrentSongIndex(nextIndex)
    } else {
      // Go to next song
      setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1))
    }
  }

  const prevSong = () => {
    if (isShuffling) {
      // Play a random song excluding the current one
      let nextIndex
      do {
        nextIndex = Math.floor(Math.random() * songs.length)
      } while (nextIndex === currentSongIndex && songs.length > 1)
      setCurrentSongIndex(nextIndex)
    } else {
      // Go to previous song
      setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1))
    }
  }

  return (
    <MusicPlayerContext.Provider
      value={{
        isPlaying,
        togglePlay,
        currentSongIndex,
        setCurrentSongIndex,
        volume,
        setVolume,
        currentTime,
        duration,
        progress,
        seekTo,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        nextSong,
        prevSong,
        songs,
        audioRef,
        showQueue,
        toggleQueue,
        isMuted,
        toggleMute,
      }}
    >
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
      volume: 0.7,
      setVolume: () => {},
      currentTime: 0,
      duration: 0,
      progress: 0,
      seekTo: () => {},
      isLooping: false,
      toggleLoop: () => {},
      isShuffling: false,
      toggleShuffle: () => {},
      nextSong: () => {},
      prevSong: () => {},
      songs: songs,
      audioRef: { current: null },
      showQueue: false,
      toggleQueue: () => {},
      isMuted: false,
      toggleMute: () => {},
    }
  }

  return context
}
