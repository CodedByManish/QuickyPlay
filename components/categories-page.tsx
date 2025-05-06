"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, X } from "lucide-react"
import { useRouter } from "next/navigation"
import GamePreview from "./game-preview"
import type { Game } from "./game-card-section"

type Category = {
  id: string
  name: string
  description: string
  image: string
  color: string
  gameCount: number
  featuredGame?: Game
}

export default function CategoriesPage() {
  const router = useRouter()
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  // Categories data
  const categories: Category[] = [
    {
      id: "puzzle",
      name: "Puzzle",
      description: "Challenge your brain with logic puzzles and mind-bending challenges.",
      image: "/placeholder.svg?height=400&width=600&text=Puzzle+Games",
      color: "from-green-500 to-emerald-700",
      gameCount: 12,
      featuredGame: {
        id: 3,
        title: "2048",
        category: "Puzzle",
        gameType: "Puzzle",
        type: "Puzzle/Logic",
        stressLevel: "Medium-High",
        addictionHook: "Easy to play, hard to win — merges give dopamine hits.",
        rating: 4.9,
        image: "/placeholder.svg?height=400&width=600&text=2048",
        difficulty: "Medium",
        playTime: "5-15 min",
      },
    },
    {
      id: "action",
      name: "Action",
      description: "Fast-paced games that test your reflexes and coordination.",
      image: "/placeholder.svg?height=400&width=600&text=Action+Games",
      color: "from-red-500 to-rose-700",
      gameCount: 8,
      featuredGame: {
        id: 7,
        title: "Geometry Rush",
        category: "Rhythm",
        gameType: "Action",
        type: "Rhythm/Platformer",
        stressLevel: "Very High",
        addictionHook: "Music-based jumps, one mistake = restart, keeps you coming back.",
        rating: 4.9,
        image: "/placeholder.svg?height=400&width=600&text=Geometry+Rush",
        difficulty: "Hard",
        playTime: "3-10 min",
      },
    },
    {
      id: "arcade",
      name: "Arcade",
      description: "Classic arcade-style games with simple controls and addictive gameplay.",
      image: "/placeholder.svg?height=400&width=600&text=Arcade+Games",
      color: "from-purple-500 to-violet-700",
      gameCount: 10,
      featuredGame: {
        id: 16,
        title: "Snake Game",
        category: "Action",
        gameType: "Arcade",
        type: "Grow & Survive",
        stressLevel: "Medium",
        addictionHook: "Growing longer, avoiding yourself, classic nostalgia.",
        rating: 4.5,
        image: "/placeholder.svg?height=400&width=600&text=Snake+Game",
        difficulty: "Easy",
        playTime: "2-10 min",
      },
    },
    {
      id: "casual",
      name: "Casual",
      description: "Relaxing games that are easy to pick up and play in short sessions.",
      image: "/placeholder.svg?height=400&width=600&text=Casual+Games",
      color: "from-blue-500 to-sky-700",
      gameCount: 15,
      featuredGame: {
        id: 2,
        title: "Flappy Bird",
        category: "Reflex",
        gameType: "Casual",
        type: "Tap & Fly",
        stressLevel: "Very High",
        addictionHook: "Instant retry, pixel-perfect navigation.",
        rating: 4.8,
        image: "/placeholder.svg?height=400&width=600&text=Flappy+Bird",
        difficulty: "Hard",
        playTime: "1-5 min",
      },
    },
    {
      id: "strategy",
      name: "Strategy",
      description: "Games that require planning, thinking ahead, and tactical decision-making.",
      image: "/placeholder.svg?height=400&width=600&text=Strategy+Games",
      color: "from-amber-500 to-yellow-700",
      gameCount: 6,
      featuredGame: {
        id: 13,
        title: "Tic Tac Toe",
        category: "Strategy",
        gameType: "Puzzle",
        type: "Turn-based Strategy",
        stressLevel: "Low",
        addictionHook: "Quick matches, strategic thinking, play against AI or friends.",
        rating: 4.2,
        image: "/placeholder.svg?height=400&width=600&text=Tic+Tac+Toe",
        difficulty: "Easy",
        playTime: "1-3 min",
      },
    },
    {
      id: "runner",
      name: "Runner",
      description: "Endless running games where you dodge obstacles and collect items.",
      image: "/placeholder.svg?height=400&width=600&text=Runner+Games",
      color: "from-cyan-500 to-teal-700",
      gameCount: 7,
      featuredGame: {
        id: 9,
        title: "Chrome Dinosaur",
        category: "Runner",
        gameType: "Arcade",
        type: "Endless Runner",
        stressLevel: "Medium",
        addictionHook: "Offline meme power, reactive jumps, pixel-perfect fun.",
        rating: 4.4,
        image: "/placeholder.svg?height=400&width=600&text=Chrome+Dinosaur",
        difficulty: "Easy",
        playTime: "1-10 min",
      },
    },
    {
      id: "precision",
      name: "Precision",
      description: "Games that require careful timing and accuracy to succeed.",
      image: "/placeholder.svg?height=400&width=600&text=Precision+Games",
      color: "from-pink-500 to-fuchsia-700",
      gameCount: 5,
      featuredGame: {
        id: 101,
        title: "Target Shooter",
        category: "Precision",
        gameType: "Action",
        type: "Shooting/Precision",
        stressLevel: "Medium",
        addictionHook: "Quick reflexes, satisfying hits, score chasing.",
        rating: 4.6,
        image: "/placeholder.svg?height=400&width=600&text=Target+Shooter",
        difficulty: "Medium",
        playTime: "3-10 min",
      },
    },
  ]

  const handlePlayGame = (game: Game) => {
    setSelectedGame(game)
  }

  const handleCloseGame = () => {
    setSelectedGame(null)
  }

  const handleViewCategory = (categoryId: string) => {
    // In a real app, this would navigate to a category-specific page
    router.push(`/?category=${categoryId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <div className="container py-16">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-20 right-4 z-10 rounded-full hover:bg-primary/10 bg-background/80 backdrop-blur-sm border border-primary/20"
            onClick={() => router.push("/")}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Game{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Categories
            </span>
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mb-8">
            Explore our diverse collection of games organized by categories. Find your favorite game style and discover
            new titles to play.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="relative overflow-hidden rounded-xl border border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-70`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-white" />
                  <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                  <span className="ml-2 bg-white/20 text-white text-sm px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {category.gameCount} games
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/90 mb-4 text-shadow shadow-black">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white/20 transition-colors duration-300"
                      onClick={() => handleViewCategory(category.id)}
                    >
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    {category.featuredGame && (
                      <div className="flex items-center gap-2">
                        <span className="text-white/80 text-sm">Featured:</span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handlePlayGame(category.featuredGame!)}
                          className="bg-white/20 hover:bg-white/30 text-white transition-colors duration-300 backdrop-blur-sm"
                        >
                          Play {category.featuredGame.title}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Game Preview Modal */}
      {selectedGame && <GamePreview game={selectedGame} onClose={handleCloseGame} />}
    </div>
  )
}
