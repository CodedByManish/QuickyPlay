"use client"

import { useEffect, useRef, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

export type FlappyBirdGameState = {
  bird: {
    x: number
    y: number
    width: number
    height: number
    velocity: number
    gravity: number
    lift: number
  }
  pipes: Array<{
    x: number
    top: number
    bottom: number
    width: number
    scored: boolean
  }>
  score: number
  gameOver: boolean
  started: boolean
}

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [gameState, setGameState] = useState<FlappyBirdGameState | null>(null)
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

    // Initialize game state
    const initialState: FlappyBirdGameState = {
      bird: {
        x: canvasSize.width * 0.2,
        y: canvasSize.height / 2,
        width: 40,
        height: 30,
        velocity: 0,
        gravity: 0.6,
        lift: -12,
      },
      pipes: [],
      score: 0,
      gameOver: false,
      started: false,
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

    setGameState((prevState) => {
      if (!prevState) return null

      return {
        ...prevState,
        bird: {
          ...prevState.bird,
          x: canvasSize.width * 0.2,
          y: canvasSize.height / 2,
        },
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
      // Update bird
      const newBird = { ...gameState.bird }
      newBird.velocity += newBird.gravity
      newBird.y += newBird.velocity

      // Check if bird hits the ground or ceiling
      if (newBird.y + newBird.height > canvasSize.height) {
        newBird.y = canvasSize.height - newBird.height
        newBird.velocity = 0
        setGameState({
          ...gameState,
          bird: newBird,
          gameOver: true,
        })
        return
      }

      if (newBird.y < 0) {
        newBird.y = 0
        newBird.velocity = 0
      }

      // Update pipes
      let newPipes = [...gameState.pipes]

      // Move pipes
      newPipes = newPipes.map((pipe) => ({
        ...pipe,
        x: pipe.x - 5,
      }))

      // Remove pipes that are off screen
      newPipes = newPipes.filter((pipe) => pipe.x + pipe.width > 0)

      // Add new pipe
      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < canvasSize.width - 200) {
        const gapHeight = 150
        const gapPosition = Math.random() * (canvasSize.height - gapHeight - 100) + 50

        newPipes.push({
          x: canvasSize.width,
          top: gapPosition,
          bottom: gapPosition + gapHeight,
          width: 80,
          scored: false,
        })
      }

      // Check for collisions
      let gameOver = false
      let score = gameState.score

      for (const pipe of newPipes) {
        // Check if bird passed the pipe
        if (!pipe.scored && newBird.x > pipe.x + pipe.width) {
          pipe.scored = true
          score += 1
        }

        // Check for collision with pipe
        if (
          newBird.x + newBird.width > pipe.x &&
          newBird.x < pipe.x + pipe.width &&
          (newBird.y < pipe.top || newBird.y + newBird.height > pipe.bottom)
        ) {
          gameOver = true
          break
        }
      }

      // Update game state
      setGameState({
        ...gameState,
        bird: newBird,
        pipes: newPipes,
        score,
        gameOver,
      })

      // Draw game
      drawGame(ctx, {
        ...gameState,
        bird: newBird,
        pipes: newPipes,
        score,
        gameOver,
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
  const drawGame = (ctx: CanvasRenderingContext2D, state: FlappyBirdGameState) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

    // Draw background
    ctx.fillStyle = "#70c5ce"
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

    // Draw pipes
    ctx.fillStyle = "#73bf2e"
    for (const pipe of state.pipes) {
      // Top pipe
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.top)

      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvasSize.height - pipe.bottom)
    }

    // Draw ground
    ctx.fillStyle = "#ded895"
    ctx.fillRect(0, canvasSize.height - 20, canvasSize.width, 20)

    // Draw bird
    ctx.fillStyle = "#ff6b6b"
    ctx.beginPath()
    ctx.ellipse(
      state.bird.x + state.bird.width / 2,
      state.bird.y + state.bird.height / 2,
      state.bird.width / 2,
      state.bird.height / 2,
      0,
      0,
      Math.PI * 2,
    )
    ctx.fill()

    // Draw wing
    ctx.fillStyle = "#fff"
    ctx.beginPath()
    ctx.ellipse(
      state.bird.x + state.bird.width / 4,
      state.bird.y + state.bird.height / 2,
      state.bird.width / 4,
      state.bird.height / 4,
      0,
      0,
      Math.PI * 2,
    )
    ctx.fill()

    // Draw eye
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.arc(
      state.bird.x + state.bird.width * 0.7,
      state.bird.y + state.bird.height * 0.3,
      state.bird.width / 10,
      0,
      Math.PI * 2,
    )
    ctx.fill()

    // Draw score
    ctx.fillStyle = "#fff"
    ctx.font = "bold 32px Arial"
    ctx.textAlign = "center"
    ctx.fillText(state.score.toString(), canvasSize.width / 2, 50)

    // Draw game over
    if (state.gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

      ctx.fillStyle = "#fff"
      ctx.font = "bold 48px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Game Over", canvasSize.width / 2, canvasSize.height / 2 - 50)

      ctx.font = "bold 32px Arial"
      ctx.fillText(`Score: ${state.score}`, canvasSize.width / 2, canvasSize.height / 2 + 10)

      ctx.font = "24px Arial"
      ctx.fillText("Tap to play again", canvasSize.width / 2, canvasSize.height / 2 + 60)
    }

    // Draw start screen
    if (!state.started && !state.gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

      ctx.fillStyle = "#fff"
      ctx.font = "bold 48px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Flappy Bird", canvasSize.width / 2, canvasSize.height / 2 - 50)

      ctx.font = "24px Arial"
      ctx.fillText("Tap to start", canvasSize.width / 2, canvasSize.height / 2 + 20)
    }
  }

  // Handle canvas click
  const handleCanvasClick = () => {
    if (!gameState) return

    if (gameState.gameOver) {
      // Reset game
      setGameState({
        bird: {
          x: canvasSize.width * 0.2,
          y: canvasSize.height / 2,
          width: 40,
          height: 30,
          velocity: 0,
          gravity: 0.6,
          lift: -12,
        },
        pipes: [],
        score: 0,
        gameOver: false,
        started: true,
      })
    } else if (!gameState.started) {
      // Start game
      setGameState({
        ...gameState,
        started: true,
      })
    } else {
      // Flap
      setGameState({
        ...gameState,
        bird: {
          ...gameState.bird,
          velocity: gameState.bird.lift,
        },
      })
    }
  }
}
