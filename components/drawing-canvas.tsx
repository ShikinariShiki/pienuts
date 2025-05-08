"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import {
  RefreshCcw,
  Download,
  Undo,
  Redo,
  Circle,
  Square,
  Minus,
  Edit3,
  Eraser,
  Droplet,
  Pen,
  Feather,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { motion } from "framer-motion"

type BrushShape = "round" | "square" | "circle"
type DrawingMode = "pencil" | "brush" | "calligraphy" | "eraser" | "fill" | "shape"
type ShapeType = "rectangle" | "circle" | "triangle" | "heart" | "star"

export function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#ff0000")
  const [lineWidth, setLineWidth] = useState(5)
  const [brushShape, setBrushShape] = useState<BrushShape>("round")
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("pencil")
  const [shapeType, setShapeType] = useState<ShapeType>("rectangle")
  const [shapeSize, setShapeSize] = useState(100) // Size for shapes in pixels
  const [showSaveScreen, setShowSaveScreen] = useState(false)
  const [drawingData, setDrawingData] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canvasInitialized, setCanvasInitialized] = useState(false)
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null)
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null)
  const [showAdvancedTools, setShowAdvancedTools] = useState(false)

  // For undo/redo functionality
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [canvasState, setCanvasState] = useState<ImageData | null>(null)

  const canvasContainerRef = useRef<HTMLDivElement | null>(null)

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

      // Save initial state to history
      saveToHistory()
    }, 100)
  }, [])

  // Save canvas state without text boxes
  const saveCanvasState = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Save the current canvas state (without text boxes)
    setCanvasState(context.getImageData(0, 0, canvas.width, canvas.height))
  }

  // Redraw canvas with all elements
  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // We're assuming the current canvas state (without textboxes) is in the history
    if (history[historyIndex]) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
      }
      img.src = history[historyIndex]
    }
  }

  // Save current canvas state to history
  const saveToHistory = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // First save the canvas state without text boxes
    saveCanvasState()

    // Then get the full state with text boxes
    const currentState = canvas.toDataURL()

    // If we're not at the end of the history, remove everything after current index
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1))
    }

    // Add current state to history
    setHistory((prevHistory) => [...prevHistory, currentState])
    setHistoryIndex((prevIndex) => prevIndex + 1)
  }

  // Undo function
  const handleUndo = () => {
    if (historyIndex <= 0) return // Nothing to undo

    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)

    // Load the previous state
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0)
    }
    img.src = history[newIndex]
  }

  // Redo function
  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return // Nothing to redo

    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)

    // Load the next state
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0)
    }
    img.src = history[newIndex]
  }

  // Update drawing styles when color, line width, or brush shape changes
  useEffect(() => {
    if (!canvasInitialized) return

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Update stroke style
    context.strokeStyle = color
    context.lineWidth = lineWidth

    // Update line cap and join based on brush shape
    switch (brushShape) {
      case "round":
        context.lineCap = "round"
        context.lineJoin = "round"
        break
      case "square":
        context.lineCap = "square"
        context.lineJoin = "miter"
        break
      case "circle":
        // Circle is still "round" in terms of line cap
        context.lineCap = "round"
        context.lineJoin = "round"
        break
    }
  }, [color, lineWidth, brushShape, canvasInitialized])

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
          context.lineCap = brushShape === "square" ? "square" : "round"
          context.lineJoin = brushShape === "square" ? "miter" : "round"
          context.strokeStyle = color
          context.lineWidth = lineWidth
        } catch (error) {
          console.error("Error during canvas resize:", error)
          // If there's an error, just reset the canvas
          canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 800
          canvas.height = 500
          context.fillStyle = "#FFFFFF"
          context.fillRect(0, 0, canvas.width, canvas.height)
          context.lineCap = brushShape === "square" ? "square" : "round"
          context.lineJoin = brushShape === "square" ? "miter" : "round"
          context.strokeStyle = color
          context.lineWidth = lineWidth
        }
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [color, lineWidth, brushShape, canvasInitialized])

  // Special drawing for different brush types
  const drawWithBrush = (context: CanvasRenderingContext2D, x: number, y: number) => {
    if (brushShape === "circle") {
      // Circle brush
      context.beginPath()
      context.arc(x, y, lineWidth / 2, 0, Math.PI * 2)
      context.fillStyle = color
      context.fill()
    } else if (drawingMode === "pencil") {
      // Pencil effect - slightly jittery line
      const jitter = Math.random() * 0.5 - 0.25
      context.lineTo(x + jitter, y + jitter)
      context.stroke()
    } else if (drawingMode === "brush") {
      // Regular brush - smooth line
      context.lineTo(x, y)
      context.stroke()
    } else if (drawingMode === "calligraphy") {
      // Calligraphy - vary line width based on direction
      if (lastPoint) {
        const dx = x - lastPoint.x
        const dy = y - lastPoint.y
        const angle = Math.atan2(dy, dx)

        context.save()
        context.lineWidth = lineWidth * (1 + Math.abs(Math.sin(angle * 2)))
        context.lineTo(x, y)
        context.stroke()
        context.restore()
      } else {
        context.lineTo(x, y)
        context.stroke()
      }
      setLastPoint({ x, y })
    }
  }

  // Fill function
  const fillArea = (startX: number, startY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height

    // Get the color at the clicked position
    const targetColor = getColorAt(imageData, startX, startY)

    // Convert the new color to RGBA
    const fillColor = hexToRgba(color)

    // If target color is the same as fill color, no need to fill
    if (colorsEqual(targetColor, fillColor)) return

    // Stack for flood fill algorithm
    const stack: [number, number][] = [[startX, startY]]
    const visited = new Set<string>()

    while (stack.length > 0) {
      const [x, y] = stack.pop()!
      const key = `${x},${y}`

      if (visited.has(key)) continue
      visited.add(key)

      const index = (y * width + x) * 4

      // Check if this pixel has the target color
      if (!colorsEqual([data[index], data[index + 1], data[index + 2], data[index + 3]], targetColor)) continue

      // Set the new color
      data[index] = fillColor[0]
      data[index + 1] = fillColor[1]
      data[index + 2] = fillColor[2]
      data[index + 3] = fillColor[3]

      // Add adjacent pixels to stack
      if (x > 0) stack.push([x - 1, y])
      if (x < width - 1) stack.push([x + 1, y])
      if (y > 0) stack.push([x, y - 1])
      if (y < height - 1) stack.push([x, y + 1])
    }

    context.putImageData(imageData, 0, 0)
    saveToHistory()
  }

  // Helper function to get color at a specific position
  const getColorAt = (imageData: ImageData, x: number, y: number): [number, number, number, number] => {
    const index = (y * imageData.width + x) * 4
    return [imageData.data[index], imageData.data[index + 1], imageData.data[index + 2], imageData.data[index + 3]]
  }

  // Helper function to compare colors
  const colorsEqual = (color1: [number, number, number, number], color2: [number, number, number, number]): boolean => {
    return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2] && color1[3] === color2[3]
  }

  // Helper function to convert hex to rgba
  const hexToRgba = (hex: string): [number, number, number, number] => {
    const r = Number.parseInt(hex.slice(1, 3), 16)
    const g = Number.parseInt(hex.slice(3, 5), 16)
    const b = Number.parseInt(hex.slice(5, 7), 16)
    return [r, g, b, 255]
  }

  // Draw shape function
  const drawShape = (context: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) => {
    context.beginPath()

    // Calculate width and height based on start and end points
    const width = Math.abs(endX - startX)
    const height = Math.abs(endY - startY)

    // Use shapeSize for fixed-size shapes if not dragging
    const useWidth = isDrawing ? width : shapeSize
    const useHeight = isDrawing ? height : shapeSize

    switch (shapeType) {
      case "rectangle":
        context.rect(startX, startY, endX - startX, endY - startY)
        break
      case "circle":
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
        context.arc(startX, startY, isDrawing ? radius : shapeSize / 2, 0, Math.PI * 2)
        break
      case "triangle":
        context.moveTo(startX, startY)
        context.lineTo(endX, endY)
        context.lineTo(startX - (endX - startX), endY)
        context.closePath()
        break
      case "heart":
        // Heart shape
        const topCurveHeight = useHeight * 0.3

        // Start at the bottom point of the heart
        context.moveTo(startX, startY + useHeight)

        // Left curve
        context.bezierCurveTo(
          startX - useWidth / 2,
          startY + useHeight * 0.7, // Control point 1
          startX - useWidth / 2,
          startY, // Control point 2
          startX,
          startY + topCurveHeight, // End point
        )

        // Right curve
        context.bezierCurveTo(
          startX + useWidth / 2,
          startY, // Control point 1
          startX + useWidth / 2,
          startY + useHeight * 0.7, // Control point 2
          startX,
          startY + useHeight, // End point
        )
        break
      case "star":
        // Star shape with 5 points
        const outerRadius = isDrawing ? Math.min(width, height) / 2 : shapeSize / 2
        const innerRadius = outerRadius / 2.5

        // Draw a 5-pointed star
        for (let i = 0; i < 10; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2
          const x = startX + radius * Math.cos(angle)
          const y = startY + radius * Math.sin(angle)

          if (i === 0) {
            context.moveTo(x, y)
          } else {
            context.lineTo(x, y)
          }
        }
        context.closePath()
        break
    }

    context.stroke()
    if (drawingMode === "shape") {
      context.fillStyle = color
      context.fill()
    }
  }

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

    if (drawingMode === "fill") {
      fillArea(Math.floor(x), Math.floor(y))
      return
    }

    if (drawingMode === "shape") {
      setShapeStart({ x, y })
      setIsDrawing(true)
      return
    }

    setIsDrawing(true)
    setLastPoint({ x, y })

    if (drawingMode === "pencil" || drawingMode === "brush" || drawingMode === "calligraphy") {
      context.beginPath()
      context.moveTo(x, y)

      if (drawingMode === "brush" && brushShape === "circle") {
        // For circle brush, just draw a single circle at the start point
        drawWithBrush(context, x, y)
      }
    } else if (drawingMode === "eraser") {
      context.save()
      context.beginPath()
      context.globalCompositeOperation = "destination-out"
      context.arc(x, y, lineWidth, 0, Math.PI * 2)
      context.fill()
      context.restore()
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (!isDrawing) return

    if (drawingMode === "shape" && shapeStart) {
      // For shape drawing, we need to redraw the canvas from history to avoid multiple shapes
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
        drawShape(context, shapeStart.x, shapeStart.y, x, y)
      }
      img.src = history[historyIndex]
      return
    }

    if (drawingMode === "pencil" || drawingMode === "brush" || drawingMode === "calligraphy") {
      drawWithBrush(context, x, y)
    } else if (drawingMode === "eraser") {
      context.save()
      context.globalCompositeOperation = "destination-out"
      context.arc(x, y, lineWidth, 0, Math.PI * 2)
      context.fill()
      context.restore()
    }
  }

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (drawingMode === "shape" && shapeStart) {
      // Draw the final shape
      drawShape(context, shapeStart.x, shapeStart.y, x, y)
      setShapeStart(null)
      setIsDrawing(false)
      saveToHistory()
      return
    }

    context.closePath()
    setIsDrawing(false)
    setLastPoint(null)

    // Save state to history after drawing is complete
    saveToHistory()
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

    if (drawingMode === "fill") {
      fillArea(Math.floor(x), Math.floor(y))
      return
    }

    if (drawingMode === "shape") {
      setShapeStart({ x, y })
      setIsDrawing(true)
      return
    }

    setIsDrawing(true)
    setLastPoint({ x, y })

    if (drawingMode === "pencil" || drawingMode === "brush" || drawingMode === "calligraphy") {
      context.beginPath()
      context.moveTo(x, y)

      if (drawingMode === "brush" && brushShape === "circle") {
        // For circle brush, just draw a single circle at the start point
        drawWithBrush(context, x, y)
      }
    } else if (drawingMode === "eraser") {
      context.save()
      context.beginPath()
      context.globalCompositeOperation = "destination-out"
      context.arc(x, y, lineWidth, 0, Math.PI * 2)
      context.fill()
      context.restore()
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault() // Prevent scrolling
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    if (!isDrawing) return

    if (drawingMode === "shape" && shapeStart) {
      // For shape drawing, we need to redraw the canvas from history to avoid multiple shapes
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
        drawShape(context, shapeStart.x, shapeStart.y, x, y)
      }
      img.src = history[historyIndex]
      return
    }

    if (drawingMode === "pencil" || drawingMode === "brush" || drawingMode === "calligraphy") {
      drawWithBrush(context, x, y)
    } else if (drawingMode === "eraser") {
      context.save()
      context.globalCompositeOperation = "destination-out"
      context.arc(x, y, lineWidth, 0, Math.PI * 2)
      context.fill()
      context.restore()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault() // Prevent scrolling

    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Get the last touch position
    const rect = canvas.getBoundingClientRect()
    const touch = e.changedTouches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    if (drawingMode === "shape" && shapeStart) {
      // Draw the final shape
      drawShape(context, shapeStart.x, shapeStart.y, x, y)
      setShapeStart(null)
      setIsDrawing(false)
      saveToHistory()
      return
    }

    context.closePath()
    setIsDrawing(false)
    setLastPoint(null)

    // Save state to history after drawing is complete
    saveToHistory()
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

    // Save the cleared state to history
    saveToHistory()
  }

  // Send drawing
  const handleSend = async () => {
    if (!canvasRef.current) return

    // Small delay to ensure textboxes are drawn
    setTimeout(async () => {
      setIsSaving(true)
      setError(null)

      try {
        // Save the drawing data
        const imgData = canvasRef.current!.toDataURL("image/png")
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
    }, 100)
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
      {/* Mobile-friendly toolbar */}
      <div className="bg-white p-3 rounded-t-xl border-2 border-pink-500">
        {/* Primary tools row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.button
              onClick={clearCanvas}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Clear"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RefreshCcw size={20} className="text-pink-500" />
            </motion.button>

            <motion.button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${historyIndex <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label="Undo"
              whileHover={historyIndex > 0 ? { scale: 1.1 } : {}}
              whileTap={historyIndex > 0 ? { scale: 0.9 } : {}}
            >
              <Undo size={20} className="text-pink-500" />
            </motion.button>

            <motion.button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${historyIndex >= history.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label="Redo"
              whileHover={historyIndex < history.length - 1 ? { scale: 1.1 } : {}}
              whileTap={historyIndex < history.length - 1 ? { scale: 0.9 } : {}}
            >
              <Redo size={20} className="text-pink-500" />
            </motion.button>
          </div>

          {/* Color picker and size */}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-none"
            />

            <motion.button
              onClick={() => setShowAdvancedTools(!showAdvancedTools)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showAdvancedTools ? (
                <ChevronUp size={20} className="text-pink-500" />
              ) : (
                <ChevronDown size={20} className="text-pink-500" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Drawing tools row */}
        <div className="flex flex-wrap items-center justify-center gap-1 mb-2">
          <motion.button
            onClick={() => setDrawingMode("pencil")}
            className={`p-2 rounded-full transition-colors ${
              drawingMode === "pencil" ? "bg-pink-100 text-pink-600" : "hover:bg-gray-100 text-gray-600"
            }`}
            aria-label="Pencil Mode"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Pen size={20} />
          </motion.button>

          <motion.button
            onClick={() => setDrawingMode("brush")}
            className={`p-2 rounded-full transition-colors ${
              drawingMode === "brush" ? "bg-pink-100 text-pink-600" : "hover:bg-gray-100 text-gray-600"
            }`}
            aria-label="Brush Mode"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit3 size={20} />
          </motion.button>

          <motion.button
            onClick={() => setDrawingMode("calligraphy")}
            className={`p-2 rounded-full transition-colors ${
              drawingMode === "calligraphy" ? "bg-pink-100 text-pink-600" : "hover:bg-gray-100 text-gray-600"
            }`}
            aria-label="Calligraphy Mode"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Feather size={20} />
          </motion.button>

          <motion.button
            onClick={() => setDrawingMode("eraser")}
            className={`p-2 rounded-full transition-colors ${
              drawingMode === "eraser" ? "bg-pink-100 text-pink-600" : "hover:bg-gray-100 text-gray-600"
            }`}
            aria-label="Eraser Mode"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Eraser size={20} />
          </motion.button>

          <motion.button
            onClick={() => setDrawingMode("fill")}
            className={`p-2 rounded-full transition-colors ${
              drawingMode === "fill" ? "bg-pink-100 text-pink-600" : "hover:bg-gray-100 text-gray-600"
            }`}
            aria-label="Fill Mode"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Droplet size={20} />
          </motion.button>

          <motion.button
            onClick={() => setDrawingMode("shape")}
            className={`p-2 rounded-full transition-colors ${
              drawingMode === "shape" ? "bg-pink-100 text-pink-600" : "hover:bg-gray-100 text-gray-600"
            }`}
            aria-label="Shape Mode"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Square size={20} />
          </motion.button>
        </div>

        {/* Advanced tools (collapsible) */}
        {showAdvancedTools && (
          <div className="pt-2 border-t border-gray-200">
            {/* Brush size slider */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number.parseInt(e.target.value))}
                className="w-full max-w-[200px] accent-pink-500 mx-2"
              />
              <div
                className="rounded-full bg-pink-500"
                style={{ width: `${lineWidth}px`, height: `${lineWidth}px` }}
              ></div>
            </div>

            {/* Shape type selector (when in shape mode) */}
            {drawingMode === "shape" && (
              <div className="flex flex-wrap items-center justify-center gap-1 mb-2">
                <motion.button
                  onClick={() => setShapeType("rectangle")}
                  className={`p-1 rounded-full ${shapeType === "rectangle" ? "bg-pink-100 shadow-sm" : ""}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Square size={18} className="text-pink-500" />
                </motion.button>

                <motion.button
                  onClick={() => setShapeType("circle")}
                  className={`p-1 rounded-full ${shapeType === "circle" ? "bg-pink-100 shadow-sm" : ""}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Circle size={18} className="text-pink-500" />
                </motion.button>

                <motion.button
                  onClick={() => setShapeType("triangle")}
                  className={`p-1 rounded-full ${shapeType === "triangle" ? "bg-pink-100 shadow-sm" : ""}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 3L22 21H2L12 3Z"
                      stroke="#ec4899"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>

                <motion.button
                  onClick={() => setShapeType("heart")}
                  className={`p-1 rounded-full ${shapeType === "heart" ? "bg-pink-100 shadow-sm" : ""}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      stroke="#ec4899"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>

                <motion.button
                  onClick={() => setShapeType("star")}
                  className={`p-1 rounded-full ${shapeType === "star" ? "bg-pink-100 shadow-sm" : ""}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      stroke="#ec4899"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
              </div>
            )}

            {/* Brush shape selector (when in brush/pencil mode) */}
            {(drawingMode === "brush" || drawingMode === "pencil") && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <motion.button
                  onClick={() => setBrushShape("round")}
                  className={`p-1 rounded-full ${brushShape === "round" ? "bg-pink-100 shadow-sm" : ""}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus size={18} className="text-pink-500" />
                </motion.button>

                <motion.button
                  onClick={() => setBrushShape("square")}
                  className={`p-1 rounded-full ${brushShape === "square" ? "bg-pink-100 shadow-sm" : ""}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Square size={18} className="text-pink-500" />
                </motion.button>

                <motion.button
                  onClick={() => setBrushShape("circle")}
                  className={`p-1 rounded-full ${brushShape === "circle" ? "bg-pink-100 shadow-sm" : ""}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Circle size={18} className="text-pink-500" />
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        ref={canvasContainerRef}
        className="border-l-2 border-r-2 border-pink-500 bg-white w-full h-[500px] relative"
      >
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
          style={{
            touchAction: "none",
            cursor: drawingMode === "fill" ? "crosshair" : "crosshair",
          }}
        />
      </div>

      <div className="flex items-center justify-center bg-white p-4 rounded-b-xl border-2 border-t-0 border-pink-500">
        <motion.button
          onClick={handleSend}
          disabled={isSaving}
          className="bg-white hover:bg-pink-500 text-pink-500 hover:text-white font-medium text-lg flex items-center justify-center gap-2 py-3 px-6 rounded-xl shadow-md border-2 border-pink-500 w-full transition-colors duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSaving ? (
            <>
              <span className="animate-spin h-5 w-5 border-2 border-pink-500 border-t-transparent rounded-full mr-2"></span>
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
