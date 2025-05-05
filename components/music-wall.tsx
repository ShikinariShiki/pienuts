"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play, Pause } from "lucide-react"
import { useMusicPlayer } from "@/hooks/use-music-player"

type Album = {
  id: string
  title: string
  artist: string
  coverArt: string
  audioSrc: string
}

const albums: Album[] = [
  {
    id: "album-1",
    title: "Semenjak Ada Dirimu",
    artist: "HiVi! ft. Yovie Widianto",
    coverArt: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/image-A5hUnL081rFbTogPpLoH5DMuWjYxhA.png",
    audioSrc: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/Semenjak%20Ada%20Dirimu%20-%20Yovie%20Widianto-c8yAptKlFm8Su7Jx3ON4avTZyuXYtH.mp3",
  },
  {
    id: "album-2",
    title: "あの夢をなぞって (Tracing That Dream)",
    artist: "YOASOBI",
    coverArt: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/Ano_Yume_o_Nazotte_cover_art-X5zuiB5TIGONtQ7lpFSMgUiLJAiMN6.png",
    audioSrc: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/Ano%20Yume%20o%20Nazotte%20-%20YOASOBI-AxGF5WGQqvn48o5Z0YeRQFzWmA2vb0.mp3",
  },
  {
    id: "album-3",
    title: "Dreamer",
    artist: "Laufey",
    coverArt: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/Dreamer%20album%20cover-6NFsawPLQ2znPM4mLMWs0uRNpKLRqK.png",
    audioSrc: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/Dreamer%20-%20Laufey-gY5iwCmM0JpzNXppzmpVM9BB34Dfp4.mp3",
  },
  {
    id: "album-4",
    title: "Love, Maybe (사랑인가 봐)",
    artist: "SECRET NUMBER",
    coverArt: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/Love%20Maybe_album_cover-ZLclmy5v6Cs7LbspxofIjbvVpQ2snR.png",
    audioSrc: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/Love%2C%20Maybe%20%28%EC%82%AC%EB%9E%91%EC%9D%B8%EA%B0%80%20%EB%B4%90%29%20-%20SECRET%20NUMBER-bLkGnBKD7d82MTsOL63XVIlJBS35kl.mp3",
  },
  {
    id: "album-5",
    title: "Kumpul Bocah",
    artist: "MALIQ & D'Essentials",
    coverArt: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/kumpul%20BOCAH-uS4ZDV8VTSutADc3lalyX7c041sa5j.png",
    audioSrc: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/Kumpul%20Bocah%20%28Original%20Soundtrack%20From%20%E2%80%9CJUMBO%29%20-%20Maliq%20%26%20D%27essentials-0wRxXdDSN7FVbogqIBDlAkI7DbZrd3.mp3",
  },
  {
    id: "album-6",
    title: "115万キロのフィルム (115 Million Kilometer Film)",
    artist: " Official Hige Dandism",
    coverArt: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/115%20km-AOD6xLudXnHMv70NXgOTL1UJjyTAjY.png",
    audioSrc: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/115%E4%B8%87%E3%82%AD%E3%83%AD%E3%81%AE%E3%83%95%E3%82%A3%E3%83%AB%E3%83%A0%20-%20OFFICIAL%20HIGE%20DANDISM-MPnMMNwo4gFw8PDOPFDG2ITX4C0Uh9.mp3",
  },
   {
    id: "album-7",
    title: "luther",
    artist: " Kendrick Lamar and SZA",
    coverArt: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/luther-u83j9HPoNY56ilntxy0RgWsifq2KGE.png",
    audioSrc: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/luther%20-%20Kendrick%20Lamar-BtqrS5ipcQmfRFDUfbb2keCL105hG8.mp3",
  },
   {
    id: "album-8",
    title: "青い珊瑚礁(Aoi Sangoshou)",
    artist: "Seiko Matsuda",
    coverArt: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/aoi%20sangosho-vhC9oT00WLYFmfa1bjoSVxdeOC2eTT.jpg",
    audioSrc: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/Aoi%20Sangosho%20-%20Seiko%20Matsuda-Adpo9OxVunjWIsv3jE74MuvGUYSGjV.mp3",
  },
   {
    id: "album-9",
    title: "the cutest pair",
    artist: "Regina Song",
    coverArt: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/image-OvpBhjrQynSHs7TCWNusqt589YChTp.png",
    audioSrc: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/Lagu/the%20cutest%20pair%20-%20Regina%20Song-YAyQI5zbB6r1DEwGtYa7PTtAuBfwVU.mp3",
  },
]

export function MusicWall() {
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { isPlaying: isBgMusicPlaying, togglePlay: toggleBgMusic } = useMusicPlayer()

  // Create audio element when component mounts
  useEffect(() => {
    audioRef.current = new Audio()

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  // Handle album click
  const handleAlbumClick = (album: Album) => {
    if (!audioRef.current) return

    // If clicking the same album that's currently playing
    if (currentAlbum?.id === album.id) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)

        // Resume background music
        if (!isBgMusicPlaying) {
          toggleBgMusic()
        }
      } else {
        // Pause background music if it's playing
        if (isBgMusicPlaying) {
          toggleBgMusic()
        }

        audioRef.current.play()
        setIsPlaying(true)
      }
    } else {
      // New album selected

      // Pause background music if it's playing
      if (isBgMusicPlaying) {
        toggleBgMusic()
      }

      // Pause current audio if any
      if (isPlaying && audioRef.current) {
        audioRef.current.pause()
      }

      // Set up new audio
      audioRef.current.src = album.audioSrc
      audioRef.current.load()
      audioRef.current.play()

      setCurrentAlbum(album)
      setIsPlaying(true)
    }
  }

  // Handle audio ending
  useEffect(() => {
    if (!audioRef.current) return

    const handleEnded = () => {
      setIsPlaying(false)

      // Resume background music
      if (!isBgMusicPlaying) {
        toggleBgMusic()
      }
    }

    audioRef.current.addEventListener("ended", handleEnded)

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded)
      }
    }
  }, [isBgMusicPlaying, toggleBgMusic])

  return (
    <div className="w-full">
      <div className="relative p-4 bg-[#f5f0e1] dark:bg-[#2d2d42] rounded-xl">
        <h3 className="text-center text-2xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
          pien's favorite music!
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {albums.map((album) => (
            <motion.div
              key={album.id}
              className="relative cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAlbumClick(album)}
            >
              <div className="relative aspect-square overflow-hidden rounded-md shadow-md">
                <Image
                  src={album.coverArt || "/placeholder.svg"}
                  alt={`${album.title} by ${album.artist}`}
                  width={150}
                  height={150}
                  className="object-cover w-full h-full"
                />

                {/* Play/Pause overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  {currentAlbum?.id === album.id && isPlaying ? (
                    <div className="bg-white/80 rounded-full p-2">
                      <Pause className="w-8 h-8 text-pink-600" />
                    </div>
                  ) : (
                    <div className="bg-white/80 rounded-full p-2">
                      <Play className="w-8 h-8 text-pink-600" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2 text-center">
                <p className="font-medium text-sm truncate">{album.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{album.artist}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
