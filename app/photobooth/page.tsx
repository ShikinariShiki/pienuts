"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Camera, Download, RefreshCw, ImageIcon } from "lucide-react"

// Filter types
type Filter = {
  name: string
  class: string
}

// Frame types
type Frame = {
  name: string
  src: string
}

export default function PhotoboothPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string>("none")
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null)

  // Available filters
  const filters: Filter[] = [
    { name: "None", class: "none" },
    { name: "Grayscale", class: "grayscale" },
    { name: "Sepia", class: "sepia" },
    { name: "Blur", class: "blur-sm" },
    { name: "Vintage", class: "brightness-90 contrast-125 sepia-[0.15]" },
    { name: "Pink", class: "hue-rotate-[340deg] saturate-150" },
    { name: "Kawaii", class: "brightness-105 contrast-95 saturate-125" },
  ]

  // Available frames
  const frames: Frame[] = [
    { name: "Hearts", src: "/images/frame-hearts.png" },
    { name: "Stars", src: "/images/frame-stars.png" },
    { name: "Kawaii", src: "/images/frame-kawaii.png" },
    { name: "Cute", src: "/images/frame-cute.png" },
  ]

  useEffect(() => {
    // Initialize camera
    const startCamera = async () => {
      setIsLoading(true)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 720, height: 1280 },
          audio: false,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        setCameraError("Could not access camera. Please check permissions.")
        setIsLoading(false)
      }
    }

    startCamera()

    // Cleanup function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video aspect ratio (vertical)
    const width = video.videoWidth
    const height = video.videoHeight
    canvas.width = width
    canvas.height = height

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, width, height)

    // Apply selected filter effect (will be done via CSS classes on the canvas)

    setHasPhoto(true)
  }

  const retakePhoto = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height)
    setHasPhoto(false)
  }

  const downloadPhoto = () => {
    if (!canvasRef.current) return

    // Create a new canvas for the final image with frame
    const finalCanvas = document.createElement("canvas")
    const finalContext = finalCanvas.getContext("2d")

    if (!finalContext) return

    const canvas = canvasRef.current

    // Set dimensions
    finalCanvas.width = canvas.width
    finalCanvas.height = canvas.height

    // Draw the photo
    finalContext.drawImage(canvas, 0, 0)

    // Draw the frame if selected
    if (selectedFrame) {
      const frameImg = new Image()
      frameImg.crossOrigin = "anonymous"
      frameImg.onload = () => {
        finalContext.drawImage(frameImg, 0, 0, finalCanvas.width, finalCanvas.height)

        // Convert to data URL and trigger download
        const dataUrl = finalCanvas.toDataURL("image/jpeg", 0.8)
        const link = document.createElement("a")
        link.download = `kawaii-photo-${new Date().getTime()}.jpg`
        link.href = dataUrl
        link.click()
      }

      // Set frame source - in a real app, use actual frame images
      const frameSrc = frames.find((f) => f.name === selectedFrame)?.src || "/images/frame-hearts.png"
      frameImg.src = frameSrc
    } else {
      // No frame, just download the photo
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
      const link = document.createElement("a")
      link.download = `kawaii-photo-${new Date().getTime()}.jpg`
      link.href = dataUrl
      link.click()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-8">
      <motion.div
        className="card w-full max-w-md p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <motion.h1
          className="text-3xl font-bold text-pink-600 dark:text-pink-300 mb-6 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          Virtual Photobooth<span className="text-pink-400">!</span>
        </motion.h1>

        <motion.div
          className="divider mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3 }}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : cameraError ? (
          <div className="bg-pink-50 dark:bg-[#2d2d42] p-6 rounded-xl text-center">
            <p className="text-pink-600 dark:text-pink-300 mb-4">{cameraError}</p>
            <button
              className="button px-4 py-2 text-pink-600 dark:text-pink-300 font-medium"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="relative w-full aspect-[9/16] bg-black rounded-xl overflow-hidden mb-4">
              {!hasPhoto ? (
                <video
                  ref={videoRef}
                  className={`absolute inset-0 w-full h-full object-cover ${selectedFilter !== "none" ? filters.find((f) => f.name.toLowerCase() === selectedFilter)?.class : ""}`}
                  playsInline
                  muted
                />
              ) : (
                <canvas
                  ref={canvasRef}
                  className={`absolute inset-0 w-full h-full object-cover ${selectedFilter !== "none" ? filters.find((f) => f.name.toLowerCase() === selectedFilter)?.class : ""}`}
                />
              )}

              {/* Frame overlay */}
              {selectedFrame && (
                <div className="absolute inset-0 pointer-events-none">
                  <img
                    src={frames.find((f) => f.name === selectedFrame)?.src || "/images/frame-hearts.png"}
                    alt="Frame"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              {!hasPhoto ? (
                <motion.button
                  className="button px-6 py-3 text-pink-600 dark:text-pink-300 font-medium flex items-center space-x-2"
                  onClick={takePhoto}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  <span>Take Photo</span>
                </motion.button>
              ) : (
                <>
                  <motion.button
                    className="button px-4 py-2 text-pink-600 dark:text-pink-300 font-medium flex items-center"
                    onClick={retakePhoto}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    <span>Retake</span>
                  </motion.button>

                  <motion.button
                    className="button px-4 py-2 text-pink-600 dark:text-pink-300 font-medium flex items-center"
                    onClick={downloadPhoto}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Save</span>
                  </motion.button>
                </>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-pink-600 dark:text-pink-300 mb-2">Filters</h3>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <motion.button
                    key={filter.name}
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedFilter === filter.name.toLowerCase()
                        ? "bg-pink-400 text-white"
                        : "bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300"
                    }`}
                    onClick={() => setSelectedFilter(filter.name.toLowerCase())}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filter.name}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-pink-600 dark:text-pink-300 mb-2">Frames</h3>
              <div className="grid grid-cols-4 gap-2">
                <motion.button
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedFrame === null ? "border-pink-400" : "border-transparent"
                  }`}
                  onClick={() => setSelectedFrame(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-full h-full flex items-center justify-center bg-pink-100 dark:bg-[#2d2d42]">
                    <ImageIcon className="w-6 h-6 text-pink-400" />
                  </div>
                </motion.button>

                {frames.map((frame) => (
                  <motion.button
                    key={frame.name}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedFrame === frame.name ? "border-pink-400" : "border-transparent"
                    }`}
                    onClick={() => setSelectedFrame(frame.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={frame.src || "/placeholder.svg"}
                      alt={frame.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
