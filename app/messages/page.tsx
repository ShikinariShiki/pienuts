"use client"

import { useState } from "react"
import { DrawingCanvas } from "@/components/drawing-canvas"
import { PageNavigation } from "@/components/page-navigation"

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<"message" | "draw">("draw") // Set draw as default for testing

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-8">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Connect ♡</h1>

        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveTab("message")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === "message" ? "bg-pink-500 text-white" : "bg-white text-pink-500 hover:bg-pink-100"
              }`}
            >
              Message
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("draw")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === "draw" ? "bg-pink-500 text-white" : "bg-white text-pink-500 hover:bg-pink-100"
              }`}
            >
              Draw (WIP 🏗️)
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          {activeTab === "message" ? (
            <div className="w-full h-[600px]">
              <iframe src="https://secreto.site/a7x8u7" className="w-full h-full border-0" title="Anonymous Messages" />
            </div>
          ) : (
            <div className="w-full">
              <DrawingCanvas />
            </div>
          )}
        </div>

        <div className="mt-6">
          <PageNavigation />
        </div>
      </div>
    </div>
  )
}
