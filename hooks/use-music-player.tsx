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
  setSongs: (songs: Song[]) => void
  audioRef: React.RefObject<HTMLAudioElement>
  showQueue: boolean
  toggleQueue: () => void
  isMuted: boolean
  toggleMute: () => void
  error: string | null
  reorderSongs: (fromIndex: number, toIndex: number) => void
  originalSongs: Song[]
  resetPlaylist: () => void
  crossfadeDuration: number
  setCrossfadeDuration: (duration: number) => void
}

// Original songs array remains unchanged...
const originalSongs: Song[] = [
  {
    id: "song-1",
    title: "ユメの喫茶店 (Yume no Kissaten)",
    artist: "Mitsukiyo",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track24-siq4T3PkO7phbwkjhpw2PL1JJPhSUK.mp3",
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
  {
    id: "song-24",
    title: "七時の食事 (Chocolate Lemon)",
    artist: "Mitsukiyo",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track1-R0VtvF2UZHaycrG1srAGW6vRP8OwXs.mp3",
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

  // State for crossfade
  const [isFading, setIsFading] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [crossfadeDuration, setCrossfadeDuration] = useState(3) // Default 3 seconds

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const nextAudioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const preloadTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const nextSongPreloadedRef = useRef<boolean>(false)
  const lastPlayedTimeRef = useRef<number>(0)

  // Function to reorder songs (for drag-and-drop)
  const reorderSongs = (fromIndex: number, toIndex: number) => {
    const updatedSongs = [...songs]
    const [movedSong] = updatedSongs.splice(fromIndex, 1)
    updatedSongs.splice(toIndex, 0, movedSong)

    let newCurrentIndex = currentSongIndex
    if (currentSongIndex === fromIndex) {
      newCurrentIndex = toIndex
    } else if (
      (fromIndex < currentSongIndex && toIndex >= currentSongIndex) ||
      (fromIndex > currentSongIndex && toIndex <= currentSongIndex)
    ) {
      newCurrentIndex = fromIndex < currentSongIndex ? currentSongIndex - 1 : currentSongIndex + 1
    }
    setSongs(updatedSongs)
    setCurrentSongIndex(newCurrentIndex)
  }

  // Function to reset playlist to original order
  const resetPlaylist = () => {
    const currentSong = songs[currentSongIndex]
    setSongs([...originalSongs])
    const newIndex = originalSongs.findIndex((song) => song.id === currentSong.id)
    if (newIndex !== -1) {
      setCurrentSongIndex(newIndex)
    } else {
      setCurrentSongIndex(0)
    }
  }

  // Fade in function
  const fadeIn = () => {
    if (!audioRef.current) return
    setIsFading(true)
    let vol = 0
    audioRef.current.volume = vol
    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return
      vol += 0.1
      if (vol >= volume) {
        vol = volume
        clearInterval(fadeIntervalRef.current!)
        setIsFading(false)
      }
      audioRef.current.volume = isMuted ? 0 : vol
    }, 50)
  }

  // Fade out function
  const fadeOut = () => {
    if (!audioRef.current) return
    setIsFading(true)
    let vol = audioRef.current.volume
    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return
      vol -= 0.1
      if (vol <= 0) {
        vol = 0
        clearInterval(fadeIntervalRef.current!)
        setIsFading(false)
        return true
      }
      audioRef.current.volume = vol
      return false
    }, 50)
    return false
  }

  // Preload next song to fix gapless bug
  const preloadNextSong = () => {
    if (!audioRef.current) return

    // Clear any existing preload timeout
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current)
    }

    // Calculate next song index
    const nextIndex = isShuffling ? Math.floor(Math.random() * songs.length) : (currentSongIndex + 1) % songs.length

    // Create a new audio element for preloading
    if (!nextAudioRef.current) {
      nextAudioRef.current = new Audio()
    }

    // Set the source and start loading
    nextAudioRef.current.src = songs[nextIndex].src
    nextAudioRef.current.load()

    // Set a flag that we've preloaded the next song
    nextSongPreloadedRef.current = true
  }

  // Improved crossFade function to fix the looping bug
  const crossFade = (nextIndex: number) => {
    if (!audioRef.current) return

    // If we have a preloaded next audio, use it
    let nextAudio: HTMLAudioElement

    if (nextSongPreloadedRef.current && nextAudioRef.current) {
      nextAudio = nextAudioRef.current
      // Reset the preload flag
      nextSongPreloadedRef.current = false
    } else {
      // Create a new audio element if we don't have one preloaded
      nextAudio = new Audio()
      nextAudio.src = songs[nextIndex].src
      nextAudio.load()
    }

    // Set initial volume to 0
    nextAudio.volume = 0

    // Start playing the next song immediately
    // This fixes the looping bug by ensuring we don't wait to start playing
    const playPromise = nextAudio.play().catch((err) => {
      console.error("Failed to play next track:", err)
      // If we can't play the next track, just switch to it directly
      if (audioRef.current) {
        audioRef.current.src = songs[nextIndex].src
        audioRef.current.load()
        audioRef.current.play().catch(console.error)
      }
    })

    // If play was successful, start the crossfade
    if (playPromise !== undefined) {
      // Clear any existing fade interval
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
      }

      const currentAudio = audioRef.current
      const startVolume = currentAudio.volume
      const fadeDuration = crossfadeDuration * 1000
      const fadeStep = 50 // ms between volume changes
      let elapsed = 0

      setIsFading(true)

      fadeIntervalRef.current = setInterval(() => {
        elapsed += fadeStep
        const progress = Math.min(elapsed / fadeDuration, 1)

        // Fade out current track
        if (currentAudio) {
          currentAudio.volume = Math.max(0, startVolume * (1 - progress))
        }

        // Fade in next track
        nextAudio.volume = Math.min(volume, volume * progress)

        // When fade is complete
        if (progress >= 1) {
          clearInterval(fadeIntervalRef.current!)

          // Stop the current audio
          if (currentAudio) {
            currentAudio.pause()
            currentAudio.currentTime = 0
          }

          // Set the next audio as current
          audioRef.current = nextAudio
          setCurrentSongIndex(nextIndex)
          setIsFading(false)

          // Start preloading the next song
          preloadNextSong()
        }
      }, fadeStep)
    }
  }

  // Handle timeupdate event
  const handleTimeUpdate = () => {
    if (!audioRef.current) return

    const audio = audioRef.current
    setCurrentTime(audio.currentTime)

    if (audio.duration) {
      setProgress((audio.currentTime / audio.duration) * 100)

      // Preload next song when we're close to the end
      if (audio.duration - audio.currentTime <= 10 && !nextSongPreloadedRef.current) {
        preloadNextSong()
      }

      // Start crossfade when we're close to the end
      if (!isFading && audio.duration - audio.currentTime <= crossfadeDuration) {
        const nextIndex = isShuffling
          ? (() => {
              let idx
              do {
                idx = Math.floor(Math.random() * songs.length)
              } while (idx === currentSongIndex && songs.length > 1)
              return idx
            })()
          : (currentSongIndex + 1) % songs.length

        crossFade(nextIndex)
      }
    }

    // Store the last played time to detect if we're stuck in a loop
    lastPlayedTimeRef.current = audio.currentTime
  }

  // Handle song ended event
  const handleEnded = () => {
    if (isLooping) return // Let the native loop handle it

    const nextIndex = isShuffling
      ? (() => {
          let idx
          do {
            idx = Math.floor(Math.random() * songs.length)
          } while (idx === currentSongIndex && songs.length > 1)
          return idx
        })()
      : (currentSongIndex + 1) % songs.length

    // If we're not already crossfading, start now
    if (!isFading) {
      crossFade(nextIndex)
    }
  }

  // Initialize audio element
  useEffect(() => {
    if (typeof window === "undefined") return

    if (!audioRef.current) {
      const audio = new Audio()
      audioRef.current = audio

      audio.src = songs[currentSongIndex].src
      audio.load()
      audio.volume = 0 // Start with volume 0 for fade in

      // Check if this is the first visit
      const hasVisited = sessionStorage.getItem("hasVisitedBefore") === "true"

      if (!hasVisited) {
        // First visit, autoplay with fade in
        audio
          .play()
          .then(() => {
            setIsPlaying(true)
            fadeIn()
          })
          .catch((err) => {
            console.error("Autoplay prevented:", err)
          })

        // Mark that user has visited
        sessionStorage.setItem("hasVisitedBefore", "true")
      }

      // Start preloading the next song
      preloadNextSong()
    }

    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }

      if (nextAudioRef.current) {
        nextAudioRef.current.pause()
        nextAudioRef.current.src = ""
      }

      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
      }

      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current)
      }
    }
  }, [])

  // Handle song changes
  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    try {
      const songSrc = songs[currentSongIndex].src

      if (audio.src !== songSrc) {
        setError(null)

        // If we're not fading, set the source directly
        if (!isFading) {
          audio.src = songSrc
          audio.load()
          audio.volume = isMuted ? 0 : volume
          audio.loop = isLooping

          if (isPlaying) {
            audio.play().catch((err) => {
              console.error("Play failed:", err)
              setError(`Failed to play: ${err.message}`)
              setIsPlaying(false)
            })
          }

          // Preload the next song
          preloadNextSong()
        }
      } else {
        // Same source, just update properties
        audio.volume = isMuted ? 0 : volume
        audio.loop = isLooping
      }

      setIsFirstLoad(false)
    } catch (err) {
      console.error("Error setting up audio:", err)
      setError(`Error setting up audio: ${err instanceof Error ? err.message : String(err)}`)
      setIsPlaying(false)
    }
  }, [currentSongIndex, isPlaying, volume, isMuted, isLooping])

  // Set up event listeners
  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration))
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", (e) => {
      console.error("Audio error:", e)
      setError(`Audio error: ${audio.error?.message || "Unknown error"}`)
      setIsPlaying(false)
      nextSong()
    })
    audio.addEventListener("canplay", () => {
      if (isPlaying) {
        audio.play().catch((err) => {
          console.error("Play failed in canplay handler:", err)
          setIsPlaying(false)
        })
      }
    })

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", () => {})
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", () => {})
      audio.removeEventListener("canplay", () => {})
    }
  }, [])

  // Define player control functions
  const togglePlay = () => {
    if (!audioRef.current) return

    setIsPlaying((prev) => {
      const newIsPlaying = !prev

      if (newIsPlaying) {
        if (audioRef.current.volume === 0 || isFading) {
          fadeIn()
        }

        audioRef.current.play().catch((error) => {
          console.error("Toggle play failed:", error)
          setError(`Failed to play: ${error.message}`)
          return false
        })
      } else {
        const fadeOutComplete = fadeOut()
        if (fadeOutComplete) {
          audioRef.current.pause()
        } else {
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause()
            }
          }, 500)
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

  const nextSong = () => {
    if (isShuffling) {
      let nextIndex
      do {
        nextIndex = Math.floor(Math.random() * songs.length)
      } while (nextIndex === currentSongIndex && songs.length > 1)

      crossFade(nextIndex)
    } else {
      const nextIndex = (currentSongIndex + 1) % songs.length
      crossFade(nextIndex)
    }
  }

  const prevSong = () => {
    if (isShuffling) {
      let nextIndex
      do {
        nextIndex = Math.floor(Math.random() * songs.length)
      } while (nextIndex === currentSongIndex && songs.length > 1)

      crossFade(nextIndex)
    } else {
      const nextIndex = (currentSongIndex - 1 + songs.length) % songs.length
      crossFade(nextIndex)
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
        setSongs,
        audioRef,
        showQueue,
        toggleQueue,
        isMuted,
        toggleMute,
        error,
        reorderSongs,
        originalSongs,
        resetPlaylist,
        crossfadeDuration,
        setCrossfadeDuration,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (context === undefined) {
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
      setSongs: () => {},
      audioRef: { current: null },
      showQueue: false,
      toggleQueue: () => {},
      isMuted: false,
      toggleMute: () => {},
      error: null,
      reorderSongs: () => {},
      originalSongs,
      resetPlaylist: () => {},
      crossfadeDuration: 3,
      setCrossfadeDuration: () => {},
    }
  }
  return context
}
