"use client"

import { useEffect, useRef, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

export type GeometryRushState = {
  player: {
    x: number
    y: number
    width: number
    height: number
    jumping: boolean
    velocity: number
  }
  obstacles: Array<{
    x: number
    y: number
    width: number
    height: number
    type: "spike" | "block" | "platform"
  }>
  platforms: Array<{
    x: number
    y: number
    width: number
  }>
  score: number
  gameOver: boolean
  started: boolean
  speed: number
  gravity: number
  groundY: number
  backgroundElements: Array<{
    x: number
    y: number
    size: number
    speed: number
    color: string
  }>
}

export default function GeometryRushGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [gameState, setGameState] = useState<GeometryRushState | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const animationRef = useRef<number>()
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

    // Create background elements
    const backgroundElements = Array(20)
      .fill(0)
      .map(() => ({
        x: Math.random() * canvasSize.width,
        y: Math.random() * canvasSize.height,
        size: Math.random() * 5 + 2,
        speed: Math.random() * 2 + 1,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      }))

    // Initialize game state
    const groundY = canvasSize.height * 0.8
    const playerSize = Math.min(canvasSize.width * 0.05, 30)

    const initialState: GeometryRushState = {
      player: {
        x: canvasSize.width * 0.2,
        y: groundY - playerSize,
        width: playerSize,
        height: playerSize,
        jumping: false,
        velocity: 0,
      },
      obstacles: [],
      platforms: [
        {
          x: 0,
          y: groundY,
          width: canvasSize.width,
        },
      ],
      score: 0,
      gameOver: false,
      started: false,
      speed: 5,
      gravity: 0.8,
      groundY,
      backgroundElements,
    }

    setGameState(initialState)

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

  // Update game state when canvas size changes
  useEffect(() => {
    if (!gameState || canvasSize.width === 0 || canvasSize.height === 0) return

    const groundY = canvasSize.height * 0.8
    const playerSize = Math.min(canvasSize.width * 0.05, 30)

    setGameState((prevState) => {
      if (!prevState) return null

      return {
        ...prevState,
        player: {
          ...prevState.player,
          x: canvasSize.width * 0.2,
          y: groundY - playerSize,
          width: playerSize,
          height: playerSize,
        },
        platforms: [
          {
            x: 0,
            y: groundY,
            width: canvasSize.width,
          },
        ],
        groundY,
      }
    })
  }, [canvasSize, gameState])

  // Game loop
  useEffect(() => {
    if (!gameState || !canvasRef.current || gameState.gameOver || !gameState.started) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const gameLoop = () => {
      // Update player
      const newPlayer = { ...gameState.player }

      // Apply gravity
      if (newPlayer.jumping) {
        newPlayer.velocity += gameState.gravity
        newPlayer.y += newPlayer.velocity
      }

      // Check if player landed on ground or platform
      if (newPlayer.y + newPlayer.height >= gameState.groundY) {
        newPlayer.y = gameState.groundY - newPlayer.height
        newPlayer.jumping = false
        newPlayer.velocity = 0
      }

      // Update obstacles
      let newObstacles = [...gameState.obstacles]

      // Move obstacles
      newObstacles = newObstacles.map((obstacle) => ({
        ...obstacle,
        x: obstacle.x - gameState.speed,
      }))

      // Remove obstacles that are off screen
      newObstacles = newObstacles.filter((obstacle) => obstacle.x + obstacle.width > 0)

      // Add new obstacles
      if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < canvasSize.width - 300) {
        const obstacleTypes = ["spike", "block", "platform"] as const
        const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)]

        let width, height, y

        switch (type) {
          case "spike":
            width = Math.min(canvasSize.width * 0.05, 30)
            height = Math.min(canvasSize.width * 0.05, 30)
            y = gameState.groundY - height
            break
          case "block":
            width = Math.min(canvasSize.width * 0.08, 50)
            height = Math.min(canvasSize.width * 0.08, 50)
            y = gameState.groundY - height
            break
          case "platform":
            width = Math.min(canvasSize.width * 0.15, 100)
            height = Math.min(canvasSize.width * 0.02, 15)
            y = gameState.groundY - Math.random() * (canvasSize.height * 0.3) - height
            break
        }

        newObstacles.push({
          x: canvasSize.width,
          y,
          width,
          height,
          type,
        })
      }

      // Update background elements
      const newBackgroundElements = gameState.backgroundElements.map((element) => {
        let newX = element.x - element.speed
        if (newX + element.size < 0) {
          newX = canvasSize.width
        }
        return {
          ...element,
          x: newX,
        }
      })

      // Check for collisions
      let gameOver = false
      const score = gameState.score + 1

      for (const obstacle of newObstacles) {
        if (
          newPlayer.x < obstacle.x + obstacle.width &&
          newPlayer.x + newPlayer.width > obstacle.x &&
          newPlayer.y < obstacle.y + obstacle.height &&
          newPlayer.y + newPlayer.height > obstacle.y &&
          obstacle.type !== "platform"
        ) {
          gameOver = true
          break
        }
      }

      // Increase speed gradually
      let speed = gameState.speed
      if (score % 1000 === 0) {
        speed += 0.5
      }

      // Update game state
      setGameState({
        ...gameState,
        player: newPlayer,
        obstacles: newObstacles,
        score,
        gameOver,
        speed,
        backgroundElements: newBackgroundElements,
      })

      // Draw game
      drawGame(ctx, {
        ...gameState,
        player: newPlayer,
        obstacles: newObstacles,
        score,
        gameOver,
        speed,
        backgroundElements: newBackgroundElements,
      })

      // Continue animation loop if game is not over
      if (!gameOver) {
        animationRef.current = requestAnimationFrame(gameLoop)
      }
    }

    // Start game loop
    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState, canvasSize])

  // Draw game
  const drawGame = (ctx: CanvasRenderingContext2D, state: GeometryRushState) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize.height)
    gradient.addColorStop(0, "#1a1a2e")
    gradient.addColorStop(1, "#16213e")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

    // Draw background elements (stars/particles)
    state.backgroundElements.forEach((element) => {
      ctx.fillStyle = element.color
      ctx.beginPath()
      ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw ground
    ctx.fillStyle = "#4a4e69"
    ctx.fillRect(0, state.groundY, canvasSize.width, canvasSize.height - state.groundY)

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1

    // Vertical grid lines
    for (let x = 0; x < canvasSize.width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, state.groundY)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let y = 0; y < state.groundY; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasSize.width, y)
      ctx.stroke()
    }

    // Draw obstacles
    state.obstacles.forEach((obstacle) => {
      switch (obstacle.type) {
        case "spike":
          ctx.fillStyle = "#ff5555"
          ctx.beginPath()
          ctx.moveTo(obstacle.x, obstacle.y + obstacle.height)
          ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y)
          ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height)
          ctx.closePath()
          ctx.fill()
          break
        case "block":
          ctx.fillStyle = "#5555ff"
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
          break
        case "platform":
          ctx.fillStyle = "#55ff55"
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
          break
      }
    })

    // Draw player
    ctx.fillStyle = "#ff9e00"
    ctx.fillRect(state.player.x, state.player.y, state.player.width, state.player.height)

    // Draw score
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`Score: ${Math.floor(state.score / 10)}`, 20, 40)

    // Draw game over
    if (state.gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 48px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Game Over", canvasSize.width / 2, canvasSize.height / 2 - 50)

      ctx.font = "bold 32px Arial"
      ctx.fillText(`Score: ${Math.floor(state.score / 10)}`, canvasSize.width / 2, canvasSize.height / 2 + 10)

      ctx.font = "24px Arial"
      ctx.fillText("Tap to play again", canvasSize.width / 2, canvasSize.height / 2 + 60)
    }

    // Draw start screen
    if (!state.started && !state.gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 48px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Geometry Rush", canvasSize.width / 2, canvasSize.height / 2 - 50)

      ctx.font = "24px Arial"
      ctx.fillText("Tap to start", canvasSize.width / 2, canvasSize.height / 2 + 20)
      ctx.fillText("Press Space or tap to jump", canvasSize.width / 2, canvasSize.height / 2 + 60)
    }
  }

  // Handle canvas click
  const handleCanvasClick = () => {
    if (!gameState) return

    if (gameState.gameOver) {
      // Reset game
      const groundY = canvasSize.height * 0.8
      const playerSize = Math.min(canvasSize.width * 0.05, 30)

      setGameState({
        ...gameState,
        player: {
          x: canvasSize.width * 0.2,
          y: groundY - playerSize,
          width: playerSize,
          height: playerSize,
          jumping: false,
          velocity: 0,
        },
        obstacles: [],
        score: 0,
        gameOver: false,
        started: true,
        speed: 5,
      })
    } else if (!gameState.started) {
      // Start game
      setGameState({
        ...gameState,
        started: true,
      })
    } else if (!gameState.player.jumping) {
      // Jump
      setGameState({
        ...gameState,
        player: {
          ...gameState.player,
          jumping: true,
          velocity: -15,
        },
      })
    }
  }

  // Handle key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        handleCanvasClick()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [gameState])

  // Draw initial game state
  useEffect(() => {
    if (!gameState || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    drawGame(ctx, gameState)
  }, [gameState, canvasSize])

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ minHeight: "400px" }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full rounded-lg shadow-lg"
        style={{ touchAction: "none" }}
      />
      {isMobile && (
        <div className="mt-4 text-sm text-center text-gray-500">
          <p>Tap to jump</p>
        </div>
      )}
    </div>
  )
}
