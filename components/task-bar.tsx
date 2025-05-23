"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  User,
  X,
  Moon,
  Sun,
  Music,
  Heart,
  Star,
  MessageSquare,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Gift,
  Calendar,
  Palette,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMusicPlayer } from "@/hooks/use-music-player"
import { MobileMenu } from "./mobile-menu"
import { FavoritesListDropdown } from "@/components/favorites-list-dropdown"

const pages = [
  { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
  { path: "/profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  { path: "/dni", label: "DNI", icon: <X className="w-4 h-4" /> },
  { path: "/byf", label: "BYF", icon: <Heart className="w-4 h-4" /> },
  { path: "/favs", label: "FAVS", icon: <Star className="w-4 h-4" /> },
  { path: "/messages", label: "MSG", icon: <MessageSquare className="w-4 h-4" /> },
  { path: "/draw", label: "Draw", icon: <Palette className="w-4 h-4" /> },
  { path: "/hall-of-fame", label: "HOF", icon: <Trophy className="w-4 h-4" /> },
  { path: "/gacha", label: "WOTD", icon: <Gift className="w-4 h-4" /> },
]

export function TaskBar() {
  const pathname = usePathname()
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [reorderEnabled, setReorderEnabled] = useState(false)
  const [queueItems, setQueueItems] = useState<number[]>([])
  const [showFavoritesList, setShowFavoritesList] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const musicPlayerRef = useRef<HTMLDivElement>(null)
  const favoritesButtonRef = useRef<HTMLButtonElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLDivElement>(null)

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

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
    isMuted,
    toggleMute,
    error,
    reorderSongs,
    resetPlaylist,
    crossfadeDuration,
    setCrossfadeDuration,
    currentPlaylist,
    setCurrentPlaylist,
    availablePlaylists,
  } = useMusicPlayer()

  // Initialize queue items
  useEffect(() => {
    // Create an array of indices excluding the current song
    const indices = Array.from({ length: songs.length }, (_, i) => i).filter((i) => i !== currentSongIndex)

    // Get the first 10 items for the queue
    setQueueItems(indices.slice(0, 10))
  }, [currentSongIndex, songs.length])

  useEffect(() => {
    // Check if dark mode is enabled in localStorage
    const savedTheme = localStorage.getItem("theme")
    const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)

    setIsDarkTheme(isDark)

    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    const updateDateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      setDate(now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" }))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 60000)

    // Close music player when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (musicPlayerRef.current && !musicPlayerRef.current.contains(event.target as Node)) {
        setShowMusicPlayer(false)
      }

      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        timeRef.current &&
        !timeRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      clearInterval(interval)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
    if (isDarkTheme) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  }

  const toggleFavoritesList = () => {
    setShowFavoritesList(!showFavoritesList)
  }

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const progressBarRef = useRef<HTMLDivElement>(null)

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

  // Handle playing a song from the queue
  const playQueueItem = (index: number) => {
    const songIndex = queueItems[index]
    setCurrentSongIndex(songIndex)

    // Remove the played song from the queue
    const newQueue = [...queueItems]
    newQueue.splice(index, 1)

    // Add a new song to the end if available
    const allIndices = Array.from({ length: songs.length }, (_, i) => i)
    const availableIndices = allIndices.filter(
      (i) => i !== songIndex && !newQueue.includes(i) && i !== currentSongIndex,
    )

    if (availableIndices.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableIndices.length)
      newQueue.push(availableIndices[randomIndex])
    }

    setQueueItems(newQueue)
  }

  // Navigate to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // Navigate to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Navigate to previous year
  const prevYear = () => {
    setCurrentYear(currentYear - 1)
  }

  // Navigate to next year
  const nextYear = () => {
    setCurrentYear(currentYear + 1)
  }

  // Get current month calendar
  const getCurrentMonthCalendar = () => {
    // Use the state variables instead of current date
    const today = new Date()
    const currentDay = today.getDate()
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear

    // Get first day of month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()

    // Get last day of month
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate()

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    return {
      monthName: monthNames[currentMonth],
      year: currentYear,
      days: Array.from({ length: lastDay }, (_, i) => i + 1),
      firstDay,
      currentDay: isCurrentMonth ? currentDay : null,
      dayNames,
    }
  }

  const calendar = getCurrentMonthCalendar()

  return (
    <>
      <motion.div
        className="taskbar fixed top-0 left-0 right-0 z-50 bg-pink-50/90 dark:bg-[#16213e]/90 backdrop-blur-md border-b border-pink-200 dark:border-[#2d2d42] shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center">
              <motion.div
                className="taskbar-logo flex items-center mr-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/">
                  <span className="text-pink-600 dark:text-pink-400 font-bold text-lg">
                    pien<span className="text-pink-400 dark:text-pink-300">!</span>
                  </span>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-1">
                {pages.map((page) => (
                  <Link href={page.path} key={page.path}>
                    <motion.div
                      className={`taskbar-tab px-3 py-1.5 rounded-t-lg flex items-center space-x-1.5 text-sm cursor-pointer transition-colors ${
                        pathname === page.path
                          ? "bg-pink-100 dark:bg-[#2d2d42] text-pink-700 dark:text-pink-300"
                          : "hover:bg-pink-50 dark:hover:bg-[#1a1a2e] text-gray-600 dark:text-gray-300"
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      {page.icon}
                      <span>{page.label}</span>
                      {pathname === page.path && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-400 dark:bg-pink-500"
                          layoutId="activeTab"
                        />
                      )}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Mobile Menu */}
              <MobileMenu pages={pages} />

              {/* Favorites Button with Dropdown */}
              <div className="relative">
                <motion.button
                  ref={favoritesButtonRef}
                  className="taskbar-button p-1.5 rounded-full hover:bg-pink-100 dark:hover:bg-[#2d2d42] text-pink-600 dark:text-pink-400"
                  onClick={toggleFavoritesList}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Show favorites"
                  title="Kesayangan Pien 💖💖"
                >
                  <span className="text-lg">✿</span>
                </motion.button>

                <FavoritesListDropdown isOpen={showFavoritesList} onClose={() => setShowFavoritesList(false)} />
              </div>

              {/* Music Player Button with Dropdown */}
              <div className="relative">
                <motion.button
                  className={`taskbar-button p-1.5 rounded-full hover:bg-pink-100 dark:hover:bg-[#2d2d42] text-pink-600 dark:text-pink-400 ${isPlaying ? "text-pink-500 dark:text-pink-300" : ""}`}
                  onClick={() => setShowMusicPlayer(!showMusicPlayer)}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Music player"
                >
                  <Music className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {showMusicPlayer && (
                    <motion.div
                      ref={musicPlayerRef}
                      className="absolute right-0 top-full mt-2 bg-white dark:bg-[#16213e] rounded-xl shadow-lg overflow-hidden border-2 border-pink-200 dark:border-pink-800/30 w-72"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-br from-pink-100/50 to-transparent dark:from-pink-900/10 pointer-events-none" />

                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-pink-700 dark:text-pink-300 truncate">
                              {songs[currentSongIndex].title}
                            </p>
                            <p className="text-[10px] text-pink-500 dark:text-pink-400 truncate">
                              {songs[currentSongIndex].artist}
                            </p>
                          </div>

                          <motion.button
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"
                            onClick={() => setShowMusicPlayer(false)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>

                        {error && (
                          <div className="bg-pink-50 dark:bg-[#2d2d42] p-2 rounded-lg mb-2 text-xs text-pink-600 dark:text-pink-300">
                            <span className="truncate">Audio error - check files</span>
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
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"
                            onClick={prevSong}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Previous"
                          >
                            <SkipBack className="w-3 h-3" />
                          </motion.button>

                          <motion.button
                            className={`w-9 h-9 rounded-full flex items-center justify-center ${
                              isPlaying
                                ? "bg-pink-400 text-white"
                                : "bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"
                            }`}
                            onClick={togglePlay}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title={isPlaying ? "Pause" : "Play"}
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </motion.button>

                          <motion.button
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"
                            onClick={nextSong}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Next"
                          >
                            <SkipForward className="w-3 h-3" />
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
                                  transition={{ duration: 0.2 }}
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

                          <div className="flex space-x-2">
                            <motion.button
                              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                isShuffling
                                  ? "bg-pink-400 text-white"
                                  : "bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"
                              }`}
                              onClick={toggleShuffle}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Shuffle"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="16 3 21 3 21 8"></polyline>
                                <line x1="4" y1="20" x2="21" y2="3"></line>
                                <polyline points="21 16 21 21 16 21"></polyline>
                                <line x1="15" y1="15" x2="21" y2="21"></line>
                                <line x1="4" y1="4" x2="9" y2="9"></line>
                              </svg>
                            </motion.button>

                            <motion.button
                              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                isLooping
                                  ? "bg-pink-400 text-white"
                                  : "bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"
                              }`}
                              onClick={toggleLoop}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Loop"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="17 1 21 5 17 9"></polyline>
                                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                                <polyline points="7 23 3 19 7 15"></polyline>
                                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                              </svg>
                            </motion.button>
                          </div>
                        </div>

                        {/* Playlist Selector */}
                        <div className="mt-3 pt-3 border-t border-pink-100 dark:border-[#2d2d42]">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-xs font-medium text-pink-700 dark:text-pink-300">Current Playlist</p>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {availablePlaylists.map((playlist) => (
                              <button
                                key={playlist}
                                onClick={() => setCurrentPlaylist(playlist)}
                                className={`text-xs p-2 rounded-md transition-colors ${
                                  currentPlaylist === playlist
                                    ? "bg-pink-400 text-white"
                                    : "bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-[#3d3d5a]"
                                }`}
                              >
                                {playlist === "playlist1"
                                  ? "Cinnamon"
                                  : playlist === "playlist2"
                                    ? "Raspberry"
                                    : playlist === "playlist3"
                                      ? "Sunflower"
                                      : playlist}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-pink-100 dark:border-[#2d2d42]">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-xs font-medium text-pink-700 dark:text-pink-300">Queue</p>
                            <div className="flex space-x-1">
                              <button
                                className="text-xs text-pink-500 dark:text-pink-400 hover:underline"
                                onClick={() => setReorderEnabled(!reorderEnabled)}
                              >
                                {reorderEnabled ? "Done" : "Reorder"}
                              </button>
                              <button
                                className="text-xs text-pink-500 dark:text-pink-400 hover:underline ml-2"
                                onClick={resetPlaylist}
                              >
                                Reset
                              </button>
                            </div>
                          </div>
                          <div className="max-h-32 overflow-y-auto">
                            {songs.map((song, index) => (
                              <div
                                key={song.id || index}
                                className={`p-1.5 text-xs rounded-md mb-1 cursor-pointer flex items-center ${
                                  currentSongIndex === index
                                    ? "bg-pink-200 dark:bg-pink-800/30 text-pink-700 dark:text-pink-300"
                                    : "hover:bg-pink-100 dark:hover:bg-[#3d3d5a] text-pink-600 dark:text-pink-400"
                                } ${reorderEnabled ? "draggable-song" : ""}`}
                                onClick={() => !reorderEnabled && setCurrentSongIndex(index)}
                                draggable={reorderEnabled}
                                onDragStart={(e) => {
                                  if (reorderEnabled) {
                                    e.dataTransfer.setData("text/plain", index.toString())
                                    e.currentTarget.classList.add("dragging")
                                  }
                                }}
                                onDragEnd={(e) => {
                                  if (reorderEnabled) {
                                    e.currentTarget.classList.remove("dragging")
                                  }
                                }}
                                onDragOver={(e) => {
                                  if (reorderEnabled) {
                                    e.preventDefault()
                                  }
                                }}
                                onDrop={(e) => {
                                  if (reorderEnabled) {
                                    e.preventDefault()
                                    const fromIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))
                                    reorderSongs(fromIndex, index)
                                  }
                                }}
                              >
                                {reorderEnabled && (
                                  <span className="drag-handle mr-1">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M8 6H16M8 12H16M8 18H16"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                  </span>
                                )}
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
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                className="taskbar-button p-1.5 rounded-full hover:bg-pink-100 dark:hover:bg-[#2d2d42] text-pink-600 dark:text-pink-400"
                onClick={toggleTheme}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.button>

              <div
                ref={timeRef}
                className="taskbar-time text-xs text-pink-600 dark:text-pink-400 font-medium hidden sm:block cursor-pointer hover:text-pink-500 dark:hover:text-pink-300"
                onClick={toggleCalendar}
              >
                {time}
              </div>

              {/* Calendar Popup */}
              <AnimatePresence>
                {showCalendar && (
                  <motion.div
                    ref={calendarRef}
                    className="absolute right-4 top-full mt-2 bg-white dark:bg-[#16213e] rounded-xl shadow-lg overflow-hidden border-2 border-pink-200 dark:border-pink-800/30 w-64"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-3">
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <button
                              onClick={prevYear}
                              className="p-1 rounded-full hover:bg-pink-100 dark:hover:bg-[#2d2d42] text-pink-500 dark:text-pink-400"
                            >
                              <ChevronLeft className="w-3 h-3" />
                              <ChevronLeft className="w-3 h-3 -ml-1" />
                            </button>
                            <span className="text-xs font-medium text-pink-700 dark:text-pink-300 mx-1">
                              {calendar.year}
                            </span>
                            <button
                              onClick={nextYear}
                              className="p-1 rounded-full hover:bg-pink-100 dark:hover:bg-[#2d2d42] text-pink-500 dark:text-pink-400"
                            >
                              <ChevronRight className="w-3 h-3" />
                              <ChevronRight className="w-3 h-3 -ml-1" />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-pink-500 dark:text-pink-400 mr-1" />
                            <span className="text-xs text-pink-500 dark:text-pink-400">{date}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={prevMonth}
                            className="p-1 rounded-full hover:bg-pink-100 dark:hover:bg-[#2d2d42] text-pink-500 dark:text-pink-400"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <h3 className="text-sm font-medium text-pink-700 dark:text-pink-300">{calendar.monthName}</h3>
                          <button
                            onClick={nextMonth}
                            className="p-1 rounded-full hover:bg-pink-100 dark:hover:bg-[#2d2d42] text-pink-500 dark:text-pink-400"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {calendar.dayNames.map((day) => (
                          <div key={day} className="text-[10px] font-medium text-pink-500 dark:text-pink-400">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {/* Empty cells for days before the first day of month */}
                        {Array.from({ length: calendar.firstDay }).map((_, index) => (
                          <div key={`empty-${index}`} className="h-6"></div>
                        ))}

                        {/* Calendar days */}
                        {calendar.days.map((day) => (
                          <div
                            key={day}
                            className={`h-6 w-6 flex items-center justify-center text-xs rounded-full mx-auto
                              ${
                                day === calendar.currentDay
                                  ? "bg-pink-400 text-white font-medium"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-[#2d2d42] cursor-pointer"
                              }`}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="h-12"></div> {/* Spacer for fixed taskbar */}
    </>
  )
}
