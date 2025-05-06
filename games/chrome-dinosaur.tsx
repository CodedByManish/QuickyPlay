"use client"

import { useEffect, useRef, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"

export type DinosaurGameState = {
  dino: {
    x: number
    y: number
    width: number
    height: number
    velocity: number
    jumping: boolean
    ducking: boolean
  }
  obstacles: Array<{
    x: number
    y: number
    width: number
    height: number
    type: "cactus" | "bird"
  }>
  ground: {
    y: number
  }
  score: number
  highScore: number
  speed: number
  gameOver: boolean
  night: boolean
}

export function initializeDinosaurGame(width: number, height: number): DinosaurGameState {
  const groundY = height - 50
  const dinoHeight = 60
  const dinoWidth = 40

  return {
    dino: {
      x: 50,
      y: groundY - dinoHeight,
      width: dinoWidth,
      height: dinoHeight,
      velocity: 0,
      jumping: false,
      ducking: false,
    },
    obstacles: [],
    ground: {
      y: groundY,
    },
    score: 0,
    highScore: 0,
    speed: 6,
    gameOver: false,
    night: false,
  }
}

export function updateDinosaurGame(state: DinosaurGameState): DinosaurGameState {
  if (state.gameOver) return state

  // Create a copy of the state
  const newState = { ...state }

  // Update dino position
  if (newState.dino.jumping) {
    newState.dino.velocity += 0.8 // Gravity
    newState.dino.y += newState.dino.velocity

    // Check if dino has landed
    if (newState.dino.y >= newState.ground.y - newState.dino.height) {
      newState.dino.y = newState.ground.y - newState.dino.height
      newState.dino.jumping = false
      newState.dino.velocity = 0
    }
  }

  // Update obstacles
  const newObstacles = []
  for (const obstacle of newState.obstacles) {
    obstacle.x -= newState.speed

    // Keep obstacle if it's still on screen
    if (obstacle.x + obstacle.width > 0) {
      newObstacles.push(obstacle)
    }
  }
  newState.obstacles = newObstacles

  // Add new obstacle randomly
  if (Math.random() < 0.02 && newState.obstacles.length < 3) {
    const isBird = Math.random() < 0.2 && newState.score > 500
    const obstacleHeight = isBird ? 30 : 40 + Math.random() * 30
    const obstacleWidth = isBird ? 40 : 20 + Math.random() * 30

    // Birds can be at different heights
    const obstacleY = isBird
      ? newState.ground.y - obstacleHeight - Math.random() * 120
      : newState.ground.y - obstacleHeight

    newState.obstacles.push({
      x: 800,
      y: obstacleY,
      width: obstacleWidth,
      height: obstacleHeight,
      type: isBird ? "bird" : "cactus",
    })
  }

  // Check for collisions
  for (const obstacle of newState.obstacles) {
    if (checkCollision(newState.dino, obstacle)) {
      newState.gameOver = true
      return newState
    }
  }

  // Update score
  newState.score += 1

  // Update high score
  if (newState.score > newState.highScore) {
    newState.highScore = newState.score
  }

  // Increase speed gradually
  if (newState.score % 500 === 0) {
    newState.speed += 0.5
  }

  // Toggle day/night mode occasionally
  if (newState.score % 1000 === 0 && newState.score > 0) {
    newState.night = !newState.night
  }

  return newState
}

function checkCollision(dino: any, obstacle: any): boolean {
  // Adjust hitbox for ducking
  const dinoHitboxWidth = dino.ducking ? dino.width * 1.2 : dino.width * 0.7
  const dinoHitboxHeight = dino.ducking ? dino.height * 0.5 : dino.height * 0.9
  const dinoHitboxX = dino.x + (dino.width - dinoHitboxWidth) / 2
  const dinoHitboxY = dino.y + (dino.height - dinoHitboxHeight)

  // Adjust hitbox for obstacle
  const obstacleHitboxWidth = obstacle.width * 0.8
  const obstacleHitboxHeight = obstacle.height * 0.9
  const obstacleHitboxX = obstacle.x + (obstacle.width - obstacleHitboxWidth) / 2
  const obstacleHitboxY = obstacle.y

  return (
    dinoHitboxX < obstacleHitboxX + obstacleHitboxWidth &&
    dinoHitboxX + dinoHitboxWidth > obstacleHitboxX &&
    dinoHitboxY < obstacleHitboxY + obstacleHitboxHeight &&
    dinoHitboxY + dinoHitboxHeight > obstacleHitboxY
  )
}

export function renderDinosaurGame(ctx: CanvasRenderingContext2D, state: DinosaurGameState) {
  const { dino, obstacles, ground, score, highScore, gameOver, night } = state

  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Set background color
  ctx.fillStyle = night ? "#1a1a2e" : "#f0f0f0"
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Draw ground
  ctx.fillStyle = night ? "#333344" : "#707070"
  ctx.fillRect(0, ground.y, ctx.canvas.width, 2)

  // Draw dino
  ctx.fillStyle = night ? "#ffffff" : "#535353"

  if (dino.ducking) {
    // Draw ducking dino (wider, shorter)
    ctx.fillRect(dino.x, dino.y + dino.height / 2, dino.width * 1.2, dino.height / 2)

    // Draw head
    ctx.beginPath()
    ctx.arc(dino.x + dino.width * 1.1, dino.y + dino.height / 2, dino.height / 4, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // Draw standing dino
    ctx.fillRect(dino.x, dino.y, dino.width / 2, dino.height)

    // Draw head and neck
    ctx.fillRect(dino.x + dino.width / 4, dino.y - dino.height / 4, dino.width / 2, dino.height / 4)
    ctx.beginPath()
    ctx.arc(dino.x + dino.width / 2, dino.y - dino.height / 4, dino.height / 6, 0, Math.PI * 2)
    ctx.fill()

    // Draw arm
    ctx.fillRect(dino.x + dino.width / 4, dino.y + dino.height / 3, dino.width / 4, dino.height / 10)
  }

  // Draw obstacles
  for (const obstacle of obstacles) {
    ctx.fillStyle = night ? "#ffffff" : "#535353"

    if (obstacle.type === "cactus") {
      // Draw cactus
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)

      // Draw cactus arms
      if (obstacle.height > 50) {
        ctx.fillRect(obstacle.x - 10, obstacle.y + obstacle.height / 3, 10, obstacle.height / 10)
        ctx.fillRect(obstacle.x + obstacle.width, obstacle.y + obstacle.height / 2, 10, obstacle.height / 10)
      }
    } else {
      // Draw bird
      ctx.beginPath()
      ctx.arc(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw wings
      ctx.beginPath()
      ctx.moveTo(obstacle.x, obstacle.y + obstacle.height / 2)
      ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y)
      ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height / 2)
      ctx.fill()
    }
  }

  // Draw clouds
  const cloudColor = night ? "#444466" : "#ffffff"
  ctx.fillStyle = cloudColor

  // Fixed clouds
  const clouds = [
    { x: 100, y: 50, radius: 20 },
    { x: 130, y: 50, radius: 25 },
    { x: 160, y: 50, radius: 20 },
    { x: 400, y: 70, radius: 15 },
    { x: 430, y: 70, radius: 20 },
    { x: 600, y: 40, radius: 25 },
    { x: 630, y: 40, radius: 30 },
    { x: 660, y: 40, radius: 25 },
  ]

  for (const cloud of clouds) {
    ctx.beginPath()
    ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2)
    ctx.fill()
  }

  // Draw score
  ctx.fillStyle = night ? "#ffffff" : "#535353"
  ctx.font = "20px Arial"
  ctx.textAlign = "right"
  ctx.fillText(`Score: ${score}`, ctx.canvas.width - 20, 30)
  ctx.fillText(`High Score: ${highScore}`, ctx.canvas.width - 20, 60)

  // Draw game over message
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.fillStyle = "#ffffff"
    ctx.font = "30px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Game Over", ctx.canvas.width / 2, ctx.canvas.height / 2 - 30)
    ctx.fillText(`Score: ${score}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 10)
    ctx.font = "20px Arial"
    ctx.fillText("Press Space to Restart", ctx.canvas.width / 2, ctx.canvas.height / 2 + 50)
  }
}

export default function ChromeDinosaurGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<DinosaurGameState | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const animationFrameRef = useRef<number | null>(null)
  const isMobile = useMobile()

  // Initialize game
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 300

    // Initialize game state
    const initialState = initializeDinosaurGame(canvas.width, canvas.height)

    // Try to load high score from localStorage
    try {
      const savedHighScore = localStorage.getItem("dinoHighScore")
      if (savedHighScore) {
        initialState.highScore = Number.parseInt(savedHighScore, 10)
      }
    } catch (e) {
      console.warn("Could not access localStorage for high score")
    }

    setGameState(initialState)

    // Handle window resize
    const handleResize = () => {
      canvas.width = Math.min(800, window.innerWidth - 40)
      renderDinosaurGame(ctx, initialState)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Game loop
  useEffect(() => {
    if (!gameState || !canvasRef.current || !isRunning) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const gameLoop = () => {
      // Update game state
      const newState = updateDinosaurGame(gameState)
      setGameState(newState)

      // Save high score to localStorage
      if (newState.score > gameState.highScore) {
        try {
          localStorage.setItem("dinoHighScore", newState.score.toString())
        } catch (e) {
          console.warn("Could not save high score to localStorage")
        }
      }

      // Continue animation loop if game is not over
      if (!newState.gameOver) {
        animationFrameRef.current = requestAnimationFrame(gameLoop)
      } else {
        setIsRunning(false)
      }
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameState, isRunning])

  // Render game
  useEffect(() => {
    if (!gameState || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    renderDinosaurGame(ctx, gameState)
  }, [gameState])

  // Handle keyboard input
  useEffect(() => {
    if (!gameState) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver) {
        if (e.code === "Space" || e.code === "ArrowUp") {
          // Restart game
          if (canvasRef.current) {
            const canvas = canvasRef.current
            const initialState = initializeDinosaurGame(canvas.width, canvas.height)
            initialState.highScore = gameState.highScore
            setGameState(initialState)
            setIsRunning(true)
          }
        }
        return
      }

      if ((e.code === "Space" || e.code === "ArrowUp") && !gameState.dino.jumping) {
        // Jump
        setGameState({
          ...gameState,
          dino: {
            ...gameState.dino,
            jumping: true,
            velocity: -15,
            ducking: false,
          },
        })
      } else if (e.code === "ArrowDown") {
        // Duck
        setGameState({
          ...gameState,
          dino: {
            ...gameState.dino,
            ducking: true,
            height: 30, // Half height when ducking
          },
        })
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown" && gameState.dino.ducking) {
        // Stand up
        setGameState({
          ...gameState,
          dino: {
            ...gameState.dino,
            ducking: false,
            height: 60, // Normal height
          },
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameState])

  // Handle touch input for mobile
  useEffect(() => {
    if (!gameState || !canvasRef.current) return

    const canvas = canvasRef.current

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()

      if (gameState.gameOver) {
        // Restart game
        const initialState = initializeDinosaurGame(canvas.width, canvas.height)
        initialState.highScore = gameState.highScore
        setGameState(initialState)
        setIsRunning(true)
        return
      }

      const touch = e.touches[0]
      const y = touch.clientY - canvas.getBoundingClientRect().top

      if (y > canvas.height / 2 && !gameState.dino.ducking) {
        // Duck
        setGameState({
          ...gameState,
          dino: {
            ...gameState.dino,
            ducking: true,
            height: 30, // Half height when ducking
          },
        })
      } else if (!gameState.dino.jumping) {
        // Jump
        setGameState({
          ...gameState,
          dino: {
            ...gameState.dino,
            jumping: true,
            velocity: -15,
            ducking: false,
            height: 60, // Normal height
          },
        })
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()

      if (gameState.dino.ducking) {
        // Stand up
        setGameState({
          ...gameState,
          dino: {
            ...gameState.dino,
            ducking: false,
            height: 60, // Normal height
          },
        })
      }
    }

    canvas.addEventListener("touchstart", handleTouchStart)
    canvas.addEventListener("touchend", handleTouchEnd)

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchend", handleTouchEnd)
    }
  }, [gameState])

  // Start game
  const startGame = () => {
    if (!gameState || isRunning) return

    if (gameState.gameOver) {
      // Reset game
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const initialState = initializeDinosaurGame(canvas.width, canvas.height)
        initialState.highScore = gameState.highScore
        setGameState(initialState)
      }
    }

    setIsRunning(true)
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Chrome Dinosaur</h2>

      <div className="relative">
        <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-lg" />

        {gameState && !isRunning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
            <Button className="bg-primary hover:bg-primary/80" onClick={startGame}>
              {gameState.gameOver ? "Play Again" : "Start Game"}
            </Button>
          </div>
        )}
      </div>

      {isMobile && (
        <div className="mt-4 text-sm text-center text-gray-500">
          <p>Tap top half to jump, bottom half to duck</p>
        </div>
      )}

      {!isMobile && (
        <div className="mt-4 text-sm text-center text-gray-500">
          <p>Press Space or ↑ to jump, ↓ to duck</p>
        </div>
      )}
    </div>
  )
}
