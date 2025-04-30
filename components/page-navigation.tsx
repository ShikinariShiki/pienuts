"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

// Define the page order
const pageOrder = ["/", "/profile", "/dni", "/byf", "/favs", "/messages", "/gacha"]

export function PageNavigation() {
  const pathname = usePathname()

  // Find current page index
  const currentIndex = pageOrder.indexOf(pathname)

  // If not in our defined pages, don't show navigation
  if (currentIndex === -1) return null

  // Get prev and next pages
  const prevPage = currentIndex > 0 ? pageOrder[currentIndex - 1] : null
  // If we're on the last page (gacha), next should go back to home
  const nextPage =
    currentIndex < pageOrder.length - 1
      ? pageOrder[currentIndex + 1]
      : currentIndex === pageOrder.length - 1
        ? pageOrder[0]
        : null

  // Get page names for display
  const getPageName = (path: string) => {
    switch (path) {
      case "/":
        return "Home"
      case "/profile":
        return "Profile"
      case "/dni":
        return "DNI"
      case "/byf":
        return "BYF"
      case "/favs":
        return "FAVS"
      case "/messages":
        return "Messages"
      case "/gacha":
        return "Gacha"
      default:
        return "Page"
    }
  }

  return (
    <div className="flex justify-between items-center mt-8 px-4">
      {prevPage ? (
        <Link href={prevPage}>
          <motion.div
            className="flex items-center text-pink-600 dark:text-pink-400 hover:text-pink-400 dark:hover:text-pink-300"
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="text-sm">{getPageName(prevPage)}</span>
          </motion.div>
        </Link>
      ) : (
        <div className="w-20"></div> // Empty space for alignment
      )}

      <div className="flex space-x-1">
        {pageOrder.map((page, index) => (
          <Link href={page} key={page}>
            <div
              className={`w-2 h-2 rounded-full ${
                pathname === page ? "bg-pink-500 dark:bg-pink-400" : "bg-pink-200 dark:bg-[#2d2d42]"
              }`}
            ></div>
          </Link>
        ))}
      </div>

      {nextPage ? (
        <Link href={nextPage}>
          <motion.div
            className="flex items-center text-pink-600 dark:text-pink-400 hover:text-pink-400 dark:hover:text-pink-300"
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm">
              {nextPage === "/" && currentIndex === pageOrder.length - 1 ? "Back to Home" : getPageName(nextPage)}
            </span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </motion.div>
        </Link>
      ) : (
        <div className="w-20"></div> // Empty space for alignment
      )}
    </div>
  )
}
