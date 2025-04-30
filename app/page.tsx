"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { fetchUserData } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"
import { FloatingHearts } from "@/components/floating-hearts"
import { User, X, Heart, Star, MessageSquare, Gift } from "lucide-react"
import { PageNavigation } from "@/components/page-navigation"

export default function Home() {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showHearts, setShowHearts] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const userData = await fetchUserData()
        setUserData(userData)
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
          <p className="text-pink-600 dark:text-pink-300 mb-4">{error}</p>
          <button
            className="button px-4 py-2 text-pink-600 dark:text-pink-300 font-medium"
            onClick={() => window.location.reload()}
          >
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
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-6">
          <motion.h1
            className="text-4xl font-bold text-pink-600 dark:text-pink-300 mb-2"
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Welcome to <span className="text-pink-400 dark:text-pink-200">pien's</span> kawaii caard!
          </motion.h1>
          <motion.p
            className="text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <span className="inline-block mx-1">✿</span>
            Click on the tabs above to explore!
            <span className="inline-block mx-1">✿</span>
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <motion.div
            className="md:w-1/2"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div
              className="profile-img w-full h-64 relative cursor-pointer mb-4 overflow-hidden rounded-[20px]"
              onClick={handleHeartClick}
            >
              <Image
                src="/images/profile.jpeg"
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

            <Link href="/profile">
              <motion.button
                className="w-full button px-4 py-3 text-pink-600 dark:text-pink-300 font-medium flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>View Profile</span>
                <span>♡</span>
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            className="md:w-1/2"
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {/* Site Directory */}
            <motion.div
              className="h-full flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.h2
                className="text-xl font-bold text-pink-600 dark:text-pink-300 mb-4"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                Site Directory <span className="text-pink-400">♡</span>
              </motion.h2>

              <motion.div
                className="divider mb-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5 }}
              />

              <div className="space-y-3 flex-grow">
                {[
                  {
                    path: "/profile",
                    label: "Profile",
                    icon: <User className="w-4 h-4" />,
                    description: "View my profile",
                  },
                  {
                    path: "/dni",
                    label: "DNI",
                    icon: <X className="w-4 h-4" />,
                    description: "Do Not Interact guidelines",
                  },
                  {
                    path: "/byf",
                    label: "BYF",
                    icon: <Heart className="w-4 h-4" />,
                    description: "Before You Follow information",
                  },
                  {
                    path: "/favs",
                    label: "FAVS",
                    icon: <Star className="w-4 h-4" />,
                    description: "My favorite things",
                  },
                  {
                    path: "/messages",
                    label: "Messages",
                    icon: <MessageSquare className="w-4 h-4" />,
                    description: "Send and view messages",
                  },
                  {
                    path: "/gacha",
                    label: "Daily Word",
                    icon: <Gift className="w-4 h-4" />,
                    description: "Get your word of affirmation",
                  },
                ].map((link, index) => (
                  <Link href={link.path} key={link.path}>
                    <motion.div
                      className="bg-pink-50 dark:bg-[#2d2d42] p-3 rounded-xl flex items-center gap-3 hover:bg-pink-100 dark:hover:bg-[#3d3d5a] transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="bg-pink-200 dark:bg-pink-800/30 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-pink-600 dark:text-pink-300">{link.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-pink-700 dark:text-pink-300">{link.label}</p>
                        <p className="text-xs text-pink-500 dark:text-pink-400">{link.description}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="divider my-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        />

        <motion.div
          className="flex justify-center space-x-8"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
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

        <PageNavigation />
      </motion.div>
    </div>
  )
}
