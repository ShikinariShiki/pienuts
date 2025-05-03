"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { fetchByfData } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"
import { PageNavigation } from "@/components/page-navigation"

export default function ByfPage() {
  const [byfData, setByfData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchByfData()
        setByfData(data)
        setError(null)
      } catch (err) {
        setError("Failed to load BYF data. Please try again!")
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
          BYF<span className="text-pink-400">!</span>
        </motion.h1>

        <motion.div
          className="divider mb-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3 }}
        />

        <motion.div
          className="bg-pink-50 dark:bg-[#2d2d42] p-6 rounded-xl mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-pink-700 dark:text-pink-300 mb-4">
            Before You Follow<span className="text-pink-400 dark:text-pink-200">!</span>
          </h2>

          <p className="text-pink-600 dark:text-pink-400 mb-4">Please be aware of these things before you follow me:</p>

          <ul className="list-disc pl-6 space-y-2 text-pink-600 dark:text-pink-400">
            <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              My account is #unlabeled, sometimes it can be anime, the other time it can be anything else (YANG MASIH AMAN YA!)
            </motion.li>
            <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              I like to yap ALOT! dan bakal jbjb brutal jugaa if I'm feeling to do it!
            </motion.li>
            <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              Sometimes, I will use harsh words📵 for insulting and criticizing the gov 💭
            </motion.li>
            <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
              My EN is kinda broken and currently on a state of fixing it 🔮
            </motion.li>
            <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
              Will DM you for asking help or just simply greet you in the morning!
            </motion.li>
          </ul>
        </motion.div>

        <motion.div
          className="bg-pink-50 dark:bg-[#2d2d42] p-6 rounded-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <h2 className="text-xl font-bold text-pink-700 dark:text-pink-300 mb-4">
            Note<span className="text-pink-400 dark:text-pink-200">!</span>
          </h2>

          <p className="text-pink-600 dark:text-pink-400">
            If you're comfortable with all of that, feel free to follow! (◕‿◕✿)
          </p>
        </motion.div>
        <PageNavigation />
      </motion.div>
    </div>
  )
}
