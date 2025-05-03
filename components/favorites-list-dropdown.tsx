"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink } from "lucide-react"
import Image from "next/image"
import { useRef, useEffect } from "react"

// Update the FavoriteAccount type to include imageUrl
type FavoriteAccount = {
  name: string
  handle: string
  url: string
  imageUrl: string
}

// Update the favoriteAccounts array with the correct names and add image URLs
const favoriteAccounts: FavoriteAccount[] = [
  {
    name: "Hime",
    handle: "mizicutie",
    url: "https://x.com/mizicutie",
    imageUrl: "https://pbs.twimg.com/profile_images/1916786102834524160/_u8pvlz4_400x400.jpg",
  },
  {
    name: "Mai",
    handle: "o____orihime",
    url: "https://x.com/o____orihime",
    imageUrl: "https://pbs.twimg.com/profile_images/1918328875269906432/iifZmIXu_400x400.jpg",
  },
  {
    name: "Vy",
    handle: "carloxtta",
    url: "https://x.com/carloxtta",
    imageUrl: "https://pbs.twimg.com/profile_images/1917862870278340608/QJt1dqv8_400x400.png",
  },
  {
    name: "Rey",
    handle: "scaramouje",
    url: "https://x.com/scaramouje",
    imageUrl: "https://pbs.twimg.com/profile_images/1917451352302837764/SQB-VaLM_400x400.png",
  },
  {
    name: "Mizuy",
    handle: "harumiyaw",
    url: "https://x.com/harumiyaw",
    imageUrl: "https://pbs.twimg.com/profile_images/1918542529827655680/_CchUH-z_400x400.png",
  },
  {
    name: "Chevi",
    handle: "akulheetham",
    url: "https://x.com/akulheetham",
    imageUrl: "https://pbs.twimg.com/profile_images/1917863112151302144/miFiu_bo_400x400.png",
  },
  {
    name: "Azriel",
    handle: "suvrtr",
    url: "https://x.com/suvrtr",
    imageUrl: "https://pbs.twimg.com/profile_images/1916427924808568832/aMFPC936_400x400.jpg",
  },
  {
    name: "Azel",
    handle: "casstoriec",
    url: "https://x.com/casstoriec",
    imageUrl: "https://pbs.twimg.com/profile_images/1916821150593949696/omSdFdqi_400x400.png",
  },
  {
    name: "Varta",
    handle: "kalpasz",
    url: "https://x.com/kalpasz",
    imageUrl: "https://pbs.twimg.com/profile_images/1918286831810166786/d_LPa_v7_400x400.png",
  },
  {
    name: "Shirou",
    handle: "elyysiya",
    url: "https://x.com/elyysiya",
    imageUrl: "https://pbs.twimg.com/profile_images/1908147223357198336/ZjlLXW1w_400x400.png",
  },
  {
    name: "Ieri",
    handle: "etcherr1essu",
    url: "https://x.com/etcherr1essu",
    imageUrl: "https://pbs.twimg.com/profile_images/1915995295244292096/oQj03YJk_400x400.jpg",
  },
  {
    name: "Kiel",
    handle: "kiafzuha",
    url: "https://x.com/kiafzuha",
    imageUrl: "https://pbs.twimg.com/profile_images/1918172221287366656/NiMHubR7_400x400.png",
  },
  {
    name: "Fira",
    handle: "muicqro",
    url: "https://x.com/muicqro",
    imageUrl: "https://pbs.twimg.com/profile_images/1918524703297417216/8WQlpCPh_400x400.jpg",
  },
  {
    name: "Kael",
    handle: "nonumuro",
    url: "https://x.com/nonumuro",
    imageUrl: "https://pbs.twimg.com/profile_images/1917943938809495552/O-kBHa-e_400x400.png",
  },
  {
    name: "Miwochi",
    handle: "biyonyam",
    url: "https://x.com/biyonyam",
    imageUrl: "https://pbs.twimg.com/profile_images/1916747854854692864/jV0IUIlG_400x400.jpg",
  },
]

export function FavoritesListDropdown({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 bg-white dark:bg-[#16213e] rounded-xl shadow-lg overflow-hidden border-2 border-pink-200 dark:border-pink-800/30 w-72 z-50"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-br from-pink-100/50 to-transparent dark:from-pink-900/10 pointer-events-none" />

          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-pink-700 dark:text-pink-300">Kesayangan Pien 💖💖</p>
                <p className="text-xs text-pink-500 dark:text-pink-400">My favorite Twitter friends</p>
              </div>

              <motion.button
                className="w-8 h-8 rounded-full flex items-center justify-center bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="max-h-72 overflow-y-auto mt-2">
              <div className="space-y-2">
                {favoriteAccounts.map((account) => (
                  <motion.div
                    key={account.handle}
                    className="bg-pink-50 dark:bg-[#2d2d42] rounded-xl p-3 flex items-center gap-3 hover:bg-pink-100 dark:hover:bg-[#3d3d5a] transition-colors"
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-pink-200 dark:bg-pink-800/30 flex-shrink-0 relative">
                      <Image
                        src={account.imageUrl || "/placeholder.svg"}
                        alt={account.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-grow">
                      <p className="font-medium text-pink-700 dark:text-pink-300 text-sm">{account.name}</p>
                      <p className="text-xs text-pink-500 dark:text-pink-400">@{account.handle}</p>
                    </div>

                    <a
                      href={account.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-pink-400 hover:bg-pink-500 text-white rounded-full p-2 transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
