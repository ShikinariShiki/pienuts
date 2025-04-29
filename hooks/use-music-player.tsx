"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext, useRef } from "react"

type Song = {
  title: string
  artist: string
  src: string
  id?: string // Added ID for drag-and-drop functionality
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
  setSongs: (songs: Song[]) => void // Add this function to the type
  audioRef: React.RefObject<HTMLAudioElement>
  showQueue: boolean
  toggleQueue: () => void
  isMuted: boolean
  toggleMute: () => void
  error: string | null
  reorderSongs: (fromIndex: number, toIndex: number) => void // New function for reordering
  originalSongs: Song[] // Keep track of original song order
  resetPlaylist: () => void // Reset playlist to original order
}

// Add unique IDs to songs for drag-and-drop functionality
const originalSongs: Song[] = [
  {
    id: "song-1",
    title: "七時の食事 (Chocolate Lemon)",
    artist: "Mitsukiyo",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track1-R0VtvF2UZHaycrG1srAGW6vRP8OwXs.mp3",
  },
  {
    id: "song-2",
    title: "九時のミルフィーユ",
    artist: "Mitsukiyo",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track2-EYAz7PN9Ur27ZmaVVgGVb0Nd1OY11O.mp3",
  },
  {
    id: "song-3",
    title: "3:03 PM",
    artist: "しゃろう",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track3-hWNRxk4yTgOxp60Q31R850m5NNgmkd.mp3",
  },
  {
    id: "song-4",
    title: "furret walk",
    artist: "bouncyshield",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track4-X9SskfFS9trKCAAL6QXFcD5URoTJD5.mp3",
  },
  {
    id: "song-5",
    title: "A letter",
    artist: "Tsundere Twintails",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track5-zVmyFxVBayqGQAqY72A3FDISeRHmco.mp3",
  },
  {
    id: "song-6",
    title: "部屋の窓辺",
    artist: "Lamp",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track6-9zYOInZ5Dwomt9BzfV4wIO58FrN16u.mp3",
  },
  {
    id: "song-7",
    title: "Flavors",
    artist: "Tsundere Twintails",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track7-dcWEuVvUxhRhZfPsUheovoNrUjQZyS.mp3",
  },
  {
    id: "song-8",
    title: "Butterflies",
    artist: "Tsundere Twintails",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track8-lgqHwe8ZI67oydia0AY2gtyRJ0YPKp.mp3",
  },
  {
    id: "song-9",
    title: "Bossa Break!",
    artist: "Frizk",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track9-FZsIlLkOslfPJCNIUMUKveuZldf0xI.mp3",
  },
  {
    id: "song-10",
    title: "Shower duty",
    artist: "Meaningful Stone",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track10-hsMclXH5riT5VmZKX6tVESSxlYuBf7.mp3",
  },
  {
    id: "song-11",
    title: "nero",
    artist: "フレネシ",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track11-urtJFDxw2AlfXZVJjV72FqDuIJACiB.mp3",
  },
  {
    id: "song-12",
    title: "from the start",
    artist: "j1ggs",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track12-gRqfqofQCSoTCjA1pLnLATNijLaSmV.mp3",
  },
  {
    id: "song-13",
    title: "the cat from ipanema",
    artist: "j1ggs",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track13-MTNQYyHAummXGrHxcQmsfto1LPlCj6.mp3",
  },
  {
    id: "song-14",
    title: "silliest of them all",
    artist: "xylz",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track14-Fs3Ovlt5l4eiNDAqpJAdf90QPFBM0h.mp3",
  },
  {
    id: "song-15",
    title: "Falling Behind",
    artist: "Laufey",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track15-ZrcnI0c2Vvz4BvlY9fDjke50azgVxp.mp3",
  },
  {
    id: "song-16",
    title: "Patty no Theme",
    artist: "Satoru Kōsaki",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track16-rWNW1CluTgjARgiVI9GEfKe2bgMF5r.mp3",
  },
  {
    id: "song-17",
    title: "2:23 AM",
    artist: "しゃろう",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track17-6v9CiFHs3eLWi0YmGbydgBUFkOCFXV.mp3",
  },
  {
    id: "song-18",
    title: "Treat",
    artist: "Kyatto",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track18-kb7vG1Ao3glrs1cZOnCAeKl5j5k88D.mp3",
  },
  {
    id: "song-19",
    title: "silly willy",
    artist: "yawn.",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track19-j6lL1r2IziKjM2v3ge4TQJeXB8OVPB.mp3",
  },
  {
    id: "song-20",
    title: "U & I",
    artist: "Seycara Orchestral",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track20-L49EbPp30L55AjHLR5mpvxVcMsBFop.mp3",
  },
  {
    id: "song-21",
    title: "i love cats :3",
    artist: "yawn.",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track21-f8Tit5pzr6mRCZg2oGhiMQGvbxNJpE.mp3",
  },
  {
    id: "song-22",
    title: "Seashells",
    artist: "Tsundere Twintails",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track22-2AcZu9FJ2VSgGkvM3bwiohT8KGnTeS.mp3",
  },
  {
    id: "song-23",
    title: "Birds",
    artist: "Tsundere Twintails",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track23-WlqDGFp7EC58V7HXzR6y3TzP4iwwSa.mp3",
  },
]

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([...originalSongs])
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

  // Function to reorder songs (for drag-and-drop)
  const reorderSongs = (fromIndex: number, toIndex: number) => {
    const updatedSongs = [...songs]
    const [movedSong] = updatedSongs.splice(fromIndex, 1)
    updatedSongs.splice(toIndex, 0, movedSong)

    // If the current song was moved, update the current song index
    if (currentSongIndex === fromIndex) {
      setCurrentSongIndex(toIndex)
    } else if (
      (fromIndex < currentSongIndex && toIndex >= currentSongIndex) ||
      (fromIndex > currentSongIndex && toIndex <= currentSongIndex)
    ) {
      // Adjust current song index if the moved song crossed over it
      setCurrentSongIndex(fromIndex < currentSongIndex ? currentSongIndex - 1 : currentSongIndex + 1)
    }

    setSongs(updatedSongs)
  }

  // Function to reset playlist to original order
  const resetPlaylist = () => {
    const currentSong = songs[currentSongIndex]
    setSongs([...originalSongs])

    // Find the index of the current song in the original playlist
    const newIndex = originalSongs.findIndex((song) => song.id === currentSong.id)
    if (newIndex !== -1) {
      setCurrentSongIndex(newIndex)
    } else {
      setCurrentSongIndex(0)
    }
  }

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

  // Cross fade between tracks - improved for smoother transitions
  const crossFade = (nextIndex: number) => {
    if (!audioRef.current) return

    // Create a new audio element for the next track
    const nextAudio = new Audio()
    nextAudio.src = songs[nextIndex].src
    nextAudio.volume = 0
    nextAudio.load()

    // Start loading the next track
    const loadPromise = nextAudio.play().catch((err) => {
      console.error("Failed to preload next track:", err)
      // Fall back to simple track switching
      if (audioRef.current) {
        audioRef.current.src = songs[nextIndex].src
        audioRef.current.load()
        audioRef.current.play().catch((err) => {
          console.error("Play error during fallback:", err)
        })
      }
      return null
    })

    if (loadPromise === null) return

    // Start fading out current track
    setIsFading(true)
    let currentVol = audioRef.current.volume
    let nextVol = 0

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) {
        clearInterval(fadeIntervalRef.current!)
        return
      }

      // Decrease current track volume
      currentVol -= 0.05
      // Increase next track volume
      nextVol += 0.05

      if (currentVol <= 0) {
        // Current track fade out complete
        currentVol = 0
        audioRef.current.pause()

        // Continue fading in next track if needed
        if (nextVol < volume) {
          nextAudio.volume = nextVol
        } else {
          // Both fades complete
          nextAudio.volume = volume
          clearInterval(fadeIntervalRef.current!)
          setIsFading(false)

          // Replace the audio reference
          audioRef.current = nextAudio
        }
      } else {
        // Both fades in progress
        audioRef.current.volume = currentVol
        nextAudio.volume = Math.min(nextVol, volume)
      }
    }, 50) // Faster interval for smoother crossfade
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
      if (audio.src !== songSrc) {
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
  }, [currentSongIndex, isPlaying, volume, isMuted, isLooping, isFirstLoad, songs])

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
      audio.removeEventListener("loadedmetadata", handleTimeUpdate)
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
        setSongs, // Export the setSongs function
        audioRef,
        showQueue,
        toggleQueue,
        isMuted,
        toggleMute,
        error,
        reorderSongs,
        originalSongs,
        resetPlaylist,
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
      songs: originalSongs,
      setSongs: () => {}, // Add default implementation
      audioRef: { current: null },
      showQueue: false,
      toggleQueue: () => {},
      isMuted: false,
      toggleMute: () => {},
      error: null,
      reorderSongs: () => {},
      originalSongs,
      resetPlaylist: () => {},
    }
  }

  return context
}
