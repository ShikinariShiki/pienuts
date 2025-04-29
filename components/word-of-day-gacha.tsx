"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentWord, setCurrentWord] = useState("")
  const [hasOpened, setHasOpened] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const confettiRef = useRef<HTMLDivElement>(null)

  // Check if user has already opened gacha today
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastOpenDate = localStorage.getItem("lastGachaDate")
      const today = new Date().toDateString()

      if (lastOpenDate === today) {
        // User has already opened gacha today
        const savedWord = localStorage.getItem("todaysGachaWord")
        if (savedWord) {
          setCurrentWord(savedWord)
          setIsOpen(true)
          setHasOpened(true)
        }
      }
    }
  }, [])

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

  // Open the gacha
  const openGacha = () => {
    if (hasOpened) return

    setIsSpinning(true)

    // Simulate spinning animation
    setTimeout(() => {
      // Get random affirmation
      const randomIndex = Math.floor(Math.random() * affirmations.length)
      const word = affirmations[randomIndex]

      setCurrentWord(word)
      setIsSpinning(false)
      setIsOpen(true)
      setHasOpened(true)
      setShowConfetti(true)

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("lastGachaDate", new Date().toDateString())
        localStorage.setItem("todaysGachaWord", word)
      }

      // Create confetti effect
      createConfetti()

      // Hide confetti after animation
      setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
    }, 2000)
  }

  return (
    <div className="relative">
      {/* Confetti container */}
      {showConfetti && (
        <div ref={confettiRef} className="absolute inset-0 overflow-hidden pointer-events-none z-10"></div>
      )}

      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <h1 className="text-3xl font-bold text-pink-600 dark:text-pink-300 mb-6">
            Word of the Day <span className="text-pink-400">♡</span>
          </h1>

          <p className="text-pink-600 dark:text-pink-400 mb-8">
            Get your daily word of affirmation! You can open one gacha per day.
          </p>

          <div className="gacha-container mb-16">
            <motion.div
              className={`gacha-box ${isSpinning ? "spinning" : ""}`}
              animate={isOpen ? { rotateY: 180 } : { rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <div className="gacha-face gacha-front">
                {!hasOpened ? (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl mb-2">✨</span>
                    <p className="text-lg font-medium">Tap to open!</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl mb-2">✨</span>
                    <p className="text-lg font-medium">Already opened today!</p>
                  </div>
                )}
              </div>

              <div className="gacha-face gacha-back">
                <div className="gacha-result">
                  <span className="text-4xl mb-4 block">💌</span>
                  <p className="text-lg">{currentWord}</p>
                </div>
              </div>
            </motion.div>

            <div className="gacha-button">
              <Button
                onClick={openGacha}
                disabled={hasOpened || isSpinning}
                className="px-6 py-2 text-pink-600 dark:text-pink-300 font-medium"
              >
                {isSpinning ? "Opening..." : hasOpened ? "Come back tomorrow" : "Open Gacha"}
              </Button>
            </div>
          </div>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4"
            >
              <p className="text-sm text-pink-500 dark:text-pink-400">
                Remember this affirmation throughout your day! ♡
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
