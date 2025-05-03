"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { fetchDniData } from "@/lib/api" // Assuming this is still needed, though not used in the provided snippet for DNI content itself
import { LoadingSpinner } from "@/components/loading-spinner"
import { PageNavigation } from "@/components/page-navigation"

// List of DNI criteria
const dniItems = [
  "Basic DNI",
  "02 Voter/Supporter",
  "Problematic",
  "Zionist",
  "Hate my favs",
  "Homophobic",
  "Racist",
  "Heavy ladstwt",
  "Can't separate between fiction & reality",
  "Under 13 y.o", 
  "Can't respect others"
];

export default function DniPage() {
  // Note: The fetchDniData logic seems unrelated to the hardcoded DNI list.
  // If fetchDniData *should* provide the DNI list, you'll need to integrate that data.
  // For now, I'm keeping the fetch logic as it was but using the hardcoded list you provided.
  const [dniData, setDniData] = useState<any>(null) // This state seems unused for the DNI list itself now
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        // Simulating a data fetch or setup delay, remove if fetchDniData is actually used for something else critical
        // If fetchDniData IS meant to load the DNI list, replace the hardcoded 'dniItems' array processing
        await new Promise(resolve => setTimeout(resolve, 500)); // Example delay
        // const data = await fetchDniData(); // Uncomment if you fetch data relevant elsewhere
        // setDniData(data); // Uncomment if you set fetched data
        setError(null)
      } catch (err) {
        setError("Failed to load page data. Please try again!") // Adjusted error message slightly
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

  // Calculate delay for the "Important Note" based on the number of DNI items
  const noteDelay = 0.5 + dniItems.length * 0.1 + 0.1; // Start after list items finish animating

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
          DNI<span className="text-pink-400">!</span>
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
            Do Not Interact<span className="text-pink-400 dark:text-pink-200">!</span>
          </h2>

          <p className="text-pink-600 dark:text-pink-400 mb-4">
            Please do not interact with me if you fall into any of these categories:
          </p>

          {/* Updated list using map */}
          <ul className="list-disc pl-6 space-y-2 text-pink-600 dark:text-pink-400">
            {dniItems.map((item, index) => (
              <motion.li
                key={item} // Using item text as key (ensure uniqueness)
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }} // Staggered delay calculation
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="bg-pink-50 dark:bg-[#2d2d42] p-6 rounded-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: noteDelay }} // Adjusted delay to start after the list animation
        >
          <h2 className="text-xl font-bold text-pink-700 dark:text-pink-300 mb-4">
            Important Note<span className="text-pink-400 dark:text-pink-200">!</span>
          </h2>

          <p className="text-pink-600 dark:text-pink-400">
            This is just for my personal boundaries. If you respect these boundaries, we can be friends! (◕‿◕✿)
          </p>
        </motion.div>
        <PageNavigation />
      </motion.div>
    </div>
  )
}
