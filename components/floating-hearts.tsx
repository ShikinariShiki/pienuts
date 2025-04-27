"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; x: number; size: number; delay: number; color: string }[]>([])

  useEffect(() => {
    const newHearts = []
    const colors = ["#ff66a3", "#ff8fab", "#ffb3d1", "#ff4d94", "#ff3385"]

    for (let i = 0; i < 15; i++) {
      newHearts.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 20 + 10,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    setHearts(newHearts)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.x}%`,
            bottom: "-20px",
            color: heart.color,
            fontSize: `${heart.size}px`,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: -500,
            opacity: [0, 1, 0],
            x: heart.x < 50 ? [0, 40, 20, 60] : [0, -40, -20, -60],
          }}
          transition={{
            duration: 3,
            delay: heart.delay,
            ease: "easeOut",
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  )
}
