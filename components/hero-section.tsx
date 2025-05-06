"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Gamepad2, Play, Star, Flame } from "lucide-react"
import GamePreview from "./game-preview"
import type { Game } from "./game-card-section"

// Featured games data with high-quality images
const featuredGames = [
  {
    id: 1,
    title: "Flappy Bird",
    tagline: "Tap to fly, avoid pipes, beat your score!",
    image: "/placeholder.svg?height=1080&width=1920&text=Flappy+Bird",
    category: "Casual",
    rating: 4.8,
    players: "10M+",
    gradient: "from-blue-600 via-cyan-500 to-sky-400",
    bgGradient: "from-blue-900/40 via-cyan-800/20 to-transparent",
    gameType: "Casual",
    type: "Tap & Fly",
    stressLevel: "Very High",
    addictionHook: "Instant retry, pixel-perfect navigation.",
    difficulty: "Hard",
    playTime: "1-5 min",
  },
  {
    id: 2,
    title: "2048",
    tagline: "Merge tiles, reach 2048, feel the satisfaction!",
    image: "/placeholder.svg?height=1080&width=1920&text=2048",
    category: "Puzzle",
    rating: 4.9,
    players: "50M+",
    gradient: "from-amber-500 via-yellow-400 to-orange-300",
    bgGradient: "from-amber-900/40 via-yellow-800/20 to-transparent",
    gameType: "Puzzle",
    type: "Puzzle/Logic",
    stressLevel: "Medium-High",
    addictionHook: "Easy to play, hard to win — merges give dopamine hits.",
    difficulty: "Medium",
    playTime: "5-15 min",
  },
  {
    id: 3,
    title: "Snake Game",
    tagline: "Grow longer, eat more, don't hit yourself!",
    image: "/placeholder.svg?height=1080&width=1920&text=Snake+Game",
    category: "Arcade",
    rating: 4.7,
    players: "30M+",
    gradient: "from-green-500 via-emerald-400 to-teal-300",
    bgGradient: "from-green-900/40 via-emerald-800/20 to-transparent",
    gameType: "Arcade",
    type: "Grow & Survive",
    stressLevel: "Medium",
    addictionHook: "Growing longer, avoiding yourself, classic nostalgia.",
    difficulty: "Easy",
    playTime: "2-10 min",
  },
  {
    id: 4,
    title: "Tetris",
    tagline: "Stack blocks, clear lines, become a legend!",
    image: "/placeholder.svg?height=1080&width=1920&text=Tetris",
    category: "Puzzle",
    rating: 4.9,
    players: "100M+",
    gradient: "from-purple-500 via-violet-400 to-fuchsia-300",
    bgGradient: "from-purple-900/40 via-violet-800/20 to-transparent",
    gameType: "Puzzle",
    type: "Block Stacking",
    stressLevel: "Medium-High",
    addictionHook: "Satisfying line clears, increasing speed, endless gameplay.",
    difficulty: "Medium",
    playTime: "5-20 min",
  },
  {
    id: 5,
    title: "Tic Tac Toe",
    tagline: "Three in a row, outsmart your opponent!",
    image: "/placeholder.svg?height=1080&width=1920&text=Tic+Tac+Toe",
    category: "Strategy",
    rating: 4.5,
    players: "25M+",
    gradient: "from-red-500 via-rose-400 to-pink-300",
    bgGradient: "from-red-900/40 via-rose-800/20 to-transparent",
    gameType: "Puzzle",
    type: "Turn-based Strategy",
    stressLevel: "Low",
    addictionHook: "Quick matches, strategic thinking, play against AI or friends.",
    difficulty: "Easy",
    playTime: "1-3 min",
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [hoverState, setHoverState] = useState<string | null>(null)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 300])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.95, 0.9])

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Calculate parallax transform based on mouse position
  const calculateTransform = (axis: "x" | "y", intensity = 0.02) => {
    const center = axis === "x" ? window.innerWidth / 2 : window.innerHeight / 2
    const position = axis === "x" ? mousePosition.x : mousePosition.y
    return (position - center) * intensity
  }

  // Autoplay functionality
  useEffect(() => {
    if (isAutoplay) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredGames.length)
      }, 5000) // Change slide every 5 seconds
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }
    }
  }, [isAutoplay])

  // Pause autoplay when user interacts with slider
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index)
    setIsAutoplay(false)

    // Resume autoplay after 10 seconds of inactivity
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current)
    }

    setTimeout(() => {
      setIsAutoplay(true)
    }, 10000)
  }

  const currentGame = featuredGames[currentSlide]

  // Handle play game
  const handlePlayGame = () => {
    // Convert the featured game to the Game type expected by GamePreview
    const gameToPlay: Game = {
      id: currentGame.id,
      title: currentGame.title,
      category: currentGame.category,
      gameType: currentGame.gameType as any,
      stressLevel: currentGame.stressLevel as any,
      addictionHook: currentGame.addictionHook,
      rating: currentGame.rating,
      image: currentGame.image,
      type: currentGame.type,
      difficulty: currentGame.difficulty as any,
      playTime: currentGame.playTime,
    }

    setSelectedGame(gameToPlay)
  }

  const handleCloseGame = () => {
    setSelectedGame(null)
  }

  return (
    <section ref={containerRef} className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {featuredGames.map(
            (game, index) =>
              index === currentSlide && (
                <motion.div
                  key={game.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Game background image with parallax */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%]"
                      style={{
                        x: calculateTransform("x", 0.02),
                        y: calculateTransform("y", 0.02),
                      }}
                    >
                      <Image
                        src={game.image || "/placeholder.svg"}
                        alt={game.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
                    </motion.div>
                  </div>

                  {/* Dynamic gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${game.bgGradient}`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent"></div>
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <motion.div className="container relative z-10 pt-20 pb-32" style={{ opacity, scale }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 xl:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentGame.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Game category badge */}
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  <span
                    className={`inline-block rounded-full bg-gradient-to-r ${currentGame.gradient} bg-clip-text text-transparent px-3 py-1 text-sm font-medium border border-white/10 bg-black/30 backdrop-blur-sm`}
                  >
                    {currentGame.category} Game
                  </span>
                </motion.div>

                {/* Game title */}
                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className={`bg-gradient-to-r ${currentGame.gradient} bg-clip-text text-transparent`}>
                    {currentGame.title}
                  </span>
                </motion.h1>

                {/* Game tagline */}
                <motion.p
                  className="text-xl text-white/90 max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentGame.tagline}
                </motion.p>

                {/* Game stats */}
                <motion.div
                  className="flex items-center gap-6 text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-white font-medium">{currentGame.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-400" />
                    <span className="text-white font-medium">{currentGame.players} players</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        currentGame.stressLevel === "Low"
                          ? "bg-green-400"
                          : currentGame.stressLevel === "Medium"
                            ? "bg-yellow-400"
                            : currentGame.stressLevel === "High"
                              ? "bg-orange-400"
                              : "bg-red-400"
                      }`}
                    ></div>
                    <span className="text-white font-medium">{currentGame.stressLevel} Intensity</span>
                  </div>
                </motion.div>

                {/* Call to action button */}
                <motion.div
                  className="flex flex-wrap gap-4 pt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setHoverState("play")}
                    onHoverEnd={() => setHoverState(null)}
                  >
                    <Button
                      size="lg"
                      className={`bg-gradient-to-r ${currentGame.gradient} text-black font-bold relative overflow-hidden group transition-all duration-300 px-8`}
                      onClick={handlePlayGame}
                    >
                      <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                      <Play className="h-5 w-5 mr-2 relative z-10" />
                      <span className="relative z-10">Play Now</span>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Slider indicators */}
            <div className="flex items-center gap-3 mt-12">
              {featuredGames.map((_, index) => (
                <button
                  key={index}
                  className={`group relative h-2 transition-all duration-500 ease-out ${
                    index === currentSlide
                      ? "w-12 bg-gradient-to-r " + featuredGames[index].gradient
                      : "w-2 bg-white/30"
                  } rounded-full overflow-hidden`}
                  onClick={() => handleSlideChange(index)}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <span className="absolute inset-0 bg-white/30 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured game preview (visible on larger screens) */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-7 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentGame.id}
                className="relative h-[500px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/20 backdrop-blur-sm"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  src={currentGame.image || "/placeholder.svg"}
                  alt={currentGame.title}
                  fill
                  className="object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${currentGame.bgGradient} opacity-70`}></div>

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                    onClick={handlePlayGame}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${currentGame.gradient} rounded-full opacity-30 blur-xl`}
                    ></div>
                    <Button
                      size="icon"
                      className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentGame.gradient} text-black hover:text-black hover:scale-105 transition-all duration-300`}
                    >
                      <Play className="h-10 w-10" />
                      <span className="sr-only">QuickyPlay {currentGame.title}</span>
                    </Button>
                  </motion.div>
                </div>

                {/* Game info overlay */}
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <span
                        className={`text-xs font-medium text-black bg-gradient-to-r ${currentGame.gradient} px-2 py-1 rounded-full mb-2 inline-block`}
                      >
                        {currentGame.category}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{currentGame.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-white font-medium">{currentGame.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Game Preview Modal */}
      {selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-4xl h-[80vh] bg-background rounded-lg overflow-hidden border border-primary/30">
            <GamePreview game={selectedGame} onClose={handleCloseGame} />
          </div>
        </div>
      )}
    </section>
  )
}
