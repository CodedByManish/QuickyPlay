"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, AlertTriangle, Brain, ArrowLeft } from "lucide-react"
import GamePreview from "@/components/game-preview"

type Game = {
  id: number
  title: string
  category: string
  stressLevel: string
  addictionHook: string
  rating: number
  image: string
  type: string
}

export default function GamePage() {
  const router = useRouter()
  const params = useParams()
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching game data
    const gameId = Number(params.id)

    const games: Game[] = [
      {
        id: 1,
        title: "Duet Game",
        category: "Reflex",
        type: "Reflex/Coordination",
        stressLevel: "High",
        addictionHook: "Smooth rhythm, intense concentration required.",
        rating: 4.7,
        image: "/placeholder.svg?height=400&width=600&text=Duet+Game",
      },
      {
        id: 2,
        title: "Flappy Bird",
        category: "Reflex",
        type: "Tap & Fly",
        stressLevel: "Very High",
        addictionHook: "Instant retry, pixel-perfect navigation.",
        rating: 4.8,
        image: "/placeholder.svg?height=400&width=600&text=Flappy+Bird",
      },
      {
        id: 3,
        title: "2048",
        category: "Puzzle",
        type: "Puzzle/Logic",
        stressLevel: "Medium-High",
        addictionHook: "Easy to play, hard to win — merges give dopamine hits.",
        rating: 4.9,
        image: "/placeholder.svg?height=400&width=600&text=2048",
      },
      {
        id: 4,
        title: "Stack",
        category: "Precision",
        type: "Timing/Precision",
        stressLevel: "Medium",
        addictionHook: "Minimal design, rhythmic stacking, fast restart.",
        rating: 4.5,
        image: "/placeholder.svg?height=400&width=600&text=Stack",
      },
      {
        id: 5,
        title: "Knife Hit",
        category: "Precision",
        type: "Timing/Action",
        stressLevel: "High",
        addictionHook: "Precision challenge, rotating targets, satisfying sounds.",
        rating: 4.6,
        image: "/placeholder.svg?height=400&width=600&text=Knife+Hit",
      },
      {
        id: 6,
        title: "Crossy Road",
        category: "Runner",
        type: "Infinite Runner",
        stressLevel: "Medium",
        addictionHook: "Endless, fast decision-making, unlockable characters.",
        rating: 4.7,
        image: "/placeholder.svg?height=400&width=600&text=Crossy+Road",
      },
      {
        id: 7,
        title: "Geometry Dash",
        category: "Rhythm",
        type: "Rhythm/Platformer",
        stressLevel: "Very High",
        addictionHook: "Music-based jumps, one mistake = restart, keeps you coming back.",
        rating: 4.9,
        image: "/placeholder.svg?height=400&width=600&text=Geometry+Dash",
      },
      {
        id: 8,
        title: "Helix Jump",
        category: "Action",
        type: "Drop & Dodge",
        stressLevel: "Medium-High",
        addictionHook: "Falling through platforms while avoiding traps — intense speed.",
        rating: 4.5,
        image: "/placeholder.svg?height=400&width=600&text=Helix+Jump",
      },
      {
        id: 9,
        title: "Chrome Dinosaur",
        category: "Runner",
        type: "Endless Runner",
        stressLevel: "Medium",
        addictionHook: "Offline meme power, reactive jumps, pixel-perfect fun.",
        rating: 4.4,
        image: "/placeholder.svg?height=400&width=600&text=Chrome+Dinosaur",
      },
      {
        id: 10,
        title: "Color Switch",
        category: "Reflex",
        type: "Reaction-based",
        stressLevel: "High",
        addictionHook: "Color-timing puzzles, intense pace.",
        rating: 4.6,
        image: "/placeholder.svg?height=400&width=600&text=Color+Switch",
      },
      {
        id: 11,
        title: "Slope",
        category: "Runner",
        type: "Reflex Runner (3D)",
        stressLevel: "Very High",
        addictionHook: "Endless falling, speed ramps up — hypnotic.",
        rating: 4.8,
        image: "/placeholder.svg?height=400&width=600&text=Slope",
      },
      {
        id: 12,
        title: "Apple Shooter",
        category: "Precision",
        type: "Precision/Arcade",
        stressLevel: "Medium",
        addictionHook: "Risk-reward — shoot apple off friend's head. Miss = lose.",
        rating: 4.3,
        image: "/placeholder.svg?height=400&width=600&text=Apple+Shooter",
      },
    ]

    const foundGame = games.find((g) => g.id === gameId)

    setTimeout(() => {
      setGame(foundGame || null)
      setLoading(false)
    }, 1000)
  }, [params.id])

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

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Game not found</h1>
        <Button onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative h-[400px] rounded-xl overflow-hidden">
            <Image src={game.image || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
            <p className="text-muted-foreground mb-4">{game.type}</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-lg font-medium">{game.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-5 w-5" />
                <span className={`text-lg font-medium ${getStressLevelColor(game.stressLevel)}`}>
                  {game.stressLevel} Stress
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 mb-8 p-4 bg-muted/50 rounded-lg">
              <Brain className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Addiction Hook</h3>
                <p className="text-muted-foreground">{game.addictionHook}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Play Now
              </Button>
              <Button size="lg" variant="outline">
                Add to Favorites
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Game Preview</h2>
          <div className="h-[600px] bg-card rounded-xl overflow-hidden border">
            <GamePreview game={game} onClose={() => {}} />
          </div>
        </div>
      </div>
    </div>
  )
}
