"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { fetchUserData, fetchRecentMessages } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"
import { FloatingHearts } from "@/components/floating-hearts"
import { MusicPlayer } from "@/components/music-player"

export default function Home() {
  const [userData, setUserData] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showHearts, setShowHearts] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [userData, messagesData] = await Promise.all([fetchUserData(), fetchRecentMessages()])
        setUserData(userData)
        setMessages(messagesData.slice(0, 3)) // Show only 3 recent messages
        setError(null)
      } catch (err) {
        setError("Failed to load data. Please try again!")
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
      <MusicPlayer />

      <motion.div
        className="card w-full max-w-2xl p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-bold text-pink-600 mb-2"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          >
            Welcome to <span className="text-pink-400">pien's</span> kawaii caard!
          </motion.h1>
          <motion.p
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="inline-block mx-1">✿</span>
            Click on the tabs above to explore!
            <span className="inline-block mx-1">✿</span>
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className="flex flex-col items-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <div
              className="profile-img w-full h-64 relative cursor-pointer mb-4 overflow-hidden rounded-[20px]"
              onClick={handleHeartClick}
            >
              <Image
                src="/images/profile.png"
                alt="Profile"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
                <div className="bg-pink-400/70 backdrop-blur-sm rounded-full px-4 py-1 inline-block">
                  <span className="text-sm font-medium">♡ Click me! ♡</span>
                </div>
              </div>
            </div>

            <motion.div
              className="w-full"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/profile" className="block">
                <div className="bg-pink-50 dark:bg-[#2d2d42] p-4 rounded-xl text-center hover:shadow-md transition-shadow border-2 border-pink-200 dark:border-pink-800/30">
                  <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
                    <span className="font-bold">View Profile</span>
                    <span className="text-pink-400 dark:text-pink-200"> ♡</span>
                  </p>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <div className="grid grid-cols-3 gap-3 mb-4">
              <Link href="/dni">
                <motion.div
                  className="bg-pink-100 dark:bg-[#2d2d42] p-3 rounded-xl text-center hover:shadow-md transition-shadow border-2 border-pink-200 dark:border-pink-800/30"
                  whileHover={{ y: -5, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <div className="bg-pink-200 dark:bg-pink-800/30 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-pink-600 dark:text-pink-300 text-lg">✘</span>
                  </div>
                  <p className="text-xs font-bold text-pink-700 dark:text-pink-300">DNI</p>
                </motion.div>
              </Link>

              <Link href="/byf">
                <motion.div
                  className="bg-pink-100 dark:bg-[#2d2d42] p-3 rounded-xl text-center hover:shadow-md transition-shadow border-2 border-pink-200 dark:border-pink-800/30"
                  whileHover={{ y: -5, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <div className="bg-pink-200 dark:bg-pink-800/30 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-pink-600 dark:text-pink-300 text-lg">♡</span>
                  </div>
                  <p className="text-xs font-bold text-pink-700 dark:text-pink-300">BYF</p>
                </motion.div>
              </Link>

              <Link href="/favs">
                <motion.div
                  className="bg-pink-100 dark:bg-[#2d2d42] p-3 rounded-xl text-center hover:shadow-md transition-shadow border-2 border-pink-200 dark:border-pink-800/30"
                  whileHover={{ y: -5, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <div className="bg-pink-200 dark:bg-pink-800/30 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-pink-600 dark:text-pink-300 text-lg">★</span>
                  </div>
                  <p className="text-xs font-bold text-pink-700 dark:text-pink-300">FAVS</p>
                </motion.div>
              </Link>
            </div>

            <motion.div
              className="bg-pink-50 dark:bg-[#2d2d42] p-4 rounded-xl border-2 border-pink-200 dark:border-pink-800/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-pink-700 dark:text-pink-300">
                  Recent Messages <span className="text-pink-400">♡</span>
                </h3>
                <Link href="/messages">
                  <span className="text-xs text-pink-500 hover:underline">View All</span>
                </Link>
              </div>

              <div className="space-y-2">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      className="bg-white dark:bg-[#1a1a2e] p-2 rounded-lg text-xs text-pink-700 dark:text-pink-300 border border-pink-100 dark:border-[#2d2d42]"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      {msg.message}
                      <div className="text-right text-pink-400 text-[10px] mt-1">{msg.date}</div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-xs text-pink-400">No messages yet!</p>
                )}
              </div>
            </motion.div>

            <div className="flex justify-center mt-2">
              <Link href="/messages">
                <motion.button
                  className="button px-6 py-2 text-pink-600 dark:text-pink-300 font-medium flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span>Send Message</span>
                  <span className="text-lg">✉</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="divider my-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
        />

        <motion.div
          className="flex justify-center space-x-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.a
            href="https://x.com/advocasie"
            className="text-pink-600 dark:text-pink-400 hover:text-pink-400 dark:hover:text-pink-300 font-medium tooltip"
            target="_blank"
            whileHover={{ y: -3, scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            rel="noreferrer"
          >
            <span className="tooltiptext">Visit my Twitter</span>
            <i className="fab fa-twitter text-xl"></i>
          </motion.a>
          <motion.a
            href="#"
            className="text-pink-600 dark:text-pink-400 hover:text-pink-400 dark:hover:text-pink-300 font-medium tooltip"
            whileHover={{ y: -3, scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="tooltiptext">My Instagram</span>
            <i className="fab fa-instagram text-xl"></i>
          </motion.a>
          <motion.a
            href="#"
            className="text-pink-600 dark:text-pink-400 hover:text-pink-400 dark:hover:text-pink-300 font-medium tooltip"
            whileHover={{ y: -3, scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="tooltiptext">My Art Station</span>
            <i className="fas fa-palette text-xl"></i>
          </motion.a>
          <motion.a
            href="#"
            className="text-pink-600 dark:text-pink-400 hover:text-pink-400 dark:hover:text-pink-300 font-medium tooltip"
            whileHover={{ y: -3, scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="tooltiptext">Contact Me</span>
            <i className="fas fa-envelope text-xl"></i>
          </motion.a>
        </motion.div>

        <motion.div
          className="text-center mt-6 text-xs text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          Made with <span className="text-pink-400">♥</span> using Next.js
        </motion.div>
      </motion.div>
    </div>
  )
}
