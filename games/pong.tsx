"use client"

import { useEffect, useRef, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"

export type PongGameState = {
  paddle1: {
    x: number
    y: number
    width: number
    height: number
    score: number
  }
  paddle2: {
    x: number
    y: number
    width: number
    height: number
    score: number
    isAI: boolean
    difficulty: "easy" | "medium" | "hard"
  }
  ball: {
    x: number
    y: number
    radius: number
    velocityX: number
    velocityY: number
    speed: number
  }
  gameOver: boolean
  winner: 1 | 2 | null
  paused: boolean
}

export function initializePongGame(width: number, height: number): PongGameState {
  const paddleWidth = 10
  const paddleHeight = 100
  const ballRadius = 8

  return {
    paddle1: {
      x: 10,
      y: height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
      score: 0,
    },
    paddle2: {
      x: width - 10 - paddleWidth,
      y: height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
      score: 0,
      isAI: true,
      difficulty: "medium",
    },
    ball: {
      x: width / 2,
      y: height / 2,
      radius: ballRadius,
      velocityX: 5,
      velocityY: 5,
      speed: 7,
    },
    gameOver: false,
    winner: null,
    paused: true,
  }
}

export function updatePongGame(state: PongGameState, canvasHeight: number): PongGameState {
  if (state.gameOver || state.paused) return state

  // Create a copy of the state
  const newState = { ...state }

  // Move ball
  newState.ball.x += newState.ball.velocityX
  newState.ball.y += newState.ball.velocityY

  // Ball collision with top and bottom walls
  if (newState.ball.y + newState.ball.radius > canvasHeight || newState.ball.y - newState.ball.radius < 0) {
    newState.ball.velocityY = -newState.ball.velocityY
  }

  // AI paddle movement
  if (newState.paddle2.isAI) {
    // Different AI difficulties
    let reactionSpeed = 0
    switch (newState.paddle2.difficulty) {
      case "easy":
        reactionSpeed = 0.03
        break
      case "medium":
        reactionSpeed = 0.06
        break
      case "hard":
        reactionSpeed = 0.1
        break
    }

    // AI tries to follow the ball with some delay
    const targetY = newState.ball.y - newState.paddle2.height / 2
    newState.paddle2.y += (targetY - newState.paddle2.y) * reactionSpeed

    // Keep paddle within bounds
    if (newState.paddle2.y < 0) {
      newState.paddle2.y = 0
    } else if (newState.paddle2.y + newState.paddle2.height > canvasHeight) {
      newState.paddle2.y = canvasHeight - newState.paddle2.height
    }
  }

  // Ball collision with paddles
  if (
    // Left paddle (player)
    (newState.ball.x - newState.ball.radius < newState.paddle1.x + newState.paddle1.width &&
      newState.ball.y > newState.paddle1.y &&
      newState.ball.y < newState.paddle1.y + newState.paddle1.height) ||
    // Right paddle (AI or player 2)
    (newState.ball.x + newState.ball.radius > newState.paddle2.x &&
      newState.ball.y > newState.paddle2.y &&
      newState.ball.y < newState.paddle2.y + newState.paddle2.height)
  ) {
    // Reverse x velocity
    newState.ball.velocityX = -newState.ball.velocityX

    // Increase speed slightly
    newState.ball.speed += 0.2

    // Calculate new angle based on where the ball hit the paddle
    let paddle
    if (newState.ball.x < canvasHeight / 2) {
      paddle = newState.paddle1
    } else {
      paddle = newState.paddle2
    }

    const hitPosition = (newState.ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2)
    newState.ball.velocityY = hitPosition * newState.ball.speed
  }

  // Ball out of bounds - score
  if (newState.ball.x - newState.ball.radius < 0) {
    // Player 2 scores
    newState.paddle2.score += 1
    resetBall(newState, canvasHeight)

    // Check for game over
    if (newState.paddle2.score >= 5) {
      newState.gameOver = true
      newState.winner = 2
    }
  } else if (newState.ball.x + newState.ball.radius > canvasHeight * 2) {
    // Player 1 scores
    newState.paddle1.score += 1
    resetBall(newState, canvasHeight)

    // Check for game over
    if (newState.paddle1.score >= 5) {
      newState.gameOver = true
      newState.winner = 1
    }
  }

  return newState
}

function resetBall(state: PongGameState, canvasHeight: number) {
  state.ball.x = canvasHeight
  state.ball.y = canvasHeight / 2
  state.ball.velocityX = -state.ball.velocityX
  state.ball.velocityY = Math.random() * 10 - 5
  state.ball.speed = 7
}

export function renderPongGame(ctx: CanvasRenderingContext2D, state: PongGameState) {
  const { paddle1, paddle2, ball, gameOver, paused } = state

  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Draw background
  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Draw center line
  ctx.strokeStyle = "#fff"
  ctx.setLineDash([10, 15])
  ctx.beginPath()
  ctx.moveTo(ctx.canvas.width / 2, 0)
  ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height)
  ctx.stroke()
  ctx.setLineDash([])

  // Draw paddles
  ctx.fillStyle = "#fff"
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height)
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height)

  // Draw ball
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
  ctx.fill()

  // Draw scores
  ctx.font = "60px Arial"
  ctx.textAlign = "center"
  ctx.fillText(paddle1.score.toString(), ctx.canvas.width / 4, 70)
  ctx.fillText(paddle2.score.toString(), (ctx.canvas.width / 4) * 3, 70)

  // Draw game over message
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.fillStyle = "#fff"
    ctx.font = "30px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const winner = state.winner === 1 ? "You Win!" : "AI Wins!"
    ctx.fillText(winner, ctx.canvas.width / 2, ctx.canvas.height / 2 - 30)
    ctx.fillText(`${paddle1.score} - ${paddle2.score}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 10)

    ctx.font = "20px Arial"
    ctx.fillText("Press Space to Restart", ctx.canvas.width / 2, ctx.canvas.height / 2 + 50)
  } else if (paused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.fillStyle = "#fff"
    ctx.font = "30px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Click to Start", ctx.canvas.width / 2, ctx.canvas.height / 2)
  }
}

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<PongGameState | null>(null)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
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
    canvas.height = 400

    // Initialize game state
    const initialState = initializePongGame(canvas.width, canvas.height)
    initialState.paddle2.difficulty = difficulty
    setGameState(initialState)

    // Handle window resize
    const handleResize = () => {
      canvas.width = Math.min(800, window.innerWidth - 40)
      canvas.height = canvas.width / 2

      if (gameState) {
        // Update paddle and ball positions
        const newState = { ...gameState }
        newState.paddle1.x = 10
        newState.paddle2.x = canvas.width - 10 - newState.paddle2.width
        newState.ball.x = canvas.width / 2
        newState.ball.y = canvas.height / 2

        setGameState(newState)
        renderPongGame(ctx, newState)
      } else {
        const newState = initializePongGame(canvas.width, canvas.height)
        newState.paddle2.difficulty = difficulty
        setGameState(newState)
        renderPongGame(ctx, newState)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [difficulty])

  // Game loop
  useEffect(() => {
    if (!gameState || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const gameLoop = () => {
      // Update game state
      const newState = updatePongGame(gameState, canvas.height)
      setGameState(newState)

      // Continue animation loop if game is not over
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    if (!gameState.paused && !gameState.gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameState])

  // Render game
  useEffect(() => {
    if (!gameState || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    renderPongGame(ctx, gameState)
  }, [gameState])

  // Handle keyboard input
  useEffect(() => {
    if (!gameState || !canvasRef.current) return

    const canvas = canvasRef.current

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver) {
        if (e.code === "Space") {
          // Restart game
          const initialState = initializePongGame(canvas.width, canvas.height)
          initialState.paddle2.difficulty = difficulty
          initialState.paused = false
          setGameState(initialState)
        }
        return
      }

      if (gameState.paused) {
        if (e.code === "Space") {
          // Start game
          setGameState({
            ...gameState,
            paused: false,
          })
        }
        return
      }

      const paddleSpeed = 20

      if (e.code === "ArrowUp" || e.code === "KeyW") {
        // Move paddle up
        setGameState({
          ...gameState,
          paddle1: {
            ...gameState.paddle1,
            y: Math.max(0, gameState.paddle1.y - paddleSpeed),
          },
        })
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        // Move paddle down
        setGameState({
          ...gameState,
          paddle1: {
            ...gameState.paddle1,
            y: Math.min(canvas.height - gameState.paddle1.height, gameState.paddle1.y + paddleSpeed),
          },
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [gameState, difficulty])

  // Handle mouse/touch input
  useEffect(() => {
    if (!gameState || !canvasRef.current) return

    const canvas = canvasRef.current

    const handleMouseMove = (e: MouseEvent) => {
      if (gameState.gameOver || gameState.paused) return

      const rect = canvas.getBoundingClientRect()
      const mouseY = e.clientY - rect.top

      // Move paddle to mouse position
      setGameState({
        ...gameState,
        paddle1: {
          ...gameState.paddle1,
          y: Math.min(Math.max(0, mouseY - gameState.paddle1.height / 2), canvas.height - gameState.paddle1.height),
        },
      })
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()

      if (gameState.gameOver || gameState.paused) return

      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      const touchY = touch.clientY - rect.top

      // Move paddle to touch position
      setGameState({
        ...gameState,
        paddle1: {
          ...gameState.paddle1,
          y: Math.min(Math.max(0, touchY - gameState.paddle1.height / 2), canvas.height - gameState.paddle1.height),
        },
      })
    }

    const handleClick = () => {
      if (gameState.gameOver) {
        // Restart game
        const initialState = initializePongGame(canvas.width, canvas.height)
        initialState.paddle2.difficulty = difficulty
        initialState.paused = false
        setGameState(initialState)
      } else if (gameState.paused) {
        // Start game
        setGameState({
          ...gameState,
          paused: false,
        })
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    canvas.addEventListener("click", handleClick)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("click", handleClick)
    }
  }, [gameState, difficulty])

  // Change difficulty
  const changeDifficulty = (newDifficulty: "easy" | "medium" | "hard") => {
    setDifficulty(newDifficulty)

    if (gameState) {
      setGameState({
        ...gameState,
        paddle2: {
          ...gameState.paddle2,
          difficulty: newDifficulty,
        },
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Pong</h2>

      <div className="flex justify-between items-center w-full max-w-md mb-4">
        <div className="flex gap-2">
          <Button
            variant={difficulty === "easy" ? "default" : "outline"}
            size="sm"
            onClick={() => changeDifficulty("easy")}
            className={difficulty === "easy" ? "bg-primary" : ""}
          >
            Easy
          </Button>
          <Button
            variant={difficulty === "medium" ? "default" : "outline"}
            size="sm"
            onClick={() => changeDifficulty("medium")}
            className={difficulty === "medium" ? "bg-primary" : ""}
          >
            Medium
          </Button>
          <Button
            variant={difficulty === "hard" ? "default" : "outline"}
            size="sm"
            onClick={() => changeDifficulty("hard")}
            className={difficulty === "hard" ? "bg-primary" : ""}
          >
            Hard
          </Button>
        </div>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-lg" />
      </div>

      {isMobile ? (
        <div className="mt-4 text-sm text-center text-gray-500">
          <p>Drag your finger up and down to move the paddle</p>
        </div>
      ) : (
        <div className="mt-4 text-sm text-center text-gray-500">
          <p>Use mouse or arrow keys to move the paddle</p>
        </div>
      )}
    </div>
  )
}
