"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, User, Heart, Star, MessageSquare, Gift } from "lucide-react"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Menu items
  const menuItems = [
    { path: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { path: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { path: "/dni", label: "DNI", icon: <X className="w-5 h-5" /> },
    { path: "/byf", label: "BYF", icon: <Heart className="w-5 h-5" /> },
    { path: "/favs", label: "FAVS", icon: <Star className="w-5 h-5" /> },
    { path: "/messages", label: "Messages", icon: <MessageSquare className="w-5 h-5" /> },
    { path: "/gacha", label: "Daily Gacha", icon: <Gift className="w-5 h-5" /> },
  ]

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="md:hidden p-2 text-pink-600 dark:text-pink-400 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay Background */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* Menu Panel - Changed to left side */}
            <motion.div
              className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-[#16213e] z-50 shadow-lg flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-pink-200 dark:border-pink-800/30 flex-shrink-0">
                <span className="text-pink-600 dark:text-pink-400 font-bold text-lg">
                  pien<span className="text-pink-400 dark:text-pink-300">!</span>
                </span>
                <button
                  className="p-1 text-pink-600 dark:text-pink-400 focus:outline-none"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-grow overflow-y-auto p-4">
                <ul className="space-y-3">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`flex items-center p-2 rounded-lg transition-colors ${
                          pathname === item.path
                            ? "bg-pink-100 dark:bg-[#2d2d42] text-pink-700 dark:text-pink-300"
                            : "hover:bg-pink-50 dark:hover:bg-[#1a1a2e] text-gray-600 dark:text-gray-300"
                        }`}
                        onClick={closeMenu}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                        {pathname === item.path && (
                          <motion.div
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-400 dark:bg-pink-500"
                            layoutId="activeMenuIndicator"
                          />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
