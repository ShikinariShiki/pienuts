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
  error: string | null
}

const songs: Song[] = [
  {
    title: "七時の食事 (Chocolate Lemon)",
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
    artist: "HOYO-MIX",
    src: "/music/track3.mp3",
  },
  {
    title: "furret walk",
    artist: "bouncyshield",
    src: "/music/track4.mp3",
  },
  {
    title: "A letter",
    artist: "Tsundere Twintails",
    src: "/music/track5.mp3",
  },
  {
    title: "部屋の窓辺",
    artist: "Lamp",
    src: "/music/track6.mp3",
  },
  {
    title: "Flavors",
    artist: "Tsundere Twintails",
    src: "/music/track7.mp3",
  },
  {
    title: "Butterflies",
    artist: "Tsundere Twintails",
    src: "/music/track8.mp3",
  },
  {
    title: "Bossa Break!",
    artist: "Frizk",
    src: "/music/track9.mp3",
  },
  {
    title: "Shower duty",
    artist: "Meaningful Stone",
    src: "/music/track10.mp3",
  },
  {
    title: "nero",
    artist: "フレネシ",
    src: "/music/track11.mp3",
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
  const [error, setError] = useState<string | null>(null)
  const [isFading, setIsFading] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  // Use a ref to store the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize audio element only once on client side
  useEffect(() => {
    if (typeof window === "undefined") return

    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      const audio = new Audio()
      audioRef.current = audio

      // Set initial source
      audio.src = songs[currentSongIndex].src
      audio.load()
      audio.volume = 0 // Start with volume 0 for fade in

      console.log("Audio element created")

      // Check if this is the first visit using sessionStorage
      const hasVisited = sessionStorage.getItem("hasVisitedBefore") === "true"

      if (!hasVisited) {
        // First visit, autoplay with fade in
        const playPromise = audio.play().catch((err) => {
          console.error("Autoplay prevented:", err)
          // Many browsers prevent autoplay, so we'll handle this gracefully
        })

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
              // Fade in
              fadeIn()
            })
            .catch((err) => {
              console.error("Autoplay error:", err)
            })
        }

        // Mark that user has visited
        sessionStorage.setItem("hasVisitedBefore", "true")
      }
    }

    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }

      // Clear any fade intervals
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
      }
    }
  }, [])

  // Fade in function
  const fadeIn = () => {
    if (!audioRef.current) return

    setIsFading(true)
    let vol = 0
    audioRef.current.volume = vol

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return

      vol += 0.05
      if (vol >= volume) {
        vol = volume
        clearInterval(fadeIntervalRef.current!)
        setIsFading(false)
      }

      audioRef.current.volume = isMuted ? 0 : vol
    }, 100)
  }

  // Fade out function
  const fadeOut = () => {
    if (!audioRef.current) return

    setIsFading(true)
    let vol = audioRef.current.volume

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return

      vol -= 0.05
      if (vol <= 0) {
        vol = 0
        clearInterval(fadeIntervalRef.current!)
        setIsFading(false)

        // After fade out completes, we can pause or change track
        return true
      }

      audioRef.current.volume = vol
      return false
    }, 100)

    return false // Not done fading yet
  }

  // Cross fade between tracks
  const crossFade = (nextIndex: number) => {
    if (!audioRef.current) return

    // Start fading out current track
    setIsFading(true)
    let vol = audioRef.current.volume
    let isDone = false

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current || isDone) return

      vol -= 0.05
      if (vol <= 0) {
        vol = 0
        clearInterval(fadeIntervalRef.current!)

        // After fade out completes, change track and fade in
        audioRef.current.src = songs[nextIndex].src
        audioRef.current.load()
        audioRef.current.play().catch((err) => {
          console.error("Play error during crossfade:", err)
        })

        // Start fade in
        let newVol = 0
        audioRef.current.volume = newVol

        fadeIntervalRef.current = setInterval(() => {
          if (!audioRef.current) return

          newVol += 0.05
          if (newVol >= volume) {
            newVol = volume
            clearInterval(fadeIntervalRef.current!)
            setIsFading(false)
          }

          audioRef.current.volume = isMuted ? 0 : newVol
        }, 100)

        isDone = true
      } else {
        audioRef.current.volume = vol
      }
    }, 100)
  }

  // Handle song changes and loading
  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    // Reset error state
    setError(null)

    try {
      // Set the source
      const songSrc = songs[currentSongIndex].src
      console.log(`Loading song: ${songSrc}`)

      // Check if the source has changed before setting it
      if (audio.src !== window.location.origin + songSrc) {
        if (isPlaying && !isFirstLoad) {
          // If already playing and not first load, use crossfade
          crossFade(currentSongIndex)
        } else {
          // Otherwise just load the new track
          audio.src = songSrc
          audio.load()

          // Set audio properties
          audio.volume = isMuted ? 0 : volume
          audio.loop = isLooping

          // If it should be playing, play it
          if (isPlaying) {
            const playPromise = audio.play()
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                console.error("Play failed:", error)
                setError(`Failed to play: ${error.message}`)
                setIsPlaying(false)
              })
            }
          }
        }
      } else {
        // Same source, just update properties
        audio.volume = isMuted ? 0 : volume
        audio.loop = isLooping
      }

      // No longer first load
      setIsFirstLoad(false)
    } catch (err) {
      console.error("Error setting up audio:", err)
      setError(`Error setting up audio: ${err instanceof Error ? err.message : String(err)}`)
      setIsPlaying(false)
    }
  }, [currentSongIndex, isPlaying, volume, isMuted, isLooping, isFirstLoad])

  // Set up event listeners
  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    const handleLoadedMetadata = () => {
      console.log("Audio metadata loaded, duration:", audio.duration)
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
    }

    const handleError = (e: Event) => {
      console.error("Audio error:", e)
      setError(`Audio error: ${audio.error?.message || "Unknown error"}`)
      setIsPlaying(false)
    }

    const handleCanPlay = () => {
      console.log("Audio can play now")
      if (isPlaying) {
        audio.play().catch((err) => {
          console.error("Play failed in canplay handler:", err)
          setIsPlaying(false)
        })
      }
    }

    // Add event listeners
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)
    audio.addEventListener("canplay", handleCanPlay)

    return () => {
      // Remove event listeners on cleanup
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("canplay", handleCanPlay)
    }
  }, [currentSongIndex, isLooping, isPlaying, isShuffling, songs.length])

  const togglePlay = () => {
    if (!audioRef.current) return

    setIsPlaying((prev) => {
      const newIsPlaying = !prev

      if (newIsPlaying) {
        // Try to play with fade in
        if (audioRef.current.volume === 0 || isFading) {
          fadeIn()
        }

        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Toggle play failed:", error)
            setError(`Failed to play: ${error.message}`)
            return false // Keep isPlaying as false if play fails
          })
        }
      } else {
        // Pause with fade out
        const fadeOutComplete = fadeOut()
        if (fadeOutComplete) {
          audioRef.current.pause()
        } else {
          // If fade is not complete, set up a timeout to pause after fade
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause()
            }
          }, 1500) // Slightly longer than the fade duration
        }
      }

      return newIsPlaying
    })
  }

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const toggleLoop = () => {
    setIsLooping((prev) => {
      const newIsLooping = !prev
      if (audioRef.current) {
        audioRef.current.loop = newIsLooping
      }
      return newIsLooping
    })
  }

  const toggleShuffle = () => {
    setIsShuffling((prev) => !prev)
  }

  const toggleQueue = () => {
    setShowQueue((prev) => !prev)
  }

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newIsMuted = !prev
      if (audioRef.current) {
        audioRef.current.volume = newIsMuted ? 0 : volume
      }
      return newIsMuted
    })
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
        error,
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
      error: null,
    }
  }

  return context
}
