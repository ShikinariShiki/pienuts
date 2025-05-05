"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { RefreshCcw, Download } from "lucide-react"
import { motion } from "framer-motion"

export function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#ff0000")
  const [lineWidth, setLineWidth] = useState(5)
  const [showSaveScreen, setShowSaveScreen] = useState(false)
  const [drawingData, setDrawingData] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canvasInitialized, setCanvasInitialized] = useState(false)

  // Initialize canvas when component mounts
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Wait for the canvas to be properly sized by the browser
    setTimeout(() => {
      const context = canvas.getContext("2d")
      if (!context) return

      // Set canvas size explicitly based on container size
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = 500 // Fixed height
      } else {
        // Fallback sizes if no parent container
        canvas.width = 800
        canvas.height = 500
      }

      // Fill with white background
      context.fillStyle = "#FFFFFF"
      context.fillRect(0, 0, canvas.width, canvas.height)

      // Set initial drawing styles
      context.lineCap = "round"
      context.lineJoin = "round"
      context.strokeStyle = color
      context.lineWidth = lineWidth

      setCanvasInitialized(true)
    }, 100)
  }, [])

  // Update drawing styles when color or line width changes WITHOUT clearing canvas
  useEffect(() => {
    if (!canvasInitialized) return

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Just update the style properties without clearing
    context.strokeStyle = color
    context.lineWidth = lineWidth
  }, [color, lineWidth, canvasInitialized])

  // Handle window resize safely
  useEffect(() => {
    if (!canvasInitialized) return

    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext("2d")
      if (!context) return

      // Only proceed if canvas has valid dimensions
      if (canvas.width > 0 && canvas.height > 0) {
        try {
          // Save current drawing
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

          // Get new dimensions
          const container = canvas.parentElement
          const newWidth = container ? container.clientWidth : 800
          const newHeight = 500 // Keep fixed height

          // Resize canvas
          canvas.width = newWidth
          canvas.height = newHeight

          // Fill with white background
          context.fillStyle = "#FFFFFF"
          context.fillRect(0, 0, canvas.width, canvas.height)

          // Restore drawing
          context.putImageData(imageData, 0, 0)

          // Reset context properties (they get reset after resize)
          context.lineCap = "round"
          context.lineJoin = "round"
          context.strokeStyle = color
          context.lineWidth = lineWidth
        } catch (error) {
          console.error("Error during canvas resize:", error)
          // If there's an error, just reset the canvas
          canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 800
          canvas.height = 500
          context.fillStyle = "#FFFFFF"
          context.fillRect(0, 0, canvas.width, canvas.height)
          context.lineCap = "round"
          context.lineJoin = "round"
          context.strokeStyle = color
          context.lineWidth = lineWidth
        }
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [color, lineWidth, canvasInitialized])

  // Mouse event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Start new path at mouse position
    context.beginPath()
    context.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Draw line to new mouse position
    context.lineTo(x, y)
    context.stroke()
  }

  const stopDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    context.closePath()
    setIsDrawing(false)
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault() // Prevent scrolling
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    context.beginPath()
    context.moveTo(x, y)
    setIsDrawing(true)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault() // Prevent scrolling
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    context.lineTo(x, y)
    context.stroke()
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault() // Prevent scrolling
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    context.closePath()
    setIsDrawing(false)
  }

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Fill with white background
    context.fillStyle = "#FFFFFF"
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  // Send drawing
  const handleSend = async () => {
    if (!canvasRef.current) return

    setIsSaving(true)
    setError(null)

    try {
      // Save the drawing data
      const imgData = canvasRef.current.toDataURL("image/png")
      setDrawingData(imgData)

      // Try to save to database
      const formData = new FormData()
      formData.append("drawingData", imgData)

      // Send to API
      try {
        const response = await fetch("/api/save-drawing", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (!result.success) {
          console.error("Error saving drawing:", result.error)
          setError(result.error || "Failed to save drawing to gallery")
        }
      } catch (err) {
        console.error("Network error:", err)
        setError(err instanceof Error ? err.message : "Network error when saving drawing")
      }

      // Show success screen regardless of backend success
      setShowSaveScreen(true)
    } catch (error) {
      console.error("Error saving drawing:", error)
      setError(error instanceof Error ? error.message : "Failed to save drawing")
      // We still show the success screen to the user
      setShowSaveScreen(true)
    } finally {
      setIsSaving(false)
    }
  }

  // Download drawing
  const handleDownload = () => {
    if (!drawingData) return

    const link = document.createElement("a")
    link.href = drawingData
    link.download = "my-drawing.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Reset drawing
  const handleReset = () => {
    clearCanvas()
    setShowSaveScreen(false)
    setDrawingData(null)
    setError(null)
  }

  if (showSaveScreen) {
    return (
      <div className="flex flex-col w-full">
        <div className="bg-pink-600 w-full h-[500px] flex flex-col items-center justify-center relative rounded-t-xl">
          {drawingData && (
            <img
              src={drawingData || "/placeholder.svg"}
              alt="Your drawing"
              className="absolute top-0 left-0 w-full h-full object-contain opacity-80"
            />
          )}
          <motion.button
            onClick={handleDownload}
            className="bg-white text-pink-600 font-bold py-4 px-8 rounded-xl text-xl mb-4 cursor-pointer hover:bg-gray-100 shadow-lg flex items-center gap-2 z-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-6 h-6" />
            save your drawing!
          </motion.button>
        </div>
        <div className="flex items-center justify-center bg-white p-4 rounded-b-xl border-2 border-t-0 border-pink-500">
          <div className="text-pink-500 font-medium text-lg flex items-center gap-2">
            Sent!{" "}
            <span role="img" aria-label="artist" className="text-xl">
              👨‍🎨
            </span>
          </div>
        </div>
        {error && (
          <div className="mt-2 text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
            <p>Note: There was an issue saving to the gallery, but your drawing is still available to download.</p>
            <p className="text-xs mt-1">Error: {error}</p>
            <p className="text-xs mt-1">Please make sure the drawings table exists in your Supabase database.</p>
          </div>
        )}
        <motion.button
          onClick={handleReset}
          className="mt-4 text-pink-500 underline text-sm mx-auto"
          whileHover={{ scale: 1.05 }}
        >
          Draw another
        </motion.button>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between bg-white p-3 rounded-t-xl border-2 border-pink-500">
        <motion.button
          onClick={clearCanvas}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Clear"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <RefreshCcw size={20} className="text-pink-500" />
        </motion.button>

        <div className="flex items-center gap-2">
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number.parseInt(e.target.value))}
            className="w-24 accent-pink-500"
          />
          <div className="rounded-full bg-pink-500" style={{ width: `${lineWidth}px`, height: `${lineWidth}px` }}></div>

          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-none"
          />
        </div>
      </div>

      <div className="border-l-2 border-r-2 border-pink-500 bg-white w-full h-[500px]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full"
          style={{ touchAction: "none", cursor: "crosshair" }}
        />
      </div>

      <div className="flex items-center justify-center bg-white p-4 rounded-b-xl border-2 border-t-0 border-pink-500">
        <motion.button
          onClick={handleSend}
          disabled={isSaving}
          className="bg-pink-500 hover:bg-pink-600 text-white font-medium text-lg flex items-center gap-2 py-3 px-6 rounded-xl shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSaving ? (
            <>
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Sending...
            </>
          ) : (
            <>
              Send anonymously
              <span role="img" aria-label="palette" className="text-xl">
                🎨
              </span>
              <span role="img" aria-label="emoji" className="text-xl">
                😊
              </span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}
