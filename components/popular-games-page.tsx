"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Star, AlertTriangle, Brain, X } from "lucide-react"
import GamePreview from "./game-preview"
import { Badge } from "@/components/ui/badge"
import type { Game } from "./game-card-section"
import { useRouter } from "next/navigation"

export default function PopularGamesPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const router = useRouter()

  // Popular games data - sorted by rating
  const popularGames: Game[] = [
    {
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
    {
      id: 18,
      title: "Tetris",
      category: "Puzzle",
      gameType: "Puzzle",
      type: "Block Stacking",
      stressLevel: "Medium-High",
      addictionHook: "Satisfying line clears, increasing speed, endless gameplay.",
      rating: 4.9,
      image: "/placeholder.svg?height=400&width=600&text=Tetris",
      difficulty: "Medium",
      playTime: "5-20 min",
    },
    {
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
    {
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
    {
      id: 11,
      title: "Slope",
      category: "Runner",
      gameType: "Action",
      type: "Reflex Runner (3D)",
      stressLevel: "Very High",
      addictionHook: "Endless falling, speed ramps up — hypnotic.",
      rating: 4.8,
      image: "/placeholder.svg?height=400&width=600&text=Slope",
      difficulty: "Hard",
      playTime: "2-8 min",
    },
    {
      id: 15,
      title: "Sudoku",
      category: "Puzzle",
      gameType: "Puzzle",
      type: "Number Puzzle",
      stressLevel: "Low",
      addictionHook: "Brain teaser, completionist satisfaction, endless variations.",
      rating: 4.7,
      image: "/placeholder.svg?height=400&width=600&text=Sudoku",
      difficulty: "Medium",
      playTime: "10-30 min",
    },
    {
      id: 1,
      title: "Duet Game",
      category: "Reflex",
      gameType: "Arcade",
      type: "Reflex/Coordination",
      stressLevel: "High",
      addictionHook: "Smooth rhythm, intense concentration required.",
      rating: 4.7,
      image: "/placeholder.svg?height=400&width=600&text=Duet+Game",
      difficulty: "Medium",
      playTime: "5-10 min",
    },
    {
      id: 6,
      title: "Crossy Road",
      category: "Runner",
      gameType: "Casual",
      type: "Infinite Runner",
      stressLevel: "Medium",
      addictionHook: "Endless, fast decision-making, unlockable characters.",
      rating: 4.7,
      image: "/placeholder.svg?height=400&width=600&text=Crossy+Road",
      difficulty: "Medium",
      playTime: "5-10 min",
    },
    {
      id: 10,
      title: "Color Switch",
      category: "Reflex",
      gameType: "Arcade",
      type: "Reaction-based",
      stressLevel: "High",
      addictionHook: "Color-timing puzzles, intense pace.",
      rating: 4.6,
      image: "/placeholder.svg?height=400&width=600&text=Color+Switch",
      difficulty: "Medium",
      playTime: "2-5 min",
    },
    {
      id: 5,
      title: "Knife Hit",
      category: "Precision",
      gameType: "Action",
      type: "Timing/Action",
      stressLevel: "High",
      addictionHook: "Precision challenge, rotating targets, satisfying sounds.",
      rating: 4.6,
      image: "/placeholder.svg?height=400&width=600&text=Knife+Hit",
      difficulty: "Medium",
      playTime: "3-8 min",
    },
    {
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
    {
      id: 4,
      title: "Stack",
      category: "Precision",
      gameType: "Casual",
      type: "Timing/Precision",
      stressLevel: "Medium",
      addictionHook: "Minimal design, rhythmic stacking, fast restart.",
      rating: 4.5,
      image: "/placeholder.svg?height=400&width=600&text=Stack",
      difficulty: "Easy",
      playTime: "2-5 min",
    },
  ]

  const getStressLevelColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-green-500"
      case "Medium":
        return "text-yellow-500"
      case "Medium-High":
        return "text-orange-500"
      case "High":
        return "text-red-500"
      case "Very High":
        return "text-purple-500"
      default:
        return "text-gray-500"
    }
  }

  const getDifficultyColor = (difficulty: string | undefined) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500"
      case "Medium":
        return "bg-yellow-500"
      case "Hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getGameTypeColor = (gameType: string) => {
    switch (gameType) {
      case "Casual":
        return "bg-blue-600"
      case "Action":
        return "bg-red-600"
      case "Arcade":
        return "bg-purple-600"
      case "Puzzle":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const handlePlayNow = (game: Game) => {
    setSelectedGame(game)
  }

  const handleCloseGame = () => {
    setSelectedGame(null)
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
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Popular</span>{" "}
            Games
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mb-8">
            Discover the most popular games on QuickyPlay, ranked by player ratings and popularity. These addictive
            games have captivated millions of players worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularGames.map((game, index) => (
            <motion.div
              key={game.id}
              className="group relative bg-black/40 rounded-xl overflow-hidden border border-primary/20 shadow-lg shadow-primary/5 hover:shadow-primary/20 transition-all duration-500"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={game.image || "/placeholder.svg"}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-50 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Game type badge */}
                <div
                  className={`absolute top-2 right-2 ${getGameTypeColor(
                    game.gameType,
                  )} text-black text-xs font-medium px-2 py-1 rounded-full`}
                >
                  {game.gameType}
                </div>

                {/* Rating badge */}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400" />
                  {game.rating}
                </div>

                {/* Game title */}
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="text-xl font-bold text-primary truncate">{game.title}</h3>
                </div>

                {/* Hover overlay with details */}
                <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full">
                    <h3 className="text-xl font-bold text-primary mb-2 text-center">{game.title}</h3>

                    <div className="flex justify-center gap-2 mb-3">
                      <Badge className={`${getDifficultyColor(game.difficulty)} text-black border-none`}>
                        {game.difficulty}
                      </Badge>

                      <Badge className="bg-primary/20 text-primary border-none">{game.playTime}</Badge>
                    </div>

                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-300">{game.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-gray-300" />
                        <span className={`text-sm font-medium ${getStressLevelColor(game.stressLevel)}`}>
                          {game.stressLevel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1 mb-4 px-2">
                      <Brain className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <p className="text-xs text-gray-300">{game.addictionHook}</p>
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90 transform scale-100 group-hover:scale-110 transition-transform duration-300"
                      onClick={() => handlePlayNow(game)}
                    >
                      Play Now
                    </Button>
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
