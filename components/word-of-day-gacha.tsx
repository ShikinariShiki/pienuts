"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RefreshCw, Heart, Mail } from "lucide-react"

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
  "Watch your tongue and keep your mouth shut, and you will stay out of trouble.",
  "Do not judge others, and you will not be judged. Do not condemn others, or it will all come back against you.",
  "An inheritance obtained too early in life is not a blessing in the end.",
  "Whoever loves a pure heart and gracious speech will have the king as a friend.",
  "If you love sleep, you will end in laziness. Keep your eyes open, and there will be plenty things to enjoy.",
  "Don't answer the foolish arguments of fools, or you will become as foolish as they are.",
  "Don't act thoughtlessly and make the most of every opportunity in every moment in your life.",
  "Do not bother correcting those who mock you; they will only hate you. But correct those who cared about you, and they will love you forever with their life.",
  "If you set a trap for others, you will get caught in it yourself. If you roll a boulder down on others, it will crush you instead.",
  "Never take revenge. Always do things in such a way that everyone can see you are honorable.",
  "Let today be kind to you and let yourself be kind too.",
  "Don't let evil conquer you, but conquer evil by doing good.",
  "If your heart is wise, my own heart will rejoice! Everything in me will celebrate when you speak what is right.",
  "Keep on asking, and you will receive what you ask for. Keep on seeking, and you will find anything you want.",
  "You are safe to feel whatever you're feeling right now.",
  "Be happy with those who are happy, and weep with those who weep.",
  "The struggles in your life are no different from what others experience. When you are stuck, life will show you a way out so that you can endure through it.",
  "Not every thought needs an answer right away, don't be anxious about it.",
  "Don't worry about anything; instead, pray about everything.",
  "I know that you can do anything, and no one can stop you.",
  "Do not envy evil people or desire their company. For their hearts plot violence, and their words always stir up trouble.",
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
