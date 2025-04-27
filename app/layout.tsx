import type React from "react"
import "./globals.css"
import { Poppins } from "next/font/google"
import type { Metadata } from "next"
import { MusicPlayerProvider } from "@/hooks/use-music-player"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "pien's kawaii caard",
  description: "welcome to pien's cute site!",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={poppins.className}>
        <MusicPlayerProvider>{children}</MusicPlayerProvider>
      </body>
    </html>
  )
}
