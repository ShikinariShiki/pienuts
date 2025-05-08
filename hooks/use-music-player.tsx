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
  crossfadeDuration: number
  setCrossfadeDuration: (duration: number) => void
  currentPlaylist: string
  setCurrentPlaylist: (playlist: string) => void
  availablePlaylists: string[]
}

// Playlist 1: Original songs
const playlist1: Song[] = [
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
]

// Playlist 2: Lo-Fi/Study
const playlist2: Song[] = [
  {
    id: "lofi-1",
    title: "Bossa Break!",
    artist: "Frizk",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track9-FZsIlLkOslfPJCNIUMUKveuZldf0xI.mp3",
  },
  {
    id: "lofi-2",
    title: "Shower duty",
    artist: "Meaningful Stone",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track10-hsMclXH5riT5VmZKX6tVESSxlYuBf7.mp3",
  },
  {
    id: "lofi-3",
    title: "nero",
    artist: "フレネシ",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track11-urtJFDxw2AlfXZVJjV72FqDuIJACiB.mp3",
  },
  {
    id: "lofi-4",
    title: "from the start",
    artist: "j1ggs",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track12-gRqfqofQCSoTCjA1pLnLATNijLaSmV.mp3",
  },
  {
    id: "lofi-5",
    title: "the cat from ipanema",
    artist: "j1ggs",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track13-MTNQYyHAummXGrHxcQmsfto1LPlCj6.mp3",
  },
]

// Playlist 3: Nature/Ambient
const playlist3: Song[] = [
  {
    id: "nature-1",
    title: "silliest of them all",
    artist: "xylz",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track14-Fs3Ovlt5l4eiNDAqpJAdf90QPFBM0h.mp3",
  },
  {
    id: "nature-2",
    title: "Falling Behind",
    artist: "Laufey",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track15-ZrcnI0c2Vvz4BvlY9fDjke50azgVxp.mp3",
  },
  {
    id: "nature-3",
    title: "Patty no Theme",
    artist: "Satoru Kōsaki",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track16-rWNW1CluTgjARgiVI9GEfKe2bgMF5r.mp3",
  },
  {
    id: "nature-4",
    title: "2:23 AM",
    artist: "しゃろう",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track17-6v9CiFHs3eLWi0YmGbydgBUFkOCFXV.mp3",
  },
  {
    id: "nature-5",
    title: "Treat",
    artist: "Kyatto",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track18-kb7vG1Ao3glrs1cZOnCAeKl5j5k88D.mp3",
  },
]

// Map playlists
const playlists: Record<string, Song[]> = {
  playlist1,
  playlist2,
  playlist3,
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentPlaylist, setCurrentPlaylist] = useState<string>("playlist1")
  const [songs, setSongs] = useState<Song[]>([...playlists[currentPlaylist]])
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
  const [nextAudioRef, setNextAudioRef] = useState<HTMLAudioElement | null>(null)
  const [crossfadeDuration, setCrossfadeDuration] = useState(3) // Default 3 seconds
  const availablePlaylists = Object.keys(playlists)

  // Use a ref to store the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Function to reorder songs (for drag-and-drop)
  const reorderSongs = (fromIndex: number, toIndex: number) => {
    const updatedSongs = [...songs]
    const [movedSong] = updatedSongs.splice(fromIndex, 1)
    updatedSongs.splice(toIndex, 0, movedSong)

    // If the current song was moved, update the current song index
    let newCurrentIndex = currentSongIndex
    if (currentSongIndex === fromIndex) {
      newCurrentIndex = toIndex
    } else if (
      (fromIndex < currentSongIndex && toIndex >= currentSongIndex) ||
      (fromIndex > currentSongIndex && toIndex <= currentSongIndex)
    ) {
      // Adjust current song index if the moved song crossed over it
      newCurrentIndex = fromIndex < currentSongIndex ? currentSongIndex - 1 : currentSongIndex + 1
    }

    // Update songs first, then update current index to maintain playback
    setSongs(updatedSongs)
    setCurrentSongIndex(newCurrentIndex)
  }

  // Function to reset playlist to original order
  const resetPlaylist = () => {
    const currentSong = songs[currentSongIndex]
    setSongs([...playlists[currentPlaylist]])

    // Find the index of the current song in the original playlist
    const newIndex = playlists[currentPlaylist].findIndex((song) => song.id === currentSong.id)
    if (newIndex !== -1) {
      setCurrentSongIndex(newIndex)
    } else {
      setCurrentSongIndex(0)
    }
  }

  // Effect to handle playlist changes
  useEffect(() => {
    // Save current playback state
    const wasPlaying = isPlaying

    // Update songs with the new playlist
    setSongs([...playlists[currentPlaylist]])

    // Reset to first song in the new playlist
    setCurrentSongIndex(0)

    // If audio exists and was playing, load and play the new song
    if (audioRef.current && wasPlaying) {
      audioRef.current.src = playlists[currentPlaylist][0].src
      audioRef.current.load()
      audioRef.current.play().catch((err) => {
        console.error("Failed to play after playlist change:", err)
        setIsPlaying(false)
      })
    }
  }, [currentPlaylist])

  // Fade in function - SHORTENED DURATION
  const fadeIn = () => {
    if (!audioRef.current) return

    setIsFading(true)
    let vol = 0
    audioRef.current.volume = vol

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return

      vol += 0.1 // Increased step size for faster fade
      if (vol >= volume) {
        vol = volume
        clearInterval(fadeIntervalRef.current!)
        setIsFading(false)
      }

      audioRef.current.volume = isMuted ? 0 : vol
    }, 50) // Reduced interval for faster fade
  }

  // Fade out function - SHORTENED DURATION
  const fadeOut = () => {
    if (!audioRef.current) return

    setIsFading(true)
    let vol = audioRef.current.volume

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return

      vol -= 0.1 // Increased step size for faster fade
      if (vol <= 0) {
        vol = 0
        clearInterval(fadeIntervalRef.current!)
        setIsFading(false)

        // After fade out completes, we can pause or change track
        return true
      }

      audioRef.current.volume = vol
      return false
    }, 50) // Reduced interval for faster fade

    return false // Not done fading yet
  }

  // Cross fade between tracks - IMPROVED AND SHORTENED
  const crossFade = (nextIndex: number) => {
    if (!audioRef.current) return

    // Create a new audio element for the next track
    const nextAudio = new Audio()
    nextAudio.src = songs[nextIndex].src
    nextAudio.volume = 0 // Start with volume 0
    nextAudio.loop = isLooping

    // Load the next track (without playing yet)
    nextAudio.load()

    // Clear any existing fade interval
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
    }

    const currentAudio = audioRef.current
    const startVolume = isMuted ? 0 : volume
    const fadeDuration = 1000 // 1 second crossfade
    const fadeStep = 20 // ms between volume changes
    let elapsed = 0

    setIsFading(true)

    // Start playing the next song only after user interaction
    const playNextTrack = () => {
      nextAudio.play().catch((err) => {
        console.error("Failed to play during crossfade:", err)
        // If we can't play the next track, just switch to it directly
        setCurrentSongIndex(nextIndex)
        return
      })
    }

    // Try to play the next track (this will work if user has interacted)
    playNextTrack()

    fadeIntervalRef.current = setInterval(() => {
      elapsed += fadeStep
      const progress = Math.min(elapsed / fadeDuration, 1)

      // Fade out current track
      if (currentAudio) {
        currentAudio.volume = Math.max(0, startVolume * (1 - progress))
      }

      // Fade in next track
      nextAudio.volume = isMuted ? 0 : Math.min(volume, volume * progress)

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
      }
    }, fadeStep)
  }

  // Define nextSong and prevSong functions BEFORE they're used in useEffect
  const nextSong = () => {
    // Determine the next song index based on shuffle state
    const nextIndex = isShuffling
      ? (() => {
          let idx
          do {
            idx = Math.floor(Math.random() * songs.length)
          } while (idx === currentSongIndex && songs.length > 1)
          return idx
        })()
      : (currentSongIndex + 1) % songs.length

    // Set the new index and let the effect handle the change
    setCurrentSongIndex(nextIndex)

    // Ensure we're playing
    setIsPlaying(true)

    // If audio exists, play it immediately
    if (audioRef.current) {
      audioRef.current.src = songs[nextIndex].src
      audioRef.current.load()
      audioRef.current.play().catch((err) => {
        console.error("Failed to play next track:", err)
        setIsPlaying(false)
      })
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

      if (nextAudioRef) {
        nextAudioRef.pause()
        nextAudioRef.src = ""
      }

      // Clear any fade intervals
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
      }
    }
  }, [])

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

    // FIX: Properly handle looping when song ends
    const handleEnded = () => {
      console.log("Song ended, isLooping:", isLooping)

      // If looping is enabled, just restart the current song
      if (isLooping) {
        console.log("Looping current song")
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.error("Failed to loop track:", err)
              setIsPlaying(false)
            })
          }
        }
        return
      }

      // If not looping, play the next song
      console.log("Playing next song")
      nextSong()
    }

    const handleError = (e: Event) => {
      console.error("Audio error:", e)
      setError(`Audio error: ${audio.error?.message || "Unknown error"}`)
      setIsPlaying(false)

      // Try to recover by playing next song
      nextSong()
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
          }, 500) // Shortened from 1500ms
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
        console.log("Loop set to:", newIsLooping)
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
        originalSongs: playlists[currentPlaylist],
        resetPlaylist,
        crossfadeDuration,
        setCrossfadeDuration,
        currentPlaylist,
        setCurrentPlaylist,
        availablePlaylists,
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
      songs: playlists.playlist1,
      setSongs: () => {},
      audioRef: { current: null },
      showQueue: false,
      toggleQueue: () => {},
      isMuted: false,
      toggleMute: () => {},
      error: null,
      reorderSongs: () => {},
      originalSongs: playlists.playlist1,
      resetPlaylist: () => {},
      crossfadeDuration: 3,
      setCrossfadeDuration: () => {},
      currentPlaylist: "playlist1",
      setCurrentPlaylist: () => {},
      availablePlaylists: Object.keys(playlists),
    }
  }

  return context
}
