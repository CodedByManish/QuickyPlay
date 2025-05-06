"use client"

import { useEffect, useRef, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import type { Game } from "./game-card-section"
import FlappyBirdGame from "@/games/flappy-bird"
import Game2048 from "@/games/2048"
import SnakeGame from "@/games/snake-game"
import TicTacToeGame from "@/games/tic-tac-toe"
import MinesweeperGame from "@/games/minesweeper"
import ChromeDinosaurGame from "@/games/chrome-dinosaur"
import PongGame from "@/games/pong"
import GeometryRushGame from "@/games/geometry-rush"
import SudokuGame from "@/games/sudoku"
import TargetShooterGame from "@/games/target-shooter"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Maximize, Minimize, X } from "lucide-react"

type GamePreviewProps = {
  game: Game
  onClose: () => void
}

export default function GamePreview({ game, onClose }: GamePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const isMobile = useMobile()

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isFullscreen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose, isFullscreen])

  // Render appropriate game based on title
  const renderGame = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading {game.title}...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      )
    }

    switch (game.title) {
      case "Flappy Bird":
        return <FlappyBirdGame />
      case "2048":
        return <Game2048 />
      case "Snake Game":
        return <SnakeGame />
      case "Tic Tac Toe":
        return <TicTacToeGame />
      case "Minesweeper":
        return <MinesweeperGame />
      case "Chrome Dinosaur":
        return <ChromeDinosaurGame />
      case "Pong":
        return <PongGame />
      case "Geometry Rush":
        return <GeometryRushGame />
      case "Sudoku":
        return <SudokuGame />
      case "Target Shooter":
        return <TargetShooterGame />
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-lg mb-4">Game not implemented yet</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        )
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] max-w-5xl max-h-[80vh] bg-background rounded-lg shadow-xl border border-primary/20 overflow-hidden"
    >
      <div className="p-4 flex items-center justify-between border-b bg-background/95 backdrop-blur-sm">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold">{game.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex items-center justify-center p-4 h-[calc(100%-4rem)]">
        <div className="w-full h-full max-w-4xl flex items-center justify-center">{renderGame()}</div>
      </div>
    </div>
  )
}
