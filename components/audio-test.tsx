"use client"

import { useState } from "react"

export function AudioTest() {
  const [status, setStatus] = useState<Record<string, string>>({})

  const testAudio = (src: string) => {
    const audio = new Audio(src)

    audio.addEventListener("canplaythrough", () => {
      setStatus((prev) => ({ ...prev, [src]: "✅ File is accessible" }))
    })

    audio.addEventListener("error", () => {
      setStatus((prev) => ({ ...prev, [src]: `❌ Error: ${audio.error?.message || "Unknown error"}` }))
    })

    // Trigger load
    audio.load()
    setStatus((prev) => ({ ...prev, [src]: "🔄 Testing..." }))
  }

  const audioFiles = [
    "/music/track1.mp3",
    "/music/track2.mp3",
    "/music/track3.mp3",
    "/music/track4.mp3",
    "/music/track5.mp3",
  ]

  return (
    <div className="fixed top-16 right-4 z-50 bg-white dark:bg-[#16213e] p-3 rounded-lg shadow-lg border border-pink-200 dark:border-pink-800/30 max-w-xs">
      <h3 className="text-sm font-bold text-pink-600 dark:text-pink-300 mb-2">Audio File Test</h3>
      <div className="space-y-2">
        {audioFiles.map((file) => (
          <div key={file} className="text-xs">
            <div className="flex justify-between mb-1">
              <span className="truncate mr-2">{file}</span>
              <button
                onClick={() => testAudio(file)}
                className="px-2 py-0.5 bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300 rounded"
              >
                Test
              </button>
            </div>
            {status[file] && <div className="text-xs mt-0.5">{status[file]}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
