"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function SecretGalleryPage() {
  const [drawings, setDrawings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDrawing, setSelectedDrawing] = useState<any | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        setLoading(true)

        // Fetch drawings from local API endpoint
        const response = await fetch("/api/get-drawings")

        // Check if the response is ok before trying to parse JSON
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`API error (${response.status}): ${errorText.substring(0, 100)}...`)
        }

        // Now try to parse the JSON
        let data
        try {
          data = await response.json()
        } catch (jsonError) {
          throw new Error(
            `Failed to parse response as JSON: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`,
          )
        }

        if (data.success && data.data) {
          // Filter out any sample/placeholder drawings
          const realDrawings = (data.data || []).filter(
            (drawing: any) => drawing.drawing_data && !drawing.drawing_data.includes("sample-drawing"),
          )
          setDrawings(realDrawings)
        } else {
          throw new Error(data.error || "Unknown error fetching drawings")
        }
      } catch (err) {
        console.error("Error fetching drawings:", err)
        setError(`${err instanceof Error ? err.message : "Failed to load drawings"}`)
      } finally {
        setLoading(false)
      }
    }

    fetchDrawings()
  }, [])

  const openDrawing = (drawing: any, index: number) => {
    setSelectedDrawing(drawing)
    setCurrentIndex(index)
  }

  const closeDrawing = () => {
    setSelectedDrawing(null)
  }

  const goToNext = useCallback(() => {
    if (drawings.length <= 1) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % drawings.length)
    setSelectedDrawing(drawings[(currentIndex + 1) % drawings.length])
  }, [currentIndex, drawings])

  const goToPrevious = useCallback(() => {
    if (drawings.length <= 1) return
    setCurrentIndex((prevIndex) => (prevIndex - 1 + drawings.length) % drawings.length)
    setSelectedDrawing(drawings[(currentIndex - 1 + drawings.length) % drawings.length])
  }, [currentIndex, drawings])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedDrawing) return

      if (e.key === "Escape") {
        closeDrawing()
      } else if (e.key === "ArrowRight") {
        goToNext()
      } else if (e.key === "ArrowLeft") {
        goToPrevious()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedDrawing, goToNext, goToPrevious])

  // Format date function
  const formatDate = (timestamp: string) => {
    if (!timestamp) return "Unknown date"

    try {
      const date = new Date(timestamp)
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return "Invalid date"
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-gray-900 pt-16 pb-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/gacha" className="flex items-center text-pink-600 hover:text-pink-700 mr-4">
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-center flex-1 text-pink-600 dark:text-pink-400">
            Secret Drawing Gallery ✨
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-2">Error Loading Drawings</h3>
            <p>{error}</p>
            {error.includes("does not exist") && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-red-100">
                <h4 className="font-bold mb-2">How to Fix:</h4>
                <p className="mb-2">You need to create the drawings table in your Supabase database:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Go to your Supabase dashboard</li>
                  <li>Click on "SQL Editor" in the left sidebar</li>
                  <li>Create a new query</li>
                  <li>Paste the SQL code from the create_drawings_table_direct.sql file</li>
                  <li>Click "Run" to execute it</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-400 border-r-transparent"></div>
            <p className="mt-4 text-pink-600 dark:text-pink-400">Loading drawings...</p>
          </div>
        ) : (
          <>
            {!error && drawings.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-pink-600 dark:text-pink-400">No drawings yet! Be the first to send one.</p>
              </div>
            ) : (
              !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drawings.map((drawing: any, index: number) => (
                    <motion.div
                      key={drawing.id || index}
                      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-pink-200 dark:border-pink-900 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      onClick={() => openDrawing(drawing, index)}
                    >
                      <div className="p-1 bg-gradient-to-r from-pink-400 to-purple-500">
                        <div className="bg-white dark:bg-gray-800 p-2">
                          <Image
                            src={drawing.drawing_data || "/placeholder.svg"}
                            alt="Drawing"
                            width={400}
                            height={300}
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                      <div className="p-3 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(drawing.created_at)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>

      {/* Drawing Preview Modal */}
      <AnimatePresence>
        {selectedDrawing && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawing}
          >
            <motion.div
              className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={closeDrawing}
                  className="bg-white/80 dark:bg-gray-800/80 rounded-full p-2 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 bg-gradient-to-r from-pink-400 to-purple-500">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={selectedDrawing.drawing_data || "/placeholder.svg"}
                      alt="Drawing"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">{formatDate(selectedDrawing.created_at)}</p>
              </div>

              {drawings.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
