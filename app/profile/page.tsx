"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { fetchUserProfile } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"
import { FloatingHearts } from "@/components/floating-hearts"
import { PageNavigation } from "@/components/page-navigation"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showHearts, setShowHearts] = useState(false)

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
              <Image src="https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/profile-TmrUwvKldkxdCEKtQEwJ4Pon7lplZ8.jpeg" alt="Profile" fill className="object-cover" />
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
              {["🎨 Artist", "🎮 Gamer", "🌸 Otaku", "🎵 Music Lover", "🍰 Foodie"].map((tag, index) => (
                <motion.span
                  key={index}
                  className="bg-pink-100 dark:bg-[#2d2d42] px-3 py-1 rounded-full text-sm text-pink-700 dark:text-pink-300 cursor-pointer"
                  onClick={handleHeartClick}
                  whileHover={{ y: -2, scale: 1.05, backgroundColor: "var(--pink-200)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag}
                </motion.span>
              ))}
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
          </div>
        </motion.div>

        {/* Add more detailed sections */}
        <motion.div
          className="mt-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.h2
            className="text-xl font-bold text-pink-600 dark:text-pink-300 mb-4"
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            More About Me <span className="text-pink-400">♡</span>
          </motion.h2>

          <motion.div
            className="divider mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9 }}
          />

          <div className="space-y-4">
            <motion.div
              className="bg-pink-50 dark:bg-[#2d2d42] p-4 rounded-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <h3 className="text-sm font-bold text-pink-700 dark:text-pink-300 mb-2 flex items-center">
                <span className="mr-2">🎨</span> Art Style
              </h3>
              <p className="text-sm text-pink-600 dark:text-pink-400">
                I specialize in kawaii digital art with soft pastel colors. My style is inspired by anime and cute
                character designs. I love adding small details that make each piece unique and full of personality!
              </p>
            </motion.div>

            <motion.div
              className="bg-pink-50 dark:bg-[#2d2d42] p-4 rounded-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <h3 className="text-sm font-bold text-pink-700 dark:text-pink-300 mb-2 flex items-center">
                <span className="mr-2">🎮</span> Gaming Life
              </h3>
              <p className="text-sm text-pink-600 dark:text-pink-400">
                I'm an avid gamer who loves RPGs and adventure games. Currently obsessed with Honkai Star Rail and
                Genshin Impact! I stream occasionally and love connecting with other gamers who share similar interests.
              </p>
            </motion.div>

            <motion.div
              className="bg-pink-50 dark:bg-[#2d2d42] p-4 rounded-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <h3 className="text-sm font-bold text-pink-700 dark:text-pink-300 mb-2 flex items-center">
                <span className="mr-2">✨</span> Future Goals
              </h3>
              <p className="text-sm text-pink-600 dark:text-pink-400">
                I'm working towards publishing my own manga and creating a line of kawaii merchandise featuring my
                original characters. I also hope to attend more conventions and connect with fans in person!
              </p>
            </motion.div>

            <motion.div
              className="bg-pink-50 dark:bg-[#2d2d42] p-4 rounded-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <h3 className="text-sm font-bold text-pink-700 dark:text-pink-300 mb-2 flex items-center">
                <span className="mr-2">💌</span> Contact & Commissions
              </h3>
              <p className="text-sm text-pink-600 dark:text-pink-400">
                I'm currently open for art commissions! If you'd like custom artwork in my style, feel free to reach out
                via email or my social media accounts. I typically respond within 48 hours and love discussing creative
                projects!
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-3 -right-3 w-8 h-8 bg-pink-300 dark:bg-pink-500 rounded-full flex items-center justify-center text-white hidden md:flex"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          ♡
        </motion.div>
        <motion.div
          className="absolute -bottom-3 -left-3 w-8 h-8 bg-pink-300 dark:bg-pink-500 rounded-full flex items-center justify-center text-white hidden md:flex"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.3, type: "spring" }}
        >
          ♡
        </motion.div>
        <PageNavigation />
      </motion.div>
    </div>
  )
}
