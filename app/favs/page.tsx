"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { fetchFavsData } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"
import { PageNavigation } from "@/components/page-navigation"
import Image from "next/image"

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

  // Game data with real images from Vercel Blob
  const games = [
    {
      name: "Genshin Impact",
      icon: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/genshin-n3B9IX5Gr6McoQn0NxoCEjqEGz9cgB.jpeg",
    },
    {
      name: "Honkai: Star Rail",
      icon: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/starel-RiJ6Z2Ccj2iKPhEKC5ZjOv7Zuq3U3i.jpeg",
    },
    {
      name: "Zenless Zone Zero",
      icon: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/anby-8qZ3RmFWyvZAV0v4YtKxufuek7GIBA.png",
    },
    {
      name: "Cookie Run Kingdom",
      icon: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/crk-8j0pR0IcucwWhTsrRzIY6z9V0k32EH.png",
    },
    {
      name: "Bang Dream!",
      icon: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/bandori-NDUyKX7WCuNlFgMxXXDl8tWlEQielc.png",
    },
    {
      name: "Minecraft",
      icon: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/minecraft-lxVsjCBERPG7ikyxLQBEBtguitQuaG.png",
    },
  ]

  // Music data - specific songs
  const music = [
    { title: "From The Start", artist: "Laufey" },
    { title: "Last Train at 25 O'Clock", artist: "Lamp" },
    { title: "Weak", artist: "Fujii Kaze" },
    { title: "luther", artist: "Kendrick Lamar and SZA" },
    { title: "Tokai", artist: "Taeko Onuki" },
  ]

  // Character data with real images from Vercel Blob
  const characters = [
    {
      name: "Sangonomiya Kokomi",
      icon: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/kokomi-gwcXA7glinoNxLCHQawbElJWFR9fnA.jpg",
    },
    {
      name: "Vivian",
      icon: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/vivian-bjDxrzGgCMDstUAT9jJsT9hEWztptY.jpg",
    },
    {
      name: "Castorice",
      icon: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/casto-il9lUjvceoZUzq5IQGDTlBWQNBzE3K.jpg",
    },
    {
      name: "Phoebe",
      icon: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/phoebe-hKbdxCZfVgVVO2qqIcDtJaIVoc2NrJ.jpg",
    },
    {
      name: "Navia",
      icon: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/navia-YocGLJS6pAP6rDNM8Tx3h0TJMngDBz.jpg",
    },
    {
      name: "Lighter",
      icon: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/lighter-2Hsf39peDXQCoEcsqulzhKKzrLS4GR.jpg",
    },
  ]

  // Food data
  const foods = ["Mi Goreng", "Pizza", "Dimsum Mentai", "Mi Ayam", "Strawberry Ice Cream"]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-8">
      <motion.div
        className="card w-full max-w-3xl p-6"
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

        {/* Games Section */}
        <motion.section
          className="mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-pink-700 dark:text-pink-300 mb-4 flex items-center">
            <span className="mr-2">🎮</span>
            Games
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {games.map((game, index) => (
              <motion.div
                key={game.name}
                className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-[#2d2d42] dark:to-[#3d3d52] p-4 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <div className="w-16 h-16 relative mb-2 rounded-lg overflow-hidden">
                  <Image src={game.icon || "/placeholder.svg"} alt={game.name} fill className="object-cover" />
                </div>
                <p className="text-sm font-medium text-pink-600 dark:text-pink-400 text-center">{game.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Music Section */}
        <motion.section
          className="mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-bold text-pink-700 dark:text-pink-300 mb-4 flex items-center">
            <span className="mr-2">🎵</span>
            Music
          </h2>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-[#2d2d42] dark:to-[#3d3d52] p-5 rounded-xl shadow-sm">
            <ul className="space-y-3">
              {music.map((song, index) => (
                <motion.li
                  key={song.title}
                  className="flex items-center bg-white dark:bg-[#1f1f2f] p-3 rounded-lg shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white mr-3">
                    <span className="text-xs">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-pink-600 dark:text-pink-400">{song.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Characters Section */}
        <motion.section
          className="mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl font-bold text-pink-700 dark:text-pink-300 mb-4 flex items-center">
            <span className="mr-2">✨</span>
            Characters
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {characters.map((character, index) => (
              <motion.div
                key={character.name}
                className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-[#3d3d52] dark:to-[#2d2d42] p-4 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <div className="w-16 h-16 relative mb-2 rounded-full overflow-hidden border-2 border-pink-200 dark:border-pink-700">
                  <Image
                    src={character.icon || "/placeholder.svg"}
                    alt={character.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-pink-600 dark:text-pink-400 text-center">{character.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Food Section */}
        <motion.section
          className="mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <h2 className="text-xl font-bold text-pink-700 dark:text-pink-300 mb-4 flex items-center">
            <span className="mr-2">🍦</span>
            Food
          </h2>

          <div className="flex flex-wrap gap-3">
            {foods.map((food, index) => (
              <motion.div
                key={food}
                className="bg-gradient-to-r from-pink-100 to-pink-50 dark:from-[#3d3d52] dark:to-[#2d2d42] px-4 py-2 rounded-full shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-sm font-medium text-pink-600 dark:text-pink-400">{food}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
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
