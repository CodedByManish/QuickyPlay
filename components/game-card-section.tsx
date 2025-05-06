"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Star, AlertTriangle, Brain, Gamepad2 } from "lucide-react"
import GamePreview from "./game-preview"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"

export type Game = {
  id: number
  title: string
  category: string
  gameType: "Casual" | "Action" | "Arcade" | "Puzzle"
  stressLevel: "Low" | "Medium" | "Medium-High" | "High" | "Very High"
  addictionHook: string
  rating: number
  image: string
  type: string
  difficulty?: "Easy" | "Medium" | "Hard"
  playTime?: string
  featured?: boolean
}

export default function GameCardSection() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeGameType, setActiveGameType] = useState("All")
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.6, 1, 1, 1, 0.6])

  const categories = ["All", "Casual", "Action", "Arcade", "Puzzle"]
  const gameTypes = ["All", "Casual", "Action", "Arcade", "Puzzle"]

  const games: Game[] = [
    {
      id: 1,
      title: "Subway Surfers",
      category: "Runner",
      gameType: "Casual",
      type: "Endless Runner",
      stressLevel: "Medium-High",
      addictionHook: "Fast-paced, endless running, unlockable characters.",
      rating: 4.7,
      image: "/placeholder.svg?height=400&width=600&text=Subway+Surfers",
      difficulty: "Medium",
      playTime: "5-10 min",
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
      featured: true,
    },
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
      featured: true,
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
      id: 7,
      title: "Geometry Dash",
      category: "Rhythm",
      gameType: "Action",
      type: "Rhythm/Platformer",
      stressLevel: "Very High",
      addictionHook: "Music-based jumps, one mistake = restart, keeps you coming back.",
      rating: 4.9,
      image: "/placeholder.svg?height=400&width=600&text=Geometry+Dash",
      difficulty: "Hard",
      playTime: "3-10 min",
    },
    {
      id: 8,
      title: "Helix Jump",
      category: "Action",
      gameType: "Arcade",
      type: "Drop & Dodge",
      stressLevel: "Medium-High",
      addictionHook: "Falling through platforms while avoiding traps — intense speed.",
      rating: 4.5,
      image: "/placeholder.svg?height=400&width=600&text=Helix+Jump",
      difficulty: "Medium",
      playTime: "2-5 min",
    },
    {
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
      id: 12,
      title: "Apple Shooter",
      category: "Precision",
      gameType: "Action",
      type: "Precision/Arcade",
      stressLevel: "Medium",
      addictionHook: "Risk-reward — shoot apple off friend's head. Miss = lose.",
      rating: 4.3,
      image: "/placeholder.svg?height=400&width=600&text=Apple+Shooter",
      difficulty: "Medium",
      playTime: "2-5 min",
    },
    {
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
      featured: true,
    },
    {
      id: 14,
      title: "Minesweeper",
      category: "Puzzle",
      gameType: "Puzzle",
      type: "Logic/Deduction",
      stressLevel: "Medium",
      addictionHook: "Risk assessment, logical deduction, one wrong move ends it all.",
      rating: 4.4,
      image: "/placeholder.svg?height=400&width=600&text=Minesweeper",
      difficulty: "Medium",
      playTime: "5-15 min",
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
      featured: true,
    },
    {
      id: 17,
      title: "Memory Match",
      category: "Puzzle",
      gameType: "Casual",
      type: "Memory/Matching",
      stressLevel: "Low",
      addictionHook: "Pattern recognition, improving memory, satisfying matches.",
      rating: 4.3,
      image: "/placeholder.svg?height=400&width=600&text=Memory+Match",
      difficulty: "Easy",
      playTime: "3-8 min",
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
      featured: true,
    },
  ]

  // Filter games based on active category, game type, and search query
  const filteredGames = games.filter((game) => {
    const matchesCategory = activeCategory === "All" || game.category === activeCategory
    const matchesGameType = activeGameType === "All" || game.gameType === activeGameType
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.type.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesGameType && matchesSearch
  })

  // Featured games
  const featuredGames = games.filter((game) => game.featured)

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
    try {
      setSelectedGame(game)
      // Scroll to top to ensure game is visible
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("Error starting game:", error)
      // Fallback in case of error
      window.location.href = `/games/${game.id}`
    }
  }

  const handleCloseGame = () => {
    try {
      setSelectedGame(null)
    } catch (error) {
      console.error("Error closing game:", error)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background/80 to-background" ref={containerRef}>
      <div className="container">
        <motion.div className="flex flex-col items-center mb-12" style={{ opacity }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Explore <span className="text-primary">Exciting Games</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={
                  activeCategory === category
                    ? "bg-primary hover:bg-primary/90"
                    : "border-primary/50 text-primary hover:bg-primary/10"
                }
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Featured Games with Parallax */}

        {/* All Games Grid - Modified for better small screen display */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                className="group relative bg-black/40 rounded-xl overflow-hidden border border-primary/20 shadow-lg shadow-primary/5 hover:shadow-primary/20 transition-all duration-500"
                whileHover={{ y: -5, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="relative h-36 sm:h-48 overflow-hidden">
                  <Image
                    src={game.image || "/placeholder.svg"}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:blur-sm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-50 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Game type badge - always visible */}
                  <div
                    className={`absolute top-2 right-2 ${getGameTypeColor(game.gameType)} text-black text-xs font-medium px-2 py-1 rounded-full`}
                  >
                    {game.gameType}
                  </div>

                  {/* Game title - always visible */}
                  <div className="absolute bottom-0 left-0 p-3 sm:p-4 w-full">
                    <h3 className="text-base sm:text-xl font-bold text-primary truncate">{game.title}</h3>
                  </div>

                  {/* Hover overlay with details - hidden on mobile */}
                  <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:block hidden">
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
                  <div className="sm:hidden absolute inset-0 bg-black/70 flex flex-col justify-center items-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-sm py-1"
                      onClick={() => handlePlayNow(game)}
                    >
                      Play Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <Gamepad2 className="h-16 w-16 text-primary/50 mb-4" />
              <h3 className="text-xl font-medium mb-2">No games found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
              <Button
                onClick={() => {
                  setActiveCategory("All")
                  setActiveGameType("All")
                  setSearchQuery("")
                }}
                className="bg-primary hover:bg-primary/90"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Game Preview Modal */}
      {selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative w-full max-w-4xl h-[80vh] bg-black/90 rounded-lg overflow-hidden border border-primary/30">
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-black/70 border-primary/30 text-primary hover:bg-black/90"
                onClick={handleCloseGame}
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </div>
            <GamePreview game={selectedGame} onClose={handleCloseGame} />
          </div>
        </div>
      )}
    </section>
  )
}
