"use client"

import { motion } from "framer-motion"
import Image from "next/image"

type FoodItem = {
  name: string
  image: string
  description: string
}

const foodItems: FoodItem[] = [
  {
    name: "Mi Goreng",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=300",
    description: "Indonesian fried noodles with a perfect blend of sweet, savory, and spicy flavors.",
  },
  {
    name: "Pizza",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=300",
    description: "Classic comfort food with endless topping possibilities.",
  },
  {
    name: "Dimsum Mentai",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=300",
    description: "Delicate dumplings topped with creamy, spicy mentaiko sauce.",
  },
  {
    name: "Mi Ayam",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=300",
    description: "Indonesian chicken noodles with savory broth and tender chicken pieces.",
  },
  {
    name: "Strawberry Ice Cream",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=300&width=300",
    description: "Sweet, creamy frozen treat with fresh strawberry flavor.",
  },
]

export function FoodGallery() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {foodItems.map((food, index) => (
          <motion.div
            key={food.name}
            className="bg-white dark:bg-[#2d2d42] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
          >
            <div className="relative h-40">
              <Image src={food.image || "/placeholder.svg"} alt={food.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <h3 className="text-white font-bold text-lg p-4">{food.name}</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">{food.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
