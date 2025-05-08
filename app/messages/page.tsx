"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageNavigation } from "@/components/page-navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Palette } from "lucide-react"
import Link from "next/link"

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<"message">("message")

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
          <Tabs defaultValue="message" className="w-full" onValueChange={(value) => setActiveTab(value as "message")}>
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-1">
              <TabsList className="w-full bg-white dark:bg-gray-800 grid grid-cols-1">
                <TabsTrigger
                  value="message"
                  className="data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
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
          </Tabs>
        </motion.div>

        <div className="mt-6 text-center">
          <Link href="/draw">
            <motion.button
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full shadow-md flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Palette className="w-4 h-4" />
              <span>Go to Drawing Canvas</span>
            </motion.button>
          </Link>
          <div className="mt-4">
            <PageNavigation />
          </div>
        </div>
      </div>
    </div>
  )
}
