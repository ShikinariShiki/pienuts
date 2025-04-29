"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { fetchFavsData } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"
import { PageNavigation } from "@/components/page-navigation"

export default function FavsPage() {
  const [favsData, setFavsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchFavsData()
        setFavsData(data)
        setError(null)
      } catch (err) {
        setError("Failed to load favorites data. Please try again!")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

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

  const categories = [
    {
      name: "Games",
      icon: "🎮",
      items: ["Genshin Impact", "Honkai Star Rail", "Tears of the Kingdom", "Stardew Valley"],
    },
    { name: "Music", icon: "🎵", items: ["K-pop", "J-pop", "Lofi", "Game Soundtracks"] },
    { name: "Anime", icon: "🎬", items: ["Jujutsu Kaisen", "Spy x Family", "Fruits Basket", "My Hero Academia"] },
    { name: "Food", icon: "🍦", items: ["Matcha", "Bubble Tea", "Strawberry Cake", "Ice Cream"] },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-8">
      <motion.div
        className="card w-full max-w-2xl p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <motion.h1
          className="text-3xl font-bold text-pink-600 mb-6 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          FAVS<span className="text-pink-400">!</span>
        </motion.h1>

        <motion.div
          className="divider mb-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3 }}
        />

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              className="bg-pink-50 dark:bg-[#2d2d42] p-6 rounded-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <h2 className="text-xl font-bold text-pink-700 dark:text-pink-300 mb-4 flex items-center">
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </h2>

              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <motion.li
                    key={item}
                    className="text-pink-600 dark:text-pink-400 flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 + itemIndex * 0.05 }}
                  >
                    <motion.span
                      className="inline-block w-2 h-2 bg-pink-400 dark:bg-pink-500 rounded-full mr-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 2,
                        delay: index * 0.2 + itemIndex * 0.1,
                      }}
                    />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-pink-600 dark:text-pink-400 text-sm">
            These are just a few of my favorites! I'm always discovering new things to love. (◕‿◕✿)
          </p>
        </motion.div>

        <PageNavigation />
      </motion.div>
    </div>
  )
}
