"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PageNavigation } from "@/components/page-navigation"
import Image from "next/image"
import { Search, ExternalLink, Filter } from "lucide-react"

type TwitterAccount = {
  name: string
  handle: string
  bio: string
  imageUrl: string
  url: string
  category: string
}

const twitterAccounts: TwitterAccount[] = [
  {
    name: "Hime",
    handle: "mizicutie",
    bio: "Let's be friends too with Hime!",
    imageUrl: "https://pbs.twimg.com/profile_images/1919920887912169472/RFlVCsly_400x400.jpg",
    url: "https://x.com/mizicutie",
    category: "Artist",
  },
  {
    name: "Kiel",
    handle: "kiafzuha",
    bio: "Let's be friends too with Kiel!",
    imageUrl: "https://pbs.twimg.com/profile_images/1921114659483975680/eHDh7bCn_400x400.png",
    url: "https://x.com/kiafzuha",
    category: "Vtuber",
  },
  {
    name: "Ieri",
    handle: "etcherr1essu",
    bio: "Let's be friends too with Ieri!",
    imageUrl: "https://pbs.twimg.com/profile_images/1918954383582400512/S_NVZhxd_400x400.jpg",
    url: "https://x.com/etcherr1essu",
    category: "Artist",
  },
  {
    name: "Miwochi",
    handle: "biyonyam",
    bio: "Let's be friends too with Miwochi!",
    imageUrl: "https://pbs.twimg.com/profile_images/1919287852476829696/k4TMksx8_400x400.jpg",
    url: "https://x.com/biyonyam",
    category: "Cosplayer",
  },
  {
    name: "Vy",
    handle: "carloxtta",
    bio: "Let's be friends too with Vy!",
    imageUrl: "https://pbs.twimg.com/profile_images/1920839197897756672/TRvFUehx_400x400.jpg",
    url: "https://x.com/carloxtta",
    category: "Artist",
  },
  {
    name: "Mai",
    handle: "o____orihime",
    bio: "Let's be friends too with Mai!",
    imageUrl: "https://pbs.twimg.com/profile_images/1920027496046526464/-Dkdni9l_400x400.jpg",
    url: "https://x.com/o____orihime",
    category: "Artist",
  },
  {
    name: "Rey",
    handle: "scaramouje",
    bio: "Let's be friends too with Rey!",
    imageUrl: "https://pbs.twimg.com/profile_images/1919821522564481024/_uVDOJmD_400x400.png",
    url: "https://x.com/scaramouje",
    category: "Gamer",
  },
  {
    name: "Mizuy",
    handle: "harumiyaw",
    bio: "Let's be friends too with Mizuy!",
    imageUrl: "https://pbs.twimg.com/profile_images/1921143740325937153/Jca_YO3q_400x400.png",
    url: "https://x.com/harumiyaw",
    category: "Artist",
  },
  {
    name: "Chevi",
    handle: "akulheetham",
    bio: "Let's be friends too with Chevi!",
    imageUrl: "https://pbs.twimg.com/profile_images/1920627777075855360/t7YdIymw_400x400.png",
    url: "https://x.com/akulheetham",
    category: "Musician",
  },
  {
    name: "Azriel",
    handle: "suvrtr",
    bio: "Let's be friends too with Azriel!",
    imageUrl: "https://pbs.twimg.com/profile_images/1916427924808568832/aMFPC936_400x400.jpg",
    url: "https://x.com/suvrtr",
    category: "Cosplayer",
  },
  {
    name: "Azel",
    handle: "casstoriec",
    bio: "Let's be friends too with Azel!",
    imageUrl: "https://pbs.twimg.com/profile_images/1916821150593949696/omSdFdqi_400x400.png",
    url: "https://x.com/casstoriec",
    category: "Gamer",
  },
  {
    name: "Varta",
    handle: "kalpasz",
    bio: "Let's be friends too with Varta!",
    imageUrl: "https://pbs.twimg.com/profile_images/1921057293665193984/vboYnqp3_400x400.png",
    url: "https://x.com/kalpasz",
    category: "Anime Fan",
  },
  {
    name: "Shirou",
    handle: "elyysiya",
    bio: "Let's be friends too with Shirou!",
    imageUrl: "https://pbs.twimg.com/profile_images/1908147223357198336/ZjlLXW1w_400x400.png",
    url: "https://x.com/elyysiya",
    category: "Artist",
  },
  {
    name: "Fira",
    handle: "muicqro",
    bio: "Let's be friends too with Fira!",
    imageUrl: "https://pbs.twimg.com/profile_images/1919979842654896129/3VT9dpL0_400x400.jpg",
    url: "https://x.com/muicqro",
    category: "Musician",
  },
  {
    name: "Kael",
    handle: "nonumuro",
    bio: "Let's be friends too with Kael!",
    imageUrl: "https://pbs.twimg.com/profile_images/1919766845147774977/RrcIMiUp_400x400.jpg",
    url: "https://x.com/nonumuro",
    category: "Collector",
  },
  {
    name: "Lunay",
    handle: "cattoris",
    bio: "Let's be friends too with Lunay!",
    imageUrl: "https://pbs.twimg.com/profile_images/1920436212344422400/yehu6Kdw_400x400.png",
    url: "https://x.com/cattoris",
    category: "Vtuber",
  },
  {
    name: "Yugi",
    handle: "ritchuuw",
    bio: "Let's be friends too with Yugi!",
    imageUrl: "https://pbs.twimg.com/profile_images/1920454554383958016/z7RqOn_V_400x400.png",
    url: "https://x.com/ritchuuw",
    category: "Vtuber",
  },
  {
    name: "Octw",
    handle: "sigewinnhe",
    bio: "Let's be friends too with Octw!",
    imageUrl: "https://pbs.twimg.com/profile_images/1920343135600705536/mQ0ycBej_400x400.png",
    url: "https://x.com/sigewinnhe",
    category: "Vtuber",
  },
  {
    name: "Alva",
    handle: "lightermylove",
    bio: "Let's be friends too with Alva!",
    imageUrl: "https://pbs.twimg.com/profile_images/1906864411601776640/NFNHJmkg_400x400.jpg",
    url: "https://x.com/lightermylove",
    category: "Vtuber",
  },
  {
    name: "Azera",
    handle: "azevyy",
    bio: "Let's be friends too with Azera!",
    imageUrl: "https://pbs.twimg.com/profile_images/1799099277580673024/TqVGat9s_400x400.jpg",
    url: "https://x.com/azevyy",
    category: "Vtuber",
  },
  {
    name: "Kafka",
    handle: "nakedcaleb",
    bio: "Let's be friends too with Kafka!",
    imageUrl: "https://pbs.twimg.com/profile_images/1920817002458869760/zOeG1GbH_400x400.png",
    url: "https://x.com/nakedcaleb",
    category: "Vtuber",
  },
  {
    name: "Manu",
    handle: "mnu3llsan",
    bio: "Let's be friends too with Manu!",
    imageUrl: "https://pbs.twimg.com/profile_images/1921088516760494080/5i7Eb75y_400x400.png",
    url: "https://x.com/mnu3llsan",
    category: "Vtuber",
  },
  {
    name: "Seya",
    handle: "kapveh",
    bio: "Let's be friends too with Seya!",
    imageUrl: "https://pbs.twimg.com/profile_images/1920359971188776960/_NoHf-r__400x400.png",
    url: "https://x.com/kapveh",
    category: "Vtuber",
  },
  {
    name: "Jeeya",
    handle: "fleooya",
    bio: "Let's be friends too with Jeeya!",
    imageUrl: "https://pbs.twimg.com/profile_images/1921002600847085568/DT9VylGl_400x400.png",
    url: "https://x.com/fleooya",
    category: "Vtuber",
  },
  {
    name: "Reika",
    handle: "reyyika",
    bio: "Let's be friends too with Reika!",
    imageUrl: "https://pbs.twimg.com/profile_images/1920713650937135104/4Mo7QM0G_400x400.jpg",
    url: "https://x.com/reyyika",
    category: "Vtuber",
  },
  {
    name: "Ciphie",
    handle: "mydeimoes",
    bio: "Let's be friends too with Ciphie!",
    imageUrl: "https://pbs.twimg.com/profile_images/1916003354293243906/n13L8Qvf_400x400.jpg",
    url: "https://x.com/mydeimoes",
    category: "Vtuber",
  },
  {
    name: "Yoriko",
    handle: "percyhira",
    bio: "Let's be friends too with Yoriko!",
    imageUrl: "https://pbs.twimg.com/profile_images/1917813262076538880/UEd9xuXD_400x400.jpg",
    url: "https://x.com/percyhira",
    category: "Vtuber",
  },
]

// Get all unique categories
const allCategories = ["All", ...Array.from(new Set(twitterAccounts.map((account) => account.category)))]

export default function HallOfFamePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredAccounts, setFilteredAccounts] = useState<TwitterAccount[]>(twitterAccounts)
  const [showFilters, setShowFilters] = useState(false)

  // Filter accounts based on search term and category
  useEffect(() => {
    let results = twitterAccounts

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        (account) =>
          account.name.toLowerCase().includes(term) ||
          account.handle.toLowerCase().includes(term) ||
          account.bio.toLowerCase().includes(term),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      results = results.filter((account) => account.category === selectedCategory)
    }

    setFilteredAccounts(results)
  }, [searchTerm, selectedCategory])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-8 pb-16">
      <motion.div
        className="card w-full max-w-4xl p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <motion.h1
          className="text-3xl font-bold text-pink-600 dark:text-pink-300 mb-2 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          Hall of Fame<span className="text-pink-400 dark:text-pink-200">!</span>
        </motion.h1>

        <motion.p
          className="text-center text-gray-600 dark:text-gray-400 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Pien's favorite Twitter accounts ♡
        </motion.p>

        <motion.div
          className="divider mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3 }}
        />

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or handle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-pink-200 dark:border-pink-800/30 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-[#2d2d42] dark:text-pink-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 px-3 py-2 rounded-full bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-[#3d3d5a] transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>
            </div>
          </div>

          {/* Category filters */}
          {showFilters && (
            <motion.div
              className="mt-4 flex flex-wrap gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category
                      ? "bg-pink-500 text-white"
                      : "bg-pink-100 dark:bg-[#2d2d42] text-pink-600 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-[#3d3d5a]"
                  } transition-colors`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Twitter Accounts Grid */}
        {filteredAccounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAccounts.map((account, index) => (
              <motion.div
                key={account.handle}
                className="bg-white dark:bg-[#2d2d42] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={account.imageUrl || "/placeholder.svg"}
                      alt={account.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-pink-600 dark:text-pink-300">{account.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">@{account.handle}</p>
                      </div>

                      <a
                        href={account.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-pink-100 dark:bg-pink-800/30 p-1.5 rounded-full text-pink-500 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-700/30 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">{account.bio}</p>

                    <div className="mt-2">
                      <span className="inline-block px-2 py-0.5 bg-pink-100 dark:bg-pink-800/20 text-pink-600 dark:text-pink-300 rounded-full text-xs">
                        {account.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No accounts found matching your search.</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
              className="mt-2 text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300"
            >
              Clear filters
            </button>
          </div>
        )}

        <PageNavigation />
      </motion.div>
    </div>
  )
}
