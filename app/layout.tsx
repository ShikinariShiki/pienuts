import type React from "react"
import "./globals.css"
import { Poppins } from "next/font/google"
import type { Metadata } from "next"
import { MusicPlayerProvider } from "@/hooks/use-music-player"
import { SplashScreen } from "@/components/splash-screen"

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={poppins.className}>
        <MusicPlayerProvider>
          <SplashScreen />
          {children}
        </MusicPlayerProvider>
      </body>
    </html>
  )
}
