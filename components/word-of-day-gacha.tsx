"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

// Words of affirmation
const affirmations = [
  "You are enough just as you are.",
  "Your presence lights up every room you enter.",
  "You are capable of amazing things.",
  "Your kindness makes a difference.",
  "You are stronger than you know.",
  "Your potential is limitless.",
  "You deserve all the good things coming your way.",
  "Your smile brightens everyone's day.",
  "You are worthy of love and respect.",
  "Your efforts matter and are appreciated.",
  "You bring unique gifts to the world.",
  "You are making progress, even when you don't feel it.",
  "Your voice deserves to be heard.",
  "You inspire others more than you realize.",
  "You are resilient and can overcome any challenge.",
  "Your dreams are valid and achievable.",
  "You are surrounded by love, even when you feel alone.",
  "Your creativity knows no bounds.",
  "You make the world a better place just by being you.",
  "You are exactly where you need to be right now.",
  "Your heart is pure and your intentions are beautiful.",
  "You are allowed to take up space in this world.",
  "Your feelings are valid and important.",
  "You are becoming the person you've always wanted to be.",
  "You are a masterpiece in progress.",
  "Your courage is admirable.",
  "You are deserving of rest and peace.",
  "Your uniqueness is your superpower.",
  "You are loved more than you know.",
  "You are exactly who you're meant to be.",
  "You radiate positive energy.",
]

export function WordOfDayGacha() {
  const [currentWord, setCurrentWord] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const confettiRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Generate a random word based on device ID
  const getRandomWord = () => {
    // Get all available words
    const availableWords = [...affirmations]

    // Shuffle array using Fisher-Yates algorithm
    for (let i = availableWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[availableWords[i], availableWords[j]] = [availableWords[j], availableWords[i]]
    }

    // Return the first word from shuffled array
    return availableWords[0]
  }

  // Create confetti elements
  const createConfetti = () => {
    if (!confettiRef.current) return

    const container = confettiRef.current
    container.innerHTML = ""

    const colors = ["#ff66a3", "#ff8fab", "#ffb3d1", "#ff4d94", "#ff3385"]

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.style.left = `${Math.random() * 100}%`
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDelay = `${Math.random() * 3}s`
      confetti.style.animationDuration = `${Math.random() * 2 + 3}s`
      container.appendChild(confetti)
    }
  }

  // Initialize word on first load
  useEffect(() => {
    setCurrentWord(getRandomWord())
  }, [])

  // Handle reshuffling the word
  const handleReshuffle = () => {
    if (isAnimating) return

    setIsAnimating(true)

    // Trigger confetti
    setShowConfetti(true)
    createConfetti()

    // Animate out
    setTimeout(() => {
      // Get new word
      setCurrentWord(getRandomWord())

      // Hide confetti after animation
      setTimeout(() => {
        setShowConfetti(false)
        setIsAnimating(false)
      }, 3000)
    }, 300)
  }

  return (
    <div className="relative">
      {/* Confetti container */}
      {showConfetti && (
        <div ref={confettiRef} className="absolute inset-0 overflow-hidden pointer-events-none z-10"></div>
      )}

      {/* Fixed card size with proper proportions */}
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <h1 className="text-3xl font-bold text-pink-600 dark:text-pink-300 mb-6">
            Word of the Day <span className="text-pink-400">♡</span>
          </h1>

          <p className="text-pink-600 dark:text-pink-400 mb-6">Your unique daily affirmation, just for you!</p>

          <motion.div
            className="mb-8"
            animate={isAnimating ? { scale: [1, 0.9, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-pink-100 dark:bg-[#2d2d42] p-6 rounded-xl min-h-[180px] flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl mb-4 block">💌</span>
                <motion.p
                  key={currentWord}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg text-pink-700 dark:text-pink-300"
                >
                  {currentWord}
                </motion.p>
              </div>
            </div>
          </motion.div>

          <motion.div className="flex justify-center">
            <Button
              onClick={handleReshuffle}
              disabled={isAnimating}
              className="px-6 py-2 text-pink-600 dark:text-pink-300 font-medium flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              <span>{isAnimating ? "Reshuffling..." : "Reshuffle"}</span>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}
