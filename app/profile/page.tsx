"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { fetchUserProfile } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"
import { FloatingHearts } from "@/components/floating-hearts"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showHearts, setShowHearts] = useState(false)
  const [message, setMessage] = useState("")
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchUserProfile()
        setProfile(data)
        setError(null)
      } catch (err) {
        setError("Failed to load profile data. Please try again!")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleHeartClick = () => {
    setShowHearts(true)
    setTimeout(() => setShowHearts(false), 2000)
  }

  const sendMessage = async () => {
    if (message.trim() === "") return

    try {
      // In a real app, you would send this to a server
      // await sendUserMessage(message)
      console.log("Message sent:", message)

      setMessage("")
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    } catch (err) {
      console.error("Failed to send message:", err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card w-full max-w-md p-6 text-center">
          <p className="text-pink-600 mb-4">{error}</p>
          <button className="button px-4 py-2 text-pink-600 font-medium" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-8">
      {showHearts && <FloatingHearts />}

      <motion.div
        className="card w-full max-w-2xl p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <motion.div
          className="flex flex-col md:flex-row items-center md:items-start gap-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="md:w-1/3">
            <motion.div
              className="profile-img w-full h-64 md:h-80 relative cursor-pointer mb-4 overflow-hidden rounded-[20px]"
              onClick={handleHeartClick}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image src="/images/profile.png" alt="Profile" fill className="object-cover" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="tag" onClick={handleHeartClick}>
                🎨 Artist
              </span>
              <span className="tag" onClick={handleHeartClick}>
                🎮 Gamer
              </span>
              <span className="tag" onClick={handleHeartClick}>
                🌸 Otaku
              </span>
              <span className="tag" onClick={handleHeartClick}>
                🎵 Music Lover
              </span>
              <span className="tag" onClick={handleHeartClick}>
                🍰 Foodie
              </span>
            </motion.div>
          </div>

          <div className="md:w-2/3">
            <motion.h1
              className="text-4xl font-bold text-pink-600 mb-2 floating"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              PIEN<span className="text-pink-400">!</span>
            </motion.h1>

            <motion.p
              className="text-sm text-gray-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              19 / nationality, languages, etc
            </motion.p>

            <motion.div
              className="divider my-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4 }}
            />

            <motion.div
              className="bg-pink-50 dark:bg-[#2d2d42] p-4 rounded-xl mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
                <span className="font-bold">YES</span>
                <span className="text-pink-400 dark:text-pink-200">!</span> Things I like
              </p>
              <p className="text-sm text-pink-600 dark:text-pink-400 mt-2">
                I love playing HSR, drawing cute characters, listening to music, and eating sweets! My favorite color is
                pastel pink and I adore kawaii aesthetics.
              </p>
            </motion.div>

            <motion.div
              className="bg-pink-50 dark:bg-[#2d2d42] p-4 rounded-xl mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
                <span className="font-bold">NO</span>
                <span className="text-pink-400 dark:text-pink-200">!</span> Things I dislike
              </p>
              <p className="text-sm text-pink-600 dark:text-pink-400 mt-2">
                I don't like spicy food, horror movies, rainy days when I have to go out, and when my internet is slow
                while gaming.
              </p>
            </motion.div>

            <motion.div
              className="bg-pink-50 dark:bg-[#2d2d42] p-4 rounded-xl mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
                <span className="font-bold">OTHER</span>
                <span className="text-pink-400 dark:text-pink-200">!</span> More about me
              </p>
              <p className="text-sm text-pink-600 dark:text-pink-400 mt-2">
                I'm a digital artist who loves to create cute illustrations. My dream is to publish my own manga one
                day! I also enjoy collecting stationery and plushies.
              </p>
            </motion.div>

            <motion.div
              className="mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-pink-600 dark:text-pink-400 mb-2">Send me a cute message:</p>
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-grow px-4 py-2 rounded-l-lg border border-pink-200 dark:border-[#3d3d5a] focus:outline-none focus:ring-2 focus:ring-pink-300 dark:bg-[#2d2d42] dark:text-white"
                  placeholder="Type something cute..."
                />
                <motion.button
                  className="button px-4 py-2 text-pink-600 dark:text-pink-300 font-medium rounded-r-lg"
                  onClick={sendMessage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fas fa-paper-plane"></i>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Message Notification */}
        <div
          className={`fixed bottom-4 right-4 bg-pink-100 dark:bg-[#2d2d42] border border-pink-300 dark:border-[#3d3d5a] text-pink-700 dark:text-pink-300 px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 ${
            showNotification ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          Message sent! <i className="fas fa-check ml-1"></i>
        </div>
      </motion.div>
    </div>
  )
}
