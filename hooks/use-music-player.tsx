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

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    const audio = audioRef.current

    // Set audio properties
    audio.src = songs[currentSongIndex].src
    audio.volume = isMuted ? 0 : volume
    audio.loop = isLooping

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
        setCurrentTime(audio.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
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
      // If looping, the audio.loop property will handle it
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    // Handle play state
    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Play error:", error)
          setIsPlaying(false)
        })
      }
    } else {
      audio.pause()
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentSongIndex, isPlaying, isLooping, isShuffling, volume, isMuted])

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const toggleLoop = () => {
    setIsLooping(!isLooping)
  }

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling)
  }

  const toggleQueue = () => {
    setShowQueue(!showQueue)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
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
