"use client"

import { useEffect, useRef, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

export type Game2048State = {
  grid: number[][]
  gridSize: number
  score: number
  gameOver: boolean
  tileSize: number
  touchStartX: number | null
  touchStartY: number | null
}

// Helper functions for 2048 game
export function addRandomTile(grid: number[][]) {
  const availableCells = []

  // Find all empty cells
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 0) {
        availableCells.push({ row: i, col: j })
      }
    }
  }

  if (availableCells.length > 0) {
    // Choose a random empty cell
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)]

    // Place a 2 or 4 (90% chance for 2, 10% chance for 4)
    grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4
  }

  return grid
}

export function moveLeft(grid: number[][]) {
  let moved = false
  const newGrid = grid.map((row) => [...row])

  for (let i = 0; i < newGrid.length; i++) {
    const originalRow = [...newGrid[i]]
    // Remove zeros
    const filteredRow = newGrid[i].filter((cell) => cell !== 0)

    // Merge tiles
    for (let j = 0; j < filteredRow.length - 1; j++) {
      if (filteredRow[j] === filteredRow[j + 1]) {
        filteredRow[j] *= 2
        filteredRow[j + 1] = 0
      }
    }

    // Remove zeros again after merging
    const mergedRow = filteredRow.filter((cell) => cell !== 0)

    // Fill with zeros
    while (mergedRow.length < newGrid[i].length) {
      mergedRow.push(0)
    }

    // Update row
    newGrid[i] = mergedRow

    // Check if moved
    if (!moved) {
      for (let j = 0; j < newGrid[i].length; j++) {
        if (originalRow[j] !== newGrid[i][j]) {
          moved = true
          break
        }
      }
    }
  }

  return moved ? newGrid : grid
}

export function moveRight(grid: number[][]) {
  let moved = false
  const newGrid = grid.map((row) => [...row])

  for (let i = 0; i < newGrid.length; i++) {
    const originalRow = [...newGrid[i]]
    // Remove zeros
    const filteredRow = newGrid[i].filter((cell) => cell !== 0)

    // Fill with zeros at the beginning
    while (filteredRow.length < newGrid[i].length) {
      filteredRow.unshift(0)
    }

    // Merge tiles from right to left
    for (let j = newGrid[i].length - 1; j > 0; j--) {
      if (filteredRow[j] === filteredRow[j - 1]) {
        filteredRow[j] *= 2
        filteredRow[j - 1] = 0
      }
    }

    // Remove zeros
    const mergedRow = filteredRow.filter((cell) => cell !== 0)

    // Fill with zeros at the beginning
    while (mergedRow.length < newGrid[i].length) {
      mergedRow.unshift(0)
    }

    // Update row
    newGrid[i] = mergedRow

    // Check if moved
    if (!moved) {
      for (let j = 0; j < newGrid[i].length; j++) {
        if (originalRow[j] !== newGrid[i][j]) {
          moved = true
          break
        }
      }
    }
  }

  return moved ? newGrid : grid
}

export function moveUp(grid: number[][]) {
  let moved = false
  const newGrid = grid.map((row) => [...row])

  for (let j = 0; j < newGrid[0].length; j++) {
    // Extract column
    const column = newGrid.map((row) => row[j])
    const originalColumn = [...column]

    // Remove zeros
    const filteredColumn = column.filter((cell) => cell !== 0)

    // Merge tiles
    for (let i = 0; i < filteredColumn.length - 1; i++) {
      if (filteredColumn[i] === filteredColumn[i + 1]) {
        filteredColumn[i] *= 2
        filteredColumn[i + 1] = 0
      }
    }

    // Remove zeros again after merging
    const mergedColumn = filteredColumn.filter((cell) => cell !== 0)

    // Fill with zeros
    while (mergedColumn.length < column.length) {
      mergedColumn.push(0)
    }

    // Update column in grid
    for (let i = 0; i < newGrid.length; i++) {
      newGrid[i][j] = mergedColumn[i]
    }

    // Check if moved
    if (!moved) {
      for (let i = 0; i < column.length; i++) {
        if (originalColumn[i] !== mergedColumn[i]) {
          moved = true
          break
        }
      }
    }
  }

  return moved ? newGrid : grid
}

export function moveDown(grid: number[][]) {
  let moved = false
  const newGrid = grid.map((row) => [...row])

  for (let j = 0; j < newGrid[0].length; j++) {
    // Extract column
    const column = newGrid.map((row) => row[j])
    const originalColumn = [...column]

    // Remove zeros
    const filteredColumn = column.filter((cell) => cell !== 0)

    // Fill with zeros at the beginning
    while (filteredColumn.length < column.length) {
      filteredColumn.unshift(0)
    }

    // Merge tiles from bottom to top
    for (let i = column.length - 1; i > 0; i--) {
      if (filteredColumn[i] === filteredColumn[i - 1]) {
        filteredColumn[i] *= 2
        filteredColumn[i - 1] = 0
      }
    }

    // Remove zeros
    const mergedColumn = filteredColumn.filter((cell) => cell !== 0)

    // Fill with zeros at the beginning
    while (mergedColumn.length < column.length) {
      mergedColumn.unshift(0)
    }

    // Update column in grid
    for (let i = 0; i < newGrid.length; i++) {
      newGrid[i][j] = mergedColumn[i]
    }

    // Check if moved
    if (!moved) {
      for (let i = 0; i < column.length; i++) {
        if (originalColumn[i] !== mergedColumn[i]) {
          moved = true
          break
        }
      }
    }
  }

  return moved ? newGrid : grid
}

export function isGameOver(grid: number[][]) {
  // Check if there are any empty cells
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 0) {
        return false
      }
    }
  }

  // Check if there are any possible merges horizontally
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length - 1; j++) {
      if (grid[i][j] === grid[i][j + 1]) {
        return false
      }
    }
  }

  // Check if there are any possible merges vertically
  for (let i = 0; i < grid.length - 1; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === grid[i + 1][j]) {
        return false
      }
    }
  }

  // No empty cells and no possible merges
  return true
}

export function calculateScore(grid: number[][]) {
  let score = 0

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      score += grid[i][j]
    }
  }

  return score
}

export function getTileColor(value: number) {
  switch (value) {
    case 2:
      return { bg: "#eee4da", text: "#776e65" }
    case 4:
      return { bg: "#ede0c8", text: "#776e65" }
    case 8:
      return { bg: "#f2b179", text: "#f9f6f2" }
    case 16:
      return { bg: "#f59563", text: "#f9f6f2" }
    case 32:
      return { bg: "#f67c5f", text: "#f9f6f2" }
    case 64:
      return { bg: "#f65e3b", text: "#f9f6f2" }
    case 128:
      return { bg: "#edcf72", text: "#f9f6f2" }
    case 256:
      return { bg: "#edcc61", text: "#f9f6f2" }
    case 512:
      return { bg: "#edc850", text: "#f9f6f2" }
    case 1024:
      return { bg: "#edc53f", text: "#f9f6f2" }
    case 2048:
      return { bg: "#edc22e", text: "#f9f6f2" }
    default:
      return { bg: "#3c3a32", text: "#f9f6f2" }
  }
}

export function initialize2048(width: number, height: number): Game2048State {
  const gridSize = 4
  const grid = Array(gridSize)
    .fill(0)
    .map(() => Array(gridSize).fill(0))

  // Add initial tiles
  addRandomTile(grid)
  addRandomTile(grid)

  return {
    grid,
    gridSize,
    score: 0,
    gameOver: false,
    tileSize: Math.min(width, height) / gridSize - 10,
    touchStartX: null,
    touchStartY: null,
  }
}

export function render2048(ctx: CanvasRenderingContext2D, gameState: Game2048State) {
  const { grid, gridSize, tileSize } = gameState
  const padding = 5
  const borderRadius = 6

  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Calculate board size and position
  const boardSize = (tileSize + padding) * gridSize + padding
  const boardX = (ctx.canvas.width - boardSize) / 2
  const boardY = (ctx.canvas.height - boardSize) / 2

  // Draw board background
  ctx.fillStyle = "#bbada0"
  ctx.fillRect(boardX, boardY, boardSize, boardSize)

  // Draw tiles
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const value = grid[i][j]
      const x = boardX + padding + j * (tileSize + padding)
      const y = boardY + padding + i * (tileSize + padding)

      // Draw tile background
      ctx.fillStyle = value === 0 ? "#cdc1b4" : getTileColor(value).bg
      ctx.beginPath()
      ctx.roundRect(x, y, tileSize, tileSize, borderRadius)
      ctx.fill()

      // Draw tile value
      if (value !== 0) {
        ctx.fillStyle = getTileColor(value).text
        ctx.font = `bold ${value < 100 ? tileSize / 2 : tileSize / 2.5}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(value.toString(), x + tileSize / 2, y + tileSize / 2)
      }
    }
  }

  // Draw score
  ctx.fillStyle = "#776e65"
  ctx.font = "bold 24px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "top"
  ctx.fillText(`Score: ${gameState.score}`, ctx.canvas.width / 2, 20)

  // Draw game over message
  if (gameState.gameOver) {
    ctx.fillStyle = "rgba(238, 228, 218, 0.73)"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.fillStyle = "#776e65"
    ctx.font = "bold 60px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Game Over!", ctx.canvas.width / 2, ctx.canvas.height / 2 - 50)

    ctx.font = "bold 30px Arial"
    ctx.fillText(`Final Score: ${gameState.score}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 20)
  }
}

export default function Game2048() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<Game2048State | null>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const isMobile = useMobile()

  // Initialize game
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = Math.min(400, window.innerWidth - 40)
    canvas.height = Math.min(400, window.innerWidth - 40)

    // Initialize game state
    const initialState = initialize2048(canvas.width, canvas.height)
    setGameState(initialState)

    // Handle window resize
    const handleResize = () => {
      canvas.width = Math.min(400, window.innerWidth - 40)
      canvas.height = Math.min(400, window.innerWidth - 40)

      if (gameState) {
        setGameState({
          ...gameState,
          tileSize: Math.min(canvas.width, canvas.height) / gameState.gridSize - 10,
        })
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Handle keyboard input
  useEffect(() => {
    if (!gameState) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver) return

      let moved = false
      let newGrid = gameState.grid.map((row) => [...row])

      switch (e.key) {
        case "ArrowUp":
          newGrid = moveUp(newGrid)
          moved = JSON.stringify(newGrid) !== JSON.stringify(gameState.grid)
          break
        case "ArrowDown":
          newGrid = moveDown(newGrid)
          moved = JSON.stringify(newGrid) !== JSON.stringify(gameState.grid)
          break
        case "ArrowLeft":
          newGrid = moveLeft(newGrid)
          moved = JSON.stringify(newGrid) !== JSON.stringify(gameState.grid)
          break
        case "ArrowRight":
          newGrid = moveRight(newGrid)
          moved = JSON.stringify(newGrid) !== JSON.stringify(gameState.grid)
          break
      }

      if (moved) {
        addRandomTile(newGrid)
        const newScore = calculateScore(newGrid)
        const newGameOver = isGameOver(newGrid)

        setGameState({
          ...gameState,
          grid: newGrid,
          score: newScore,
          gameOver: newGameOver,
        })

        setScore(newScore)
        setGameOver(newGameOver)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [gameState])

  // Handle touch input for mobile
  useEffect(() => {
    if (!gameState || !canvasRef.current) return

    const canvas = canvasRef.current

    const handleTouchStart = (e: TouchEvent) => {
      if (gameState.gameOver) return

      const touch = e.touches[0]
      setGameState({
        ...gameState,
        touchStartX: touch.clientX,
        touchStartY: touch.clientY,
      })
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (gameState.gameOver || !gameState.touchStartX || !gameState.touchStartY) return

      const touch = e.changedTouches[0]
      const touchEndX = touch.clientX
      const touchEndY = touch.clientY

      const dx = touchEndX - gameState.touchStartX
      const dy = touchEndY - gameState.touchStartY

      let moved = false
      let newGrid = gameState.grid.map((row) => [...row])

      // Determine swipe direction
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 50) {
          newGrid = moveRight(newGrid)
          moved = JSON.stringify(newGrid) !== JSON.stringify(gameState.grid)
        } else if (dx < -50) {
          newGrid = moveLeft(newGrid)
          moved = JSON.stringify(newGrid) !== JSON.stringify(gameState.grid)
        }
      } else {
        // Vertical swipe
        if (dy > 50) {
          newGrid = moveDown(newGrid)
          moved = JSON.stringify(newGrid) !== JSON.stringify(gameState.grid)
        } else if (dy < -50) {
          newGrid = moveUp(newGrid)
          moved = JSON.stringify(newGrid) !== JSON.stringify(gameState.grid)
        }
      }

      if (moved) {
        addRandomTile(newGrid)
        const newScore = calculateScore(newGrid)
        const newGameOver = isGameOver(newGrid)

        setGameState({
          ...gameState,
          grid: newGrid,
          score: newScore,
          gameOver: newGameOver,
          touchStartX: null,
          touchStartY: null,
        })

        setScore(newScore)
        setGameOver(newGameOver)
      } else {
        setGameState({
          ...gameState,
          touchStartX: null,
          touchStartY: null,
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

  // Render game
  useEffect(() => {
    if (!gameState || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    render2048(ctx, gameState)
  }, [gameState])

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">2048</h2>
      <div className="mb-4">
        <span className="text-lg font-medium">Score: {score}</span>
      </div>
      <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-lg" />
      {gameOver && (
        <div className="mt-4">
          <p className="text-xl font-bold text-center mb-2">Game Over!</p>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
            onClick={() => {
              if (!canvasRef.current) return

              const canvas = canvasRef.current
              const initialState = initialize2048(canvas.width, canvas.height)
              setGameState(initialState)
              setScore(0)
              setGameOver(false)
            }}
          >
            Play Again
          </button>
        </div>
      )}
      {isMobile && (
        <p className="mt-4 text-sm text-center text-gray-500">Swipe up, down, left, or right to move tiles</p>
      )}
    </div>
  )
}
