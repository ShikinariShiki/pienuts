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
    name: "Fried Noodle",
    image:
      "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/food/mi%20goreng-bay2vsjuepDb8cbTZ1hcFV8FcPziDS.png?height=300&width=300",
    description: "Indonesian fried noodles with a perfect blend of sweet, savory, and spicy flavors.",
  },
  {
    name: "Pizza",
    image:
      "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/food/pizza-lV9Cr1nKYPje4xyzO6LpcSzTdi55jv.png?height=300&width=300",
    description: "Classic comfort food with endless topping possibilities.",
  },
  {
    name: "Dimsum Mentai",
    image:
      "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/food/mentai-CtVw2qk8iqRhXTtzvzeCc4ktdJlswK.jpg?height=300&width=300",
    description: "Delicate dumplings topped with creamy, spicy mentaiko sauce.",
  },
  {
    name: "Mi Ayam",
    image:
      "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/food/mi%20ayam-bWwb64tY8ZMfKkcTZxkmm8OCM5vyPA.png?height=300&width=300",
    description: "Indonesian chicken noodles with savory broth and tender chicken pieces.",
  },
  {
    name: "Strawberry Ice Cream",
    image:
      "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/food/strawberry%20eskrim-1Y3lcoZBf1Dbvy3mvJm3YF29OCGylj.png?height=300&width=300",
    description: "Sweet, creamy frozen treat with fresh strawberry flavor.",
  },
  {
    name: "Japanese Curry",
    image:
      "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/food/curry-d66Gha3A3PufE1evT6Q6tHiXNAL58x.png?height=300&width=300",
    description: "Thick, savory curry combined with warm, delicate white rice with various condiments.",
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
