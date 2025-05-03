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
    { path: "/gacha", label: "Word of The Day", icon: <Gift className="w-5 h-5" /> },
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
            {/* Overlay Background with pink transparent color */}
            <motion.div
              className="fixed inset-0 bg-pink-500/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* Menu Panel with glassmorphism effect - IMPORTANT: changed from inset-0 to top-12 to preserve header */}
            <motion.div
              className="fixed top-12 inset-x-0 bottom-0 bg-white/90 dark:bg-[#16213e]/90 backdrop-blur-md z-40 flex flex-col h-[calc(100vh-3rem)]"
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

              {/* Navigation with scroll */}
              <nav className="flex-grow p-6 overflow-y-auto">
                <ul className="space-y-6">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`flex items-center p-3 rounded-lg transition-colors text-lg ${
                          pathname === item.path
                            ? "bg-pink-100 dark:bg-[#2d2d42] text-pink-700 dark:text-pink-300"
                            : "hover:bg-pink-50 dark:hover:bg-[#1a1a2e] text-gray-600 dark:text-gray-300"
                        }`}
                        onClick={closeMenu}
                      >
                        <span className="mr-4">{item.icon}</span>
                        {item.label}
                        {pathname === item.path && (
                          <motion.div
                            className="ml-auto w-2 h-2 rounded-full bg-pink-400 dark:bg-pink-500"
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
