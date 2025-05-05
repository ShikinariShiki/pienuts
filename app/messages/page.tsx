"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DrawingCanvas } from "@/components/drawing-canvas"
import { PageNavigation } from "@/components/page-navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Palette } from "lucide-react"

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<"message" | "draw">("draw")

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-8">
      <div className="w-full max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-pink-600 dark:text-pink-300 mb-2">Connect with Pien ♡</h1>
          <p className="text-gray-600 dark:text-gray-400">Leave a message or create a drawing to share!</p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-pink-200 dark:border-pink-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs
            defaultValue="draw"
            className="w-full"
            onValueChange={(value) => setActiveTab(value as "message" | "draw")}
          >
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-1">
              <TabsList className="w-full bg-white dark:bg-gray-800 grid grid-cols-2">
                <TabsTrigger
                  value="message"
                  className="data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </TabsTrigger>
                <TabsTrigger
                  value="draw"
                  className="data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 flex items-center gap-2"
                >
                  <Palette className="w-4 h-4" />
                  <span>Draw</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="message" className="p-0 m-0">
              <div className="w-full h-[600px] border-t border-pink-200 dark:border-pink-800/30">
                <iframe
                  src="https://secreto.site/a7x8u7"
                  className="w-full h-full border-0"
                  title="Anonymous Messages"
                />
              </div>
            </TabsContent>

            <TabsContent value="draw" className="p-0 m-0">
              <div className="p-4 bg-gradient-to-b from-pink-50 to-white dark:from-gray-800 dark:to-gray-900">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-pink-600 dark:text-pink-300">
                    Express yourself through art!
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Create your best drawing for Pienn! Your artwork will be sent anonymously.
                  </p>
                </div>
                <DrawingCanvas />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        <div className="mt-6">
          <PageNavigation />
        </div>
      </div>
    </div>
  )
}
