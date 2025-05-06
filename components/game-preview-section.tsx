"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Gamepad2 } from "lucide-react"

export default function GamePreviewSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  const games = [
    {
      id: 1,
      title: "Tetris",
      description:
        "The classic block-stacking game that never gets old. Arrange falling tetrominoes to create complete lines.",
      image: "/placeholder.svg?height=600&width=800&text=Tetris",
      transform: y1,
      category: "Puzzle",
      difficulty: "Medium",
    },
    {
      id: 2,
      title: "Tic Tac Toe",
      description:
        "The timeless game of X's and O's. Challenge your friends or play against the AI in this strategic battle.",
      image: "/placeholder.svg?height=600&width=800&text=Tic+Tac+Toe",
      transform: y2,
      category: "Strategy",
      difficulty: "Easy",
    },
    {
      id: 3,
      title: "Minesweeper",
      description: "Test your deduction skills by clearing a minefield without detonating any of the hidden mines.",
      image: "/placeholder.svg?height=600&width=800&text=Minesweeper",
      transform: y3,
      category: "Puzzle",
      difficulty: "Medium",
    },
  ]

  return (
    <section
      ref={containerRef}
      className="relative py-20 overflow-hidden bg-gradient-to-b from-background/90 to-background"
    >
      {/* Futuristic grid background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0 bg-grid-pattern bg-repeat"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(124, 58, 237, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(124, 58, 237, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 70%)",
          }}
        ></div>
      </div>

      <motion.div className="container relative z-10" style={{ opacity, scale }}>
        <div className="flex flex-col items-center text-center mb-16">
          <Gamepad2 className="h-8 w-8 text-primary mb-2" />
          <span className="text-primary font-medium">Game Collection</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Classic <span className="text-primary">Games</span> Reimagined
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Rediscover your favorite classic games with modern twists and enhanced gameplay. These timeless titles have
            been carefully crafted to provide the perfect balance of nostalgia and fresh experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games.map((game) => (
            <motion.div
              key={game.id}
              className="relative h-[400px] overflow-hidden rounded-xl group border border-primary/20 bg-black/40"
              whileHover={{ y: -10 }}
            >
              <motion.div className="absolute inset-0 w-full h-full" style={{ y: game.transform }}>
                <Image
                  src={game.image || "/placeholder.svg"}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Always visible content */}
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-2xl font-bold text-primary mb-2">{game.title}</h3>

                  {/* Content that appears on hover */}
                  <div className="transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-black bg-primary px-2 py-1 rounded-full">
                        {game.category}
                      </span>
                      <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-1 rounded-full">
                        {game.difficulty}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{game.description}</p>

                    <Button className="w-full bg-primary hover:bg-primary/90 group transform scale-100 group-hover:scale-110 transition-transform duration-300">
                      Play Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
            View All Classic Games
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
