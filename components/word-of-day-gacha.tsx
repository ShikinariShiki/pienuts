"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

// Words of affirmation
const affirmations = [
  "Your kindness toward others reflects the kindness you deserve.",
  "Remember to always have courage and be kind.",
  "Do not worry about tomorrow's struggle as each day has enough trouble of its own.",
  "Wise words bring many benefits, and hard work brings rewards.",
  "A friend is always loyal, and a brother is born to help in time of need.",
  "To acquire wisdom is to love yourself; people who cherish understanding will prosper in their life.",
  "Do not worry about everyday life, as it will be provided to you eventually.",
  "There are 'friends' who destroy each other, but a real friend sticks closer than a brother.",
  "Wise words are more valuable than much gold and many rubies.",
  "A cheerful heart is good medicine, but a broken spirit saps a person's strength.",
  "Worry weighs a person down but an encouraging word cheers a person up.",
  "Even small steps forward mean you haven't given up.",
  "Do not judge others, and you will not be judged. Do not condemn others, or it will all come back against you.",
  "You are learning how to be good to yourself.",
  "Not every day will be easy but you'll get through it.",
  "There is strength in the way you keep going quietly.",
  "You are allowed to feel everything without apology.",
  "Don't act thoughtlessly and make the most of every opportunity in every moment in your life.",
  "Do not bother correcting those who mock you; they will only hate you. But correct those who cared about you, and they will love you forever with their life.",
  "You are becoming someone who truly cares for themselves.",
  "Never take revenge. Always do things in such a way that everyone can see you are honorable.",
  "Let today be kind to you and let yourself be kind too.",
  "Don't let evil conquer you, but conquer evil by doing good.",
  "Sometimes doing nothing is the best way to reset your mind.",
  "Keep on asking, and you will receive what you ask for. Keep on seeking, and you will find anything you want.",
  "You are safe to feel whatever you're feeling right now.",
  "Be happy with those who are happy, and weep with those who weep.",
  "The struggles in your life are no different from what others experience. When you are stuck, life will show you a way out so that you can endure through it.",
  "Not every thought needs an answer right away, don't be anxious about it.",
  "Don't worry about anything; instead, pray about everything.",
  "I know that you can do anything, and no one can stop you.",
  "You are already making progress by being gentle with yourself.",
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
