"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function SecretGalleryPage() {
  const [drawings, setDrawings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        setLoading(true)

        // Fetch drawings from local API endpoint
        const response = await fetch("/api/get-drawings")
        const data = await response.json()

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
                      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-pink-200 dark:border-pink-900"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
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
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}
