"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Repeat, Shuffle, List, X, RefreshCw } from "lucide-react"
import { useMusicPlayer } from "@/hooks/use-music-player"

export function MusicPlayer() {
  const {
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
    showQueue,
    toggleQueue,
    isMuted,
    toggleMute,
    error,
  } = useMusicPlayer()

  const [expanded, setExpanded] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return

    const progressBar = progressBarRef.current
    const rect = progressBar.getBoundingClientRect()
    const clickPosition = e.clientX - rect.left
    const newProgress = (clickPosition / progressBar.offsetWidth) * 100

    // Calculate the new time based on the percentage
    const newTime = (newProgress / 100) * duration
    seekTo(newTime)
  }

  // Function to retry loading the current song
  const retrySong = () => {
    setCurrentSongIndex(currentSongIndex)
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed bottom-4 left-4 z-50 ${expanded ? "w-72 sm:w-80" : "w-12"} bg-white dark:bg-[#16213e] rounded-xl shadow-lg overflow-hidden border-2 border-pink-200 dark:border-pink-800/30 music-player`}
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
            aria-label={isPlaying ? "Pause" : "Play"}
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
            aria-label={expanded ? "Collapse" : "Expand"}
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
            {error && (
              <div className="bg-pink-50 dark:bg-[#2d2d42] p-2 rounded-lg mb-2 text-xs text-pink-600 dark:text-pink-300 flex items-center justify-between">
                <span className="truncate">Audio error - check files</span>
                <motion.button
                  className="ml-2 p-1 rounded-full bg-pink-100 dark:bg-[#3d3d5a] text-pink-600 dark:text-pink-300 flex-shrink-0"
                  onClick={retrySong}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Retry"
                >
                  <RefreshCw className="w-3 h-3" />
                </motion.button>
              </div>
            )}

            <div
              className="h-1 bg-pink-100 dark:bg-[#2d2d42] rounded-full overflow-hidden cursor-pointer mb-2"
              onClick={handleProgressClick}
              ref={progressBarRef}
            >
              <div className="h-full bg-pink-400 dark:bg-pink-500" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex justify-between text-[10px] text-pink-500 dark:text-pink-400 mb-3">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex justify-between mb-3">
              <motion.button
                className={`w-7 h-7 rounded-full flex items-center justify-center ${isShuffling ? "bg-pink-400 text-white" : "bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"}`}
                onClick={toggleShuffle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Shuffle"
                aria-label="Toggle shuffle"
              >
                <Shuffle className="w-3 h-3" />
              </motion.button>

              <motion.button
                className="w-7 h-7 rounded-full flex items-center justify-center bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"
                onClick={prevSong}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Previous"
                aria-label="Previous song"
              >
                <SkipBack className="w-3 h-3" />
              </motion.button>

              <motion.button
                className={`w-9 h-9 rounded-full flex items-center justify-center ${isPlaying ? "bg-pink-400 text-white" : "bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"}`}
                onClick={togglePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isPlaying ? "Pause" : "Play"}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </motion.button>

              <motion.button
                className="w-7 h-7 rounded-full flex items-center justify-center bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"
                onClick={nextSong}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Next"
                aria-label="Next song"
              >
                <SkipForward className="w-3 h-3" />
              </motion.button>

              <motion.button
                className={`w-7 h-7 rounded-full flex items-center justify-center ${isLooping ? "bg-pink-400 text-white" : "bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"}`}
                onClick={toggleLoop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Loop"
                aria-label="Toggle loop"
              >
                <Repeat className="w-3 h-3" />
              </motion.button>
            </div>

            <div className="flex justify-between items-center">
              <div className="relative">
                <motion.button
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"
                  onClick={toggleMute}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onTouchStart={() => setShowVolumeSlider(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={isMuted ? "Unmute" : "Mute"}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </motion.button>

                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div
                      className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-[#16213e] rounded-lg shadow-lg border border-pink-200 dark:border-pink-800/30 w-32"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseLeave={() => setShowVolumeSlider(false)}
                      onTouchEnd={() => setShowVolumeSlider(false)}
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                        className="w-full h-2 bg-pink-100 dark:bg-[#2d2d42] rounded-lg appearance-none cursor-pointer"
                        aria-label="Volume"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                className={`w-7 h-7 rounded-full flex items-center justify-center ${showQueue ? "bg-pink-400 text-white" : "bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"}`}
                onClick={toggleQueue}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Queue"
                aria-label="Toggle queue"
              >
                <List className="w-3 h-3" />
              </motion.button>
            </div>

            <AnimatePresence>
              {showQueue && (
                <motion.div
                  className="mt-3 bg-pink-50 dark:bg-[#2d2d42] rounded-lg p-2 max-h-40 overflow-y-auto"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold text-pink-600 dark:text-pink-300">Queue</h4>
                    <button
                      className="text-pink-400 dark:text-pink-300 hover:text-pink-600"
                      onClick={toggleQueue}
                      aria-label="Close queue"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  {songs.map((song, index) => (
                    <div
                      key={index}
                      className={`p-1.5 text-xs rounded-md mb-1 cursor-pointer flex items-center ${
                        currentSongIndex === index
                          ? "bg-pink-200 dark:bg-pink-800/30 text-pink-700 dark:text-pink-300"
                          : "hover:bg-pink-100 dark:hover:bg-[#3d3d5a] text-pink-600 dark:text-pink-400"
                      }`}
                      onClick={() => setCurrentSongIndex(index)}
                    >
                      {currentSongIndex === index && isPlaying ? (
                        <span className="w-3 h-3 mr-2 flex-shrink-0">
                          <span className="block w-1 h-3 bg-pink-500 dark:bg-pink-400 rounded-sm inline-block animate-[soundwave_0.5s_ease-in-out_infinite_alternate]"></span>
                          <span className="block w-1 h-3 bg-pink-500 dark:bg-pink-400 rounded-sm inline-block mx-[1px] animate-[soundwave_0.5s_ease-in-out_infinite_alternate_0.2s]"></span>
                          <span className="block w-1 h-3 bg-pink-500 dark:bg-pink-400 rounded-sm inline-block animate-[soundwave_0.5s_ease-in-out_infinite_alternate_0.4s]"></span>
                        </span>
                      ) : (
                        <span className="w-3 h-3 mr-2 flex-shrink-0 text-center">{index + 1}.</span>
                      )}
                      <div className="truncate">
                        <span className="font-medium">{song.title}</span>
                        <span className="text-[10px] block opacity-70">{song.artist}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
