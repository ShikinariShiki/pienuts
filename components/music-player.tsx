"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react"
import { useMusicPlayer } from "@/hooks/use-music-player"

const songs = [
  {
    title: "七時の食事(Chocolate Lemon)",
    artist: "Mitsukiyo",
    src: "track1.mp3",
  },
  {
    title: "九時のミルフィーユ",
    artist: "Mitsukiyo",
    src: "track2.mp3",
  },
  {
    title: "Salty Moon",
    artist: "Hoyo-Mix",
    src: "track3.mp3",
  },
]

export function MusicPlayer() {
  const { isPlaying, togglePlay, currentSongIndex, setCurrentSongIndex } = useMusicPlayer()
  const [expanded, setExpanded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(songs[currentSongIndex].src)
    audioRef.current = audio

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
      nextSong()
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    if (isPlaying) {
      audio.play()
    } else {
      audio.pause()
    }

    return () => {
      audio.pause()
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentSongIndex, isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return

    const progressBar = e.currentTarget
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left
    const newProgress = (clickPosition / progressBar.offsetWidth) * 100

    setProgress(newProgress)
    audioRef.current.currentTime = (newProgress / 100) * duration
  }

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1))
  }

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1))
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed bottom-4 left-4 z-50 ${expanded ? "w-64" : "w-12"} bg-white dark:bg-[#16213e] rounded-xl shadow-lg overflow-hidden border-2 border-pink-200 dark:border-pink-800/30`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-br from-pink-100/50 to-transparent dark:from-pink-900/10 pointer-events-none" />

        <div className="flex items-center p-2">
          <motion.button
            className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlaying ? "bg-pink-400 text-white" : "bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"}`}
            onClick={togglePlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </motion.button>

          {expanded && (
            <motion.div
              className="ml-3 flex-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-xs font-medium text-pink-700 dark:text-pink-300 truncate">
                {songs[currentSongIndex].title}
              </p>
              <p className="text-[10px] text-pink-500 dark:text-pink-400 truncate">{songs[currentSongIndex].artist}</p>
            </motion.div>
          )}

          <motion.button
            className="w-8 h-8 rounded-full flex items-center justify-center bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300 ml-auto"
            onClick={() => setExpanded(!expanded)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {expanded ? <span className="text-xs">✕</span> : <span className="text-xs">♫</span>}
          </motion.button>
        </div>

        {expanded && (
          <motion.div
            className="px-3 pb-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div
              className="h-1 bg-pink-100 dark:bg-[#2d2d42] rounded-full overflow-hidden cursor-pointer mb-2"
              onClick={handleProgressClick}
            >
              <div className="h-full bg-pink-400 dark:bg-pink-500" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex justify-between text-[10px] text-pink-500 dark:text-pink-400 mb-3">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex justify-between">
              <motion.button
                className="w-7 h-7 rounded-full flex items-center justify-center bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"
                onClick={prevSong}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <SkipBack className="w-3 h-3" />
              </motion.button>

              <motion.button
                className="w-7 h-7 rounded-full flex items-center justify-center bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"
                onClick={toggleMute}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </motion.button>

              <motion.button
                className="w-7 h-7 rounded-full flex items-center justify-center bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"
                onClick={nextSong}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <SkipForward className="w-3 h-3" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
