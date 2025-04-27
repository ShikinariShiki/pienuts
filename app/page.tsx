"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { fetchUserData } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"
import { FloatingHearts } from "@/components/floating-hearts"

export default function Home() {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showHearts, setShowHearts] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchUserData()
        setUserData(data)
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
            Click on the tabs above to explore different sections! (◕‿◕✿)
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
                src="pia.jpeg"
                alt="Profile"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </div>

            <motion.div
              className="w-full"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/profile" className="block">
                <div className="bg-pink-50 dark:bg-[#2d2d42] p-4 rounded-xl text-center hover:shadow-md transition-shadow">
                  <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
                    <span className="font-bold">View Profile</span>
                    <span className="text-pink-400 dark:text-pink-200">!</span>
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
            <motion.div
              className="bg-pink-50 dark:bg-[#2d2d42] p-4 rounded-xl hover:shadow-md transition-shadow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Link href="/dni" className="block">
                <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
                  <span className="font-bold">DNI</span>
                  <span className="text-pink-400 dark:text-pink-200">!</span> Click to see details
                </p>
              </Link>
            </motion.div>

            <motion.div
              className="bg-pink-50 dark:bg-[#2d2d42] p-4 rounded-xl hover:shadow-md transition-shadow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Link href="/byf" className="block">
                <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
                  <span className="font-bold">BYF</span>
                  <span className="text-pink-400 dark:text-pink-200">!</span> Click to see details
                </p>
              </Link>
            </motion.div>

            <motion.div
              className="bg-pink-50 dark:bg-[#2d2d42] p-4 rounded-xl hover:shadow-md transition-shadow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Link href="/favs" className="block">
                <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
                  <span className="font-bold">FAVS</span>
                  <span className="text-pink-400 dark:text-pink-200">!</span> Click to see favorites
                </p>
              </Link>
            </motion.div>

            <div className="flex justify-center mt-6">
              <motion.button
                className="button px-6 py-2.5 text-pink-600 dark:text-pink-300 font-medium flex items-center space-x-2"
                onClick={handleHeartClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="heartbeat">⭐</span>
                <span>Send Love</span>
              </motion.button>
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
