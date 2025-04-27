"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, X, Moon, Sun, Music } from "lucide-react"
import { motion } from "framer-motion"
import { useMusicPlayer } from "@/hooks/use-music-player"

const pages = [
  { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
  { path: "/profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  { path: "/dni", label: "DNI", icon: <X className="w-4 h-4" /> },
  { path: "/byf", label: "BYF", icon: <span className="text-xs">♡</span> },
  { path: "/favs", label: "FAVS", icon: <span className="text-xs">★</span> },
  { path: "/messages", label: "Messages", icon: <span className="text-xs">✉</span> },
]

export function TaskBar() {
  const pathname = usePathname()
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [time, setTime] = useState("")
  const { isPlaying, togglePlay } = useMusicPlayer()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
    document.body.classList.toggle("dark-theme")
  }

  const createHearts = () => {
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement("div")
      heart.className = "floating-heart"
      heart.innerHTML = ["♥", "♡", "✿", "✨", "★"][Math.floor(Math.random() * 5)]

      // Random position
      heart.style.left = Math.random() * 100 + "vw"
      heart.style.animationDuration = Math.random() * 3 + 2 + "s"
      heart.style.fontSize = Math.random() * 20 + 10 + "px"

      // Random color
      const colors = ["#ffb6c1", "#ff8fab", "#ff66a3", "#ff4d94", "#ff3385"]
      heart.style.color = colors[Math.floor(Math.random() * colors.length)]

      document.body.appendChild(heart)

      // Remove after animation
      setTimeout(() => {
        heart.remove()
      }, 5000)
    }
  }

  return (
    <>
      <motion.div
        className="taskbar fixed top-0 left-0 right-0 z-50 bg-pink-50/90 dark:bg-[#16213e]/90 backdrop-blur-md border-b border-pink-200 dark:border-[#2d2d42] shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-1">
              <motion.div
                className="taskbar-logo flex items-center mr-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-pink-600 dark:text-pink-400 font-bold text-lg">
                  pien<span className="text-pink-400 dark:text-pink-300">!</span>
                </span>
              </motion.div>

              <div className="flex space-x-1">
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
              <motion.button
                className="taskbar-button p-1.5 rounded-full hover:bg-pink-100 dark:hover:bg-[#2d2d42] text-pink-600 dark:text-pink-400"
                onClick={createHearts}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-lg">✿</span>
              </motion.button>

              <motion.button
                className="taskbar-button p-1.5 rounded-full hover:bg-pink-100 dark:hover:bg-[#2d2d42] text-pink-600 dark:text-pink-400"
                onClick={togglePlay}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <Music className={`w-4 h-4 ${isPlaying ? "text-pink-500" : ""}`} />
              </motion.button>

              <motion.button
                className="taskbar-button p-1.5 rounded-full hover:bg-pink-100 dark:hover:bg-[#2d2d42] text-pink-600 dark:text-pink-400"
                onClick={toggleTheme}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.button>

              <div className="taskbar-time text-xs text-pink-600 dark:text-pink-400 font-medium">{time}</div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="h-12"></div> {/* Spacer for fixed taskbar */}
    </>
  )
}
