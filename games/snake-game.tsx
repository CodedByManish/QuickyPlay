"use client"

import { useRef, useState } from "react"

export type SnakeGameState = {
  snake: Array<{ x: number; y: number }>
  food: { x: number; y: number }
  direction: "up" | "down" | "left" | "right"
  nextDirection: "up" | "down" | "left" | "right"
  gridSize: number
  cellSize: number
  speed: number
  score: number
  gameOver: boolean
  touchStartX: number | null
  touchStartY: number | null
}

export function initializeSnakeGame(width: number, height: number): SnakeGameState {
  const gridSize = 20
  const cellSize = Math.floor(Math.min(width, height) / gridSize)

  // Initialize snake in the middle of the grid
  const snake = [
    { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) },
    { x: Math.floor(gridSize / 2) - 1, y: Math.floor(gridSize / 2) },
  ]

  // Generate food at a random position
  const food = generateFood(snake, gridSize)

  return {
    snake,
    food,
    direction: "right",
    nextDirection: "right",
    gridSize,
    cellSize,
    speed: 150, // milliseconds between moves
    score: 0,
    gameOver: false,
    touchStartX: null,
    touchStartY: null,
  }
}

export function generateFood(snake: Array<{ x: number; y: number }>, gridSize: number) {
  let food
  let foodOnSnake

  do {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    }

    // Check if food is on snake
    foodOnSnake = snake.some((segment) => segment.x === food.x && segment.y === food.y)
  } while (foodOnSnake)

  return food
}

export function moveSnake(gameState: SnakeGameState): SnakeGameState {
  const { snake, food, direction, nextDirection, gridSize, speed, score } = gameState

  // Update direction based on nextDirection
  const newDirection = nextDirection

  // Create a copy of the snake
  const newSnake = [...snake]

  // Get the head of the snake
  const head = { ...newSnake[0] }

  // Move the head based on direction
  switch (newDirection) {
    case "up":
      head.y -= 1
      break
    case "down":
      head.y += 1
      break
    case "left":
      head.x -= 1
      break
    case "right":
      head.x += 1
      break
  }

  // Check if the snake hit the wall
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    return { ...gameState, gameOver: true }
  }

  // Check if the snake hit itself
  if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
    return { ...gameState, gameOver: true }
  }

  // Add the new head to the snake
  newSnake.unshift(head)

  // Check if the snake ate the food
  let newFood = food
  let newScore = score
  let newSpeed = speed

  if (head.x === food.x && head.y === food.y) {
    // Generate new food
    newFood = generateFood(newSnake, gridSize)
    newScore += 10

    // Increase speed every 5 food items
    if (newScore % 50 === 0) {
      newSpeed = Math.max(50, speed - 10)
    }
  } else {
    // Remove the tail if the snake didn't eat food
    newSnake.pop()
  }

  return {
    ...gameState,
    snake: newSnake,
    food: newFood,
    direction: newDirection,
    speed: newSpeed,
    score: newScore,
  }
}

export function renderSnakeGame(ctx: CanvasRenderingContext2D, gameState: SnakeGameState) {
  const { snake, food, gridSize, cellSize } = gameState

  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Draw background grid
  ctx.fillStyle = "#111"
  ctx.fillRect(0, 0, gridSize * cellSize, gridSize * cellSize)

  // Draw grid lines
  ctx.strokeStyle = "#222"
  ctx.lineWidth = 1

  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath()
    ctx.moveTo(i * cellSize, 0)
    ctx.lineTo(i * cellSize, gridSize * cellSize)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, i * cellSize)
    ctx.lineTo(gridSize * cellSize, i * cellSize)
    ctx.stroke()
  }

  // Draw food
  ctx.fillStyle = "#e74c3c"
  ctx.beginPath()
  ctx.arc(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, cellSize / 2 - 2, 0, Math.PI * 2)
  ctx.fill()

  // Draw snake
  snake.forEach((segment, index) => {
    // Different color for head
    if (index === 0) {
      ctx.fillStyle = "#2ecc71"
    } else {
      // Gradient from head to tail
      const greenValue = Math.max(30, 140 - index * 5)
      ctx.fillStyle = `rgb(46, ${greenValue}, 113)`
    }

    ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2)

    // Draw eyes on the head
    if (index === 0) {
      ctx.fillStyle = "#111"

      // Position eyes based on direction
      let eyeX1, eyeY1, eyeX2, eyeY2
      const eyeSize = cellSize / 6
      const eyeOffset = cellSize / 4

      switch (gameState.direction) {
        case "up":
          eyeX1 = segment.x * cellSize + eyeOffset
          eyeY1 = segment.y * cellSize + eyeOffset
          eyeX2 = segment.x * cellSize + cellSize - eyeOffset - eyeSize
          eyeY2 = segment.y * cellSize + eyeOffset
          break
        case "down":
          eyeX1 = segment.x * cellSize + eyeOffset
          eyeY1 = segment.y * cellSize + cellSize - eyeOffset - eyeSize
          eyeX2 = segment.x * cellSize + cellSize - eyeOffset - eyeSize
          eyeY2 = segment.y * cellSize + cellSize - eyeOffset - eyeSize
          break
        case "left":
          eyeX1 = segment.x * cellSize + eyeOffset
          eyeY1 = segment.y * cellSize + eyeOffset
          eyeX2 = segment.x * cellSize + eyeOffset
          eyeY2 = segment.y * cellSize + cellSize - eyeOffset - eyeSize
          break
        case "right":
          eyeX1 = segment.x * cellSize + cellSize - eyeOffset - eyeSize
          eyeY1 = segment.y * cellSize + eyeOffset
          eyeX2 = segment.x * cellSize + cellSize - eyeOffset - eyeSize
          eyeY2 = segment.y * cellSize + cellSize - eyeOffset - eyeSize
          break
      }

      ctx.fillRect(eyeX1, eyeY1, eyeSize, eyeSize)
      ctx.fillRect(eyeX2, eyeY2, eyeSize, eyeSize)
    }
  })

  // Draw score
  ctx.fillStyle = "#fff"
  ctx.font = "20px Arial"
  ctx.textAlign = "left"
  ctx.textBaseline = "top"
  ctx.fillText(`Score: ${gameState.score}`, 10, 10)

  // Draw game over message
  if (gameState.gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.fillStyle = "#fff"
    ctx.font = "30px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Game Over!", ctx.canvas.width / 2, ctx.canvas.height / 2 - 30)
    ctx.fillText(`Score: ${gameState.score}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 10)
    ctx.font = "20px Arial"
    ctx.fillText("Press Space to Restart", ctx.canvas.width / 2, ctx.canvas.height / 2 + 50)
  }
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<SnakeGameState | null>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const gameLoopRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>
}
