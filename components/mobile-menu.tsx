"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MobileMenuProps {
  pages: {
    path: string
    label: string
    icon: React.ReactNode
  }[]
}

export function MobileMenu({ pages }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="md:hidden">
      <motion.button
        className="p-1.5 rounded-full hover:bg-pink-100 dark:hover:bg-[#2d2d42] text-pink-600 dark:text-pink-400"
        onClick={toggleMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Menu"
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-pink-50/95 dark:bg-[#16213e]/95 backdrop-blur-sm flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-end p-4">
              <motion.button
                className="p-2 rounded-full bg-white dark:bg-[#2d2d42] text-pink-600 dark:text-pink-400 shadow-md"
                onClick={toggleMenu}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4 overflow-y-auto max-h-[80vh]">
              {pages.map((page, index) => (
                <motion.div
                  key={page.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full"
                >
                  <Link href={page.path} onClick={toggleMenu}>
                    <motion.div
                      className={`flex items-center gap-3 p-4 rounded-xl ${
                        pathname === page.path
                          ? "bg-pink-200 dark:bg-pink-800/30 text-pink-700 dark:text-pink-300"
                          : "bg-white dark:bg-[#2d2d42] text-gray-700 dark:text-gray-300"
                      } shadow-sm`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          pathname === page.path
                            ? "bg-pink-300 dark:bg-pink-700 text-white"
                            : "bg-pink-100 dark:bg-[#3d3d5a] text-pink-500 dark:text-pink-400"
                        }`}
                      >
                        {page.icon}
                      </div>
                      <span className="font-medium">{page.label}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
