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

        <div className="flex flex-col gap-8">
          <motion.div
            className="mx-auto w-full max-w-md"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div
              className="profile-img w-full h-64 relative cursor-pointer mb-4 overflow-hidden rounded-[20px]"
              onClick={handleHeartClick}
            >
              <Image
                src="https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/profile-TmrUwvKldkxdCEKtQEwJ4Pon7lplZ8.jpeg"
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
          </motion.div>

          <motion.div
            className="w-full"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <motion.div
              className="h-full flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="text-center mb-4"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <h2 className="text-xl font-bold text-pink-600 dark:text-pink-300">
                  <span className="inline-block mx-1">✿</span>
                  Site Directory
                  <span className="inline-block mx-1">✿</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mt-2"></div>
              </motion.div>

              <div className="space-y-6 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      path: "/profile",
                      label: "Profile",
                      icon: <User className="w-4 h-4" />,
                      description: "View my profile",
                      bgColor: "bg-gradient-to-r from-pink-200 to-pink-300",
                      iconBg: "bg-white/70",
                    },
                    {
                      path: "/dni",
                      label: "DNI",
                      icon: <X className="w-4 h-4" />,
                      description: "Do Not Interact guidelines",
                      bgColor: "bg-gradient-to-r from-pink-300 to-pink-400",
                      iconBg: "bg-white/70",
                    },
                    {
                      path: "/byf",
                      label: "BYF",
                      icon: <Heart className="w-4 h-4" />,
                      description: "Before You Follow information",
                      bgColor: "bg-gradient-to-r from-pink-200 to-pink-300",
                      iconBg: "bg-white/70",
                    },
                    {
                      path: "/favs",
                      label: "FAVS",
                      icon: <Star className="w-4 h-4" />,
                      description: "My favorite things",
                      bgColor: "bg-gradient-to-r from-pink-300 to-pink-400",
                      iconBg: "bg-white/70",
                    },
                    {
                      path: "/messages",
                      label: "Messages",
                      icon: <MessageSquare className="w-4 h-4" />,
                      description: "Send and view messages",
                      bgColor: "bg-gradient-to-r from-pink-200 to-pink-300",
                      iconBg: "bg-white/70",
                    },
                    {
                      path: "/gacha",
                      label: "Daily Word",
                      icon: <Gift className="w-4 h-4" />,
                      description: "Get your word of affirmation",
                      bgColor: "bg-gradient-to-r from-pink-300 to-pink-400",
                      iconBg: "bg-white/70",
                    },
                  ].map((link, index) => (
                    <Link href={link.path} key={link.path}>
                      <motion.div
                        className={`${link.bgColor} dark:bg-[#2d2d42] p-4 rounded-xl flex items-center gap-3 hover:shadow-lg transition-all relative overflow-hidden`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 10px 25px rgba(255, 102, 163, 0.3)",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 bg-white/10 rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 -ml-4 -mb-4 bg-white/10 rounded-full"></div>

                        <div
                          className={`${link.iconBg} dark:bg-pink-800/30 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}
                        >
                          <span className="text-pink-600 dark:text-pink-300">{link.icon}</span>
                        </div>
                        <div className="text-white dark:text-pink-100">
                          <p className="font-medium">{link.label}</p>
                          <p className="text-xs text-white/80 dark:text-pink-200">{link.description}</p>
                        </div>

                        {/* Small decorative heart */}
                        <div className="absolute bottom-1 right-2 text-white/30 text-xs">♡</div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
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
            href="https://twitter.com/advocasie"
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
            href="https://open.spotify.com/user/thiisprro"
            className="text-pink-600 dark:text-pink-400 hover:text-pink-400 dark:hover:text-pink-300 font-medium tooltip"
            target="_blank"
            whileHover={{ y: -3, scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            rel="noreferrer"
          >
            <span className="tooltiptext">My Spotify</span>
            <i className="fab fa-spotify text-xl"></i>
          </motion.a>
          <motion.a
            href="https://secreto.site/a7x8u7"
            className="text-pink-600 dark:text-pink-400 hover:text-pink-400 dark:hover:text-pink-300 font-medium tooltip"
            target="_blank"
            whileHover={{ y: -3, scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            rel="noreferrer"
          >
            <span className="tooltiptext">Send me a secret message</span>
            <i className="fas fa-envelope text-xl"></i>
          </motion.a>
        </motion.div>

        <PageNavigation />
      </motion.div>
    </div>
  )
}
