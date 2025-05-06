"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

type TargetType = {
  x: number
  y: number
  radius: number
  speed: number
  points: number
  color: string
  active: boolean
  direction: { x: number; y: number }
}

export default function TargetShooterGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [targets, setTargets] = useState<TargetType[]>([])
  const [shots, setShots] = useState(0)
  const [hits, setHits] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const animationRef = useRef<number>()
  const lastTargetTime = useRef(0)
  const isMobile = useMobile()

  // Initialize game
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const updateCanvasSize = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()

      // Set canvas size to match container
      const width = rect.width
      const height = rect.height

      setCanvasSize({ width, height })

      if (canvasRef.current) {
        canvasRef.current.width = width
        canvasRef.current.height = height
      }
    }

    // Initial size update
    updateCanvasSize()

    // Try to load high score from localStorage
    try {
      const savedHighScore = localStorage.getItem("targetShooterHighScore")
      if (savedHighScore) {
        setHighScore(Number.parseInt(savedHighScore, 10))
      }
    } catch (e) {
      console.warn("Could not access localStorage for high score")
    }

    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const gameLoop = (timestamp: number) => {
      // Update time
      if (timestamp - lastTargetTime.current >= 1000) {
        setTimeLeft((prev) => {
          const newTime = prev - 1
          if (newTime <= 0) {
            endGame()
            return 0
          }
          return newTime
        })
        lastTargetTime.current = timestamp
      }

      // Add new target occasionally
      if (Math.random() < 0.02 && targets.length < 10) {
        addTarget()
      }

      // Update targets
      updateTargets()

      // Draw game
      drawGame(ctx)

      // Continue animation loop if game is not over
      if (gameStarted && !gameOver) {
        animationRef.current = requestAnimationFrame(gameLoop)
      }
    }

    lastTargetTime.current = performance.now()
    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameStarted, gameOver, targets, canvasSize])

  // Draw initial game state
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    drawGame(ctx)
  }, [canvasSize, gameStarted, gameOver, targets])

  // Add a new target
  const addTarget = () => {
    const minRadius = Math.min(canvasSize.width, canvasSize.height) * 0.03
    const maxRadius = Math.min(canvasSize.width, canvasSize.height) * 0.08

    const radius = minRadius + Math.random() * (maxRadius - minRadius)
    const x = radius + Math.random() * (canvasSize.width - radius * 2)
    const y = radius + Math.random() * (canvasSize.height - radius * 2)

    // Points are inversely proportional to size
    const points = Math.round(10 + ((maxRadius - radius) / (maxRadius - minRadius)) * 40)

    // Color based on points
    let color
    if (points >= 40)
      color = "#ff0000" // Red - highest points
    else if (points >= 30)
      color = "#ff9900" // Orange
    else if (points >= 20)
      color = "#ffff00" // Yellow
    else color = "#00ff00" // Green - lowest points

    // Random direction
    const angle = Math.random() * Math.PI * 2
    const speed = 1 + Math.random() * 2

    const newTarget: TargetType = {
      x,
      y,
      radius,
      speed,
      points,
      color,
      active: true,
      direction: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      },
    }

    setTargets((prev) => [...prev, newTarget])
  }

  // Update targets
  const updateTargets = () => {
    setTargets((prev) =>
      prev.map((target) => {
        if (!target.active) return target

        // Move target
        let newX = target.x + target.direction.x
        let newY = target.y + target.direction.y

        // Bounce off walls
        if (newX - target.radius < 0 || newX + target.radius > canvasSize.width) {
          target.direction.x = -target.direction.x
          newX = target.x + target.direction.x
        }

        if (newY - target.radius < 0 || newY + target.radius > canvasSize.height) {
          target.direction.y = -target.direction.y
          newY = target.y + target.direction.y
        }

        return {
          ...target,
          x: newX,
          y: newY,
        }
      }),
    )
  }

  // Draw game
  const drawGame = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

    // Draw background
    ctx.fillStyle = "#1a1a2e"
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1

    // Draw vertical grid lines
    for (let x = 0; x < canvasSize.width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasSize.height)
      ctx.stroke()
    }

    // Draw horizontal grid lines
    for (let y = 0; y < canvasSize.height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasSize.width, y)
      ctx.stroke()
    }

    // Draw targets
    targets.forEach((target) => {
      if (!target.active) return

      // Draw target
      ctx.beginPath()
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2)
      ctx.fillStyle = target.color
      ctx.fill()

      // Draw target rings
      ctx.beginPath()
      ctx.arc(target.x, target.y, target.radius * 0.75, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(target.x, target.y, target.radius * 0.5, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(target.x, target.y, target.radius * 0.25, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.fill()
    })

    // Draw crosshair if game is active
    if (gameStarted && !gameOver) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 2

      // Horizontal line
      ctx.beginPath()
      ctx.moveTo(mousePosition.x - 15, mousePosition.y)
      ctx.lineTo(mousePosition.x - 5, mousePosition.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(mousePosition.x + 5, mousePosition.y)
      ctx.lineTo(mousePosition.x + 15, mousePosition.y)
      ctx.stroke()

      // Vertical line
      ctx.beginPath()
      ctx.moveTo(mousePosition.x, mousePosition.y - 15)
      ctx.lineTo(mousePosition.x, mousePosition.y - 5)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(mousePosition.x, mousePosition.y + 5)
      ctx.lineTo(mousePosition.x, mousePosition.y + 15)
      ctx.stroke()

      // Center dot
      ctx.beginPath()
      ctx.arc(mousePosition.x, mousePosition.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 0, 0, 0.8)"
      ctx.fill()
    }

    // Draw HUD
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 20px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`Score: ${score}`, 20, 30)
    ctx.fillText(`Time: ${timeLeft}s`, 20, 60)

    ctx.textAlign = "right"
    ctx.fillText(`Accuracy: ${shots > 0 ? Math.round((hits / shots) * 100) : 0}%`, canvasSize.width - 20, 30)
    ctx.fillText(`High Score: ${highScore}`, canvasSize.width - 20, 60)

    // Draw start screen
    if (!gameStarted && !gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 40px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Target Shooter", canvasSize.width / 2, canvasSize.height / 2 - 50)

      ctx.font = "20px Arial"
      ctx.fillText("Click to start", canvasSize.width / 2, canvasSize.height / 2 + 20)
    }

    // Draw game over screen
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 40px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Game Over", canvasSize.width / 2, canvasSize.height / 2 - 80)

      ctx.font = "30px Arial"
      ctx.fillText(`Final Score: ${score}`, canvasSize.width / 2, canvasSize.height / 2 - 30)

      ctx.font = "20px Arial"
      ctx.fillText(
        `Shots: ${shots} | Hits: ${hits} | Accuracy: ${shots > 0 ? Math.round((hits / shots) * 100) : 0}%`,
        canvasSize.width / 2,
        canvasSize.height / 2 + 10,
      )

      if (score > highScore) {
        ctx.fillStyle = "#ffcc00"
        ctx.font = "bold 25px Arial"
        ctx.fillText("New High Score!", canvasSize.width / 2, canvasSize.height / 2 + 50)
      }

      ctx.fillStyle = "#ffffff"
      ctx.font = "20px Arial"
      ctx.fillText("Click to play again", canvasSize.width / 2, canvasSize.height / 2 + 90)
    }
  }

  // Start game
  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setTimeLeft(60)
    setTargets([])
    setShots(0)
    setHits(0)
  }

  // End game
  const endGame = () => {
    setGameOver(true)
    setGameStarted(false)

    // Update high score
    if (score > highScore) {
      setHighScore(score)
      try {
        localStorage.setItem("targetShooterHighScore", score.toString())
      } catch (e) {
        console.warn("Could not save high score to localStorage")
      }
    }
  }

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameStarted && !gameOver) {
      startGame()
      return
    }

    if (gameOver) {
      startGame()
      return
    }

    // Get click position
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Increment shots
    setShots((prev) => prev + 1)

    // Check for hits
    let hit = false
    setTargets((prev) =>
      prev.map((target) => {
        if (!target.active) return target

        // Calculate distance from click to target center
        const distance = Math.sqrt(Math.pow(target.x - x, 2) + Math.pow(target.y - y, 2))

        // Check if click is inside target
        if (distance <= target.radius) {
          hit = true
          setScore((prev) => prev + target.points)
          setHits((prev) => prev + 1)
          return { ...target, active: false }
        }

        return target
      }),
    )

    // Play sound effect (would be implemented here)
  }

  // Track mouse position for crosshair
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ minHeight: "400px" }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className="w-full h-full rounded-lg shadow-lg cursor-crosshair"
        style={{ touchAction: "none" }}
      />
      {isMobile && (
        <div className="mt-4 text-sm text-center text-gray-500">
          <p>Tap on targets to shoot</p>
        </div>
      )}
    </div>
  )
}
