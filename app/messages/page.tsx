"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { fetchAllMessages, sendUserMessage } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Try to get messages from localStorage first
        const storedMessages = localStorage.getItem("pien_messages")

        if (storedMessages) {
          setMessages(JSON.parse(storedMessages))
        } else {
          // If no stored messages, fetch from API
          const data = await fetchAllMessages()
          setMessages(data)

          // Store in localStorage
          localStorage.setItem("pien_messages", JSON.stringify(data))
        }

        setError(null)
      } catch (err) {
        setError("Failed to load messages. Please try again!")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return

    try {
      setSending(true)
      await sendUserMessage(newMessage)

      // Fetch updated messages from server
      const updatedMessages = await fetchAllMessages()
      setMessages(updatedMessages)

      setNewMessage("")
      setShowNotification(true)

      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    } catch (err) {
      console.error("Failed to send message:", err)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
      <motion.div
        className="card w-full max-w-2xl p-6"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h1
          className="text-3xl font-bold text-pink-600 dark:text-pink-300 mb-2 text-center"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Messages <span className="text-pink-400 dark:text-pink-200">♡</span>
        </motion.h1>

        <motion.p
          className="text-center text-gray-500 dark:text-gray-400 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Send me an anonymous message!
        </motion.p>

        <motion.div
          className="mb-8"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="bg-pink-50 dark:bg-[#2d2d42] p-4 rounded-xl border-2 border-pink-200 dark:border-pink-800/30">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full p-3 rounded-lg border border-pink-200 dark:border-[#3d3d5a] focus:outline-none focus:ring-2 focus:ring-pink-300 dark:bg-[#1a1a2e] dark:text-white min-h-[100px] resize-none"
            />

            <div className="flex justify-end mt-3">
              <motion.button
                className="button px-4 py-2 text-pink-600 dark:text-pink-300 font-medium flex items-center space-x-2"
                onClick={handleSendMessage}
                disabled={sending || newMessage.trim() === ""}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {sending ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Send</span>
                    <span className="text-lg">✉</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="divider mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        />

        <motion.h2
          className="text-xl font-bold text-pink-600 dark:text-pink-300 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          Recent Messages
        </motion.h2>

        <div className="space-y-3">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                className="bg-white dark:bg-[#1a1a2e] p-4 rounded-xl text-pink-700 dark:text-pink-300 border border-pink-100 dark:border-[#2d2d42] shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              >
                <p className="mb-2">{msg.message}</p>
                <div className="text-right text-pink-400 dark:text-pink-300 text-xs">{msg.date}</div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-pink-400 dark:text-pink-300">No messages yet! Be the first to send one.</p>
          )}
        </div>

        {/* Message Notification */}
        <div
          className={`fixed bottom-4 right-4 bg-pink-100 dark:bg-[#2d2d42] border border-pink-300 dark:border-[#3d3d5a] text-pink-700 dark:text-pink-300 px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 ${
            showNotification ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          Message sent! <i className="fas fa-check ml-1"></i>
        </div>
      </motion.div>
    </div>
  )
}
