"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RefreshCw, Heart, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

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
  const [userName, setUserName] = useState("")
  const [savedUserName, setSavedUserName] = useState("")
  const [showNameInput, setShowNameInput] = useState(true)
  const [showLetter, setShowLetter] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const confettiRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Check if we have a saved name on component mount
  useEffect(() => {
    const savedName = localStorage.getItem("wotd-username")
    if (savedName) {
      setSavedUserName(savedName)
      setUserName(savedName)
      setShowNameInput(false)
    }
  }, [])

  // Generate a random word
  const getRandomWord = () => {
    const availableWords = [...affirmations]
    for (let i = availableWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[availableWords[i], availableWords[j]] = [availableWords[j], availableWords[i]]
    }
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

  // Handle name submission
  const handleSubmitName = () => {
    if (userName.trim()) {
      // Check for secret name - make it case insensitive
      if (userName.trim().toLowerCase() === "piechang goreng") {
        // Store the secret in session storage to maintain access
        sessionStorage.setItem("secretGalleryAccess", "true")
        // Redirect to secret gallery
        router.push("/secret-gallery")
        return
      }

      localStorage.setItem("wotd-username", userName.trim())
      setSavedUserName(userName.trim())
      setShowNameInput(false)
      handleGetWOTD()
    }
  }

  // Handle getting a new WOTD
  const handleGetWOTD = () => {
    setCurrentWord(getRandomWord())
    setShowLetter(true)
    setShowConfetti(true)
    createConfetti()

    // Hide confetti after animation
    setTimeout(() => {
      setShowConfetti(false)
    }, 3000)
  }

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

  // Handle changing the name
  const handleChangeName = () => {
    setShowNameInput(true)
    setShowLetter(false)
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

          {showNameInput ? (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-pink-600 dark:text-pink-400 mb-2">
                Please enter your name to receive your daily affirmation:
              </p>

              <div className="flex flex-col space-y-4">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="border-pink-300 dark:border-pink-700 focus:ring-pink-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmitName()
                  }}
                />

                <Button
                  onClick={handleSubmitName}
                  disabled={!userName.trim()}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Get Your Daily Message!
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              {showLetter ? (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-pink-50 dark:bg-[#2d2d42] p-6 rounded-xl min-h-[250px] flex flex-col items-center justify-center relative">
                    {/* Decorative elements */}
                    <div className="absolute top-2 left-2 text-pink-300 dark:text-pink-500 opacity-50">
                      <Heart size={16} />
                    </div>
                    <div className="absolute top-2 right-2 text-pink-300 dark:text-pink-500 opacity-50">
                      <Heart size={16} />
                    </div>

                    {/* Letter content */}
                    <div className="text-center w-full">
                      <div className="mb-6 text-left">
                        <p className="text-pink-700 dark:text-pink-300 font-medium">Dear {savedUserName},</p>
                      </div>

                      <motion.p
                        key={currentWord}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-pink-700 dark:text-pink-300 mb-6 italic"
                      >
                        "{currentWord}"
                      </motion.p>

                      <div className="mt-6 text-right">
                        <p className="text-pink-700 dark:text-pink-300 font-medium">Have a wonderful day!</p>
                        <p className="text-pink-700 dark:text-pink-300 font-medium">With love, Pien ♡</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button
                      onClick={handleChangeName}
                      variant="outline"
                      className="text-pink-600 dark:text-pink-300 border-pink-300 dark:border-pink-700"
                    >
                      Change Name
                    </Button>

                    <Button
                      onClick={handleReshuffle}
                      disabled={isAnimating}
                      className="bg-pink-500 hover:bg-pink-600 text-white"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      <span>{isAnimating ? "Reshuffling..." : "New Message"}</span>
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-pink-600 dark:text-pink-400 mb-4">
                    Welcome back, {savedUserName}! Click below to receive your daily affirmation.
                  </p>

                  <Button onClick={handleGetWOTD} className="bg-pink-500 hover:bg-pink-600 text-white">
                    <Mail className="w-4 h-4 mr-2" />
                    Get Your Daily Message!
                  </Button>

                  <div className="mt-2">
                    <button onClick={handleChangeName} className="text-sm text-pink-500 hover:text-pink-600 underline">
                      Not {savedUserName}? Change name
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
