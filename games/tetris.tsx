"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

import { useEffect, useRef, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { Play, Pause, RotateCcw, ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react'

export type TetrisGameState = {
  grid: number[][]
  currentPiece: {
    shape: number[][]
    x: number
    y: number
    color: string
  }
  nextPiece: {
    shape: number[][]
    color: string
  }
  score: number
  level: number
  lines: number
  gameOver: boolean
  paused: boolean
  cellSize: number
  touchStartX: number | null
  touchStartY: number | null
}

// Tetromino shapes
const SHAPES = [
  // I
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // J
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  // L
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  // O
  [
    [1, 1],
    [1, 1],
  ],
  // S
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  // T
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  // Z
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
]

// Tetromino colors
const COLORS = [
  "#00f0f0", // I - Cyan
  "#0000f0", // J - Blue
  "#f0a000", // L - Orange
  "#f0f000", // O - Yellow
  "#00f000", // S - Green
  "#a000f0", // T - Purple
  "#f00000", // Z - Red
]

export function initializeTetrisGame(width: number, height: number): TetrisGameState {
  const ROWS = 20
  const COLS = 10
  const cellSize = Math.min(Math.floor(width / COLS), Math.floor(height / ROWS))

  // Create empty grid
  const grid = Array(ROWS)
    .fill(0)
    .map(() => Array(COLS).fill(0))

  // Generate random piece
  const randomPieceIndex = Math.floor(Math.random() * SHAPES.length)
  const currentPiece = {
    shape: SHAPES[randomPieceIndex],
    x: Math.floor(COLS / 2) - Math.floor(SHAPES[randomPieceIndex][0].length / 2),
    y: 0,
    color: COLORS[randomPieceIndex],
  }

  // Generate next piece
  const nextPieceIndex = Math.floor(Math.random() * SHAPES.length)
  const nextPiece = {
    shape: SHAPES[nextPieceIndex],
    color: COLORS[nextPieceIndex],
  }

  return {
    grid,
    currentPiece,
    nextPiece,
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false,
    paused: false,
    cellSize,
    touchStartX: null,
    touchStartY: null,
  }
}

export function rotatePiece(piece: number[][]): number[][] {
  const rows = piece.length
  const cols = piece[0].length

  // Create new rotated matrix
  const rotated = Array(cols)
    .fill(0)
    .map(() => Array(rows).fill(0))

  // Rotate 90 degrees clockwise
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotated[j][rows - 1 - i] = piece[i][j]
    }
  }

  return rotated
}

export function isValidMove(grid: number[][], piece: number[][], x: number, y: number): boolean {
  const rows = piece.length
  const cols = piece[0].length

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (piece[i][j]) {
        const newX = x + j
        const newY = y + i

        // Check if out of bounds
        if (newX < 0 || newX >= grid[0].length || newY < 0 || newY >= grid.length) {
          return false
        }

        // Check if cell is already occupied
        if (newY >= 0 && grid[newY][newX]) {
          return false
        }
      }
    }
  }

  return true
}

export function mergePiece(grid: number[][], piece: number[][], x: number, y: number, color: string): number[][] {
  const newGrid = grid.map((row) => [...row])
  const rows = piece.length
  const cols = piece[0].length

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (piece[i][j]) {
        const newY = y + i
        const newX = x + j

        if (newY >= 0 && newY < grid.length && newX >= 0 && newX < grid[0].length) {
          // Store color index + 1 (0 means empty)
          newGrid[newY][newX] = COLORS.indexOf(color) + 1
        }
      }
    }
  }

  return newGrid
}

export function clearLines(grid: number[][]): { newGrid: number[][]; linesCleared: number } {
  const newGrid = grid.map((row) => [...row])
  let linesCleared = 0

  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i].every((cell) => cell !== 0)) {
      // Remove the line
      newGrid.splice(i, 1)
      // Add empty line at the top
      newGrid.unshift(Array(grid[0].length).fill(0))
      linesCleared++
      i++ // Check the same row again (now contains different content)
    }
  }

  return { newGrid, linesCleared }
}

export function renderTetrisGame(ctx: CanvasRenderingContext2D, gameState: TetrisGameState) {
  const { grid, currentPiece, nextPiece, score, level, lines, gameOver, paused, cellSize } = gameState
  const ROWS = grid.length
  const COLS = grid[0].length

  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Draw background
  ctx.fillStyle = "#121212"
  ctx.fillRect(0, 0, COLS * cellSize, ROWS * cellSize)

  // Draw grid lines
  ctx.strokeStyle = "#2a2a2a"
  ctx.lineWidth = 1
  for (let i = 0; i <= ROWS; i++) {
    ctx.beginPath()
    ctx.moveTo(0, i * cellSize)
    ctx.lineTo(COLS * cellSize, i * cellSize)
    ctx.stroke()
  }
  for (let i = 0; i <= COLS; i++) {
    ctx.beginPath()
    ctx.moveTo(i * cellSize, 0)
    ctx.lineTo(i * cellSize, ROWS * cellSize)
    ctx.stroke()
  }

  // Draw grid
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (grid[i][j]) {
        const colorIndex = grid[i][j] - 1
        ctx.fillStyle = COLORS[colorIndex]
        ctx.fillRect(j * cellSize + 1, i * cellSize + 1, cellSize - 2, cellSize - 2)
        
        // Add 3D effect
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.fillRect(j * cellSize + 1, i * cellSize + 1, cellSize - 2, 2)
        ctx.fillRect(j * cellSize + 1, i * cellSize + 1, 2, cellSize - 2)
        
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
        ctx.fillRect(j * cellSize + 1, i * cellSize + cellSize - 3, cellSize - 2, 2)
        ctx.fillRect(j * cellSize + cellSize - 3, i * cellSize + 1, 2, cellSize - 2)
      }
    }
  }

  // Draw current piece
  if (!gameOver && !paused) {
    const rows = currentPiece.shape.length
    const cols = currentPiece.shape[0].length

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (currentPiece.shape[i][j]) {
          const x = (currentPiece.x + j) * cellSize
          const y = (currentPiece.y + i) * cellSize

          ctx.fillStyle = currentPiece.color
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2)
          
          // Add 3D effect
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
          ctx.fillRect(x + 1, y + 1, cellSize - 2, 2)
          ctx.fillRect(x + 1, y + 1, 2, cellSize - 2)
          
          ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
          ctx.fillRect(x + 1, y + cellSize - 3, cellSize - 2, 2)
          ctx.fillRect(x + cellSize - 3, y + 1, 2, cellSize - 2)
        }
      }
    }
  }

  // Draw game info
  ctx.fillStyle = "#fff"
  ctx.font = "20px Righteous"
  ctx.textAlign = "left"
  ctx.textBaseline = "top"

  const infoX = COLS * cellSize + 20
  ctx.fillText(`Score: ${score}`, infoX, 20)
  ctx.fillText(`Level: ${level}`, infoX, 50)
  ctx.fillText(`Lines: ${lines}`, infoX, 80)

  // Draw next piece preview
  ctx.fillText("Next:", infoX, 120)

  const previewX = infoX + 20
  const previewY = 160
  const previewRows = nextPiece.shape.length
  const previewCols = nextPiece.shape[0].length

  // Draw preview background
  ctx.fillStyle = "#1a1a1a"
  ctx.fillRect(previewX - 10, previewY - 10, previewCols * cellSize + 20, previewRows * cellSize + 20)
  ctx.strokeStyle = "#333"
  ctx.strokeRect(previewX - 10, previewY - 10, previewCols * cellSize + 20, previewRows * cellSize + 20)

  for (let i = 0; i < previewRows; i++) {
    for (let j = 0; j < previewCols; j++) {
      if (nextPiece.shape[i][j]) {
        const x = previewX + j * cellSize
        const y = previewY + i * cellSize

        ctx.fillStyle = nextPiece.color
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2)
        
        // Add 3D effect
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.fillRect(x + 1, y + 1, cellSize - 2, 2)
        ctx.fillRect(x + 1, y + 1, 2, cellSize - 2)
        
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
        ctx.fillRect(x + 1, y + cellSize - 3, cellSize - 2, 2)
        ctx.fillRect(x + cellSize - 3, y + 1, 2, cellSize - 2)
      }
    }
  }

  // Draw controls help
  ctx.fillStyle = "#aaa"
  ctx.font = "16px Righteous"
  ctx.fillText("Controls:", infoX, previewY + previewRows * cellSize + 30)
  ctx.fillText("← → : Move", infoX, previewY + previewRows * cellSize + 60)
  ctx.fillText("↑ : Rotate", infoX, previewY + previewRows * cellSize + 85)
  ctx.fillText("↓ : Drop", infoX, previewY + previewRows * cellSize + 110)
  ctx.fillText("P : Pause", infoX, previewY + previewRows * cellSize + 135)

  // Draw game over or paused message
  if (gameOver || paused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(0, 0, COLS * cellSize, ROWS * cellSize)

    ctx.fillStyle = "#fff"
    ctx.font = "30px Righteous"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    if (gameOver) {
      ctx.fillText("Game Over", (COLS * cellSize) / 2, (ROWS * cellSize) / 2 - 30)
      ctx.fillText(`Score: ${score}`, (COLS * cellSize) / 2, (ROWS * cellSize) / 2 + 10)
      ctx.font = "20px Righteous"
      ctx.fillText("Press Space to Restart", (COLS * cellSize) / 2, (ROWS * cellSize) / 2 + 50)
    } else {
      ctx.fillText("Paused", (COLS * cellSize) / 2, (ROWS * cellSize) / 2)
      ctx.font = "20px Righteous"
      ctx.fillText("Press P to Resume", (COLS * cellSize) / 2, (ROWS * cellSize) / 2 + 40)
    }
  }
}

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<TetrisGameState | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [paused, setPaused] = useState(false)
  const gameLoopRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)
  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useMobile()
  
  // Initialize game
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    // Set canvas size
    const ROWS = 20
    const COLS = 10
    const INFO_WIDTH = 200
    
    const maxWidth = Math.min(30, Math.floor((window.innerWidth - INFO_WIDTH) / COLS))
    const maxHeight = Math.min(30, Math.floor(window.innerHeight / ROWS))
    const cellSize = Math.min(maxWidth, maxHeight)
    
    canvas.width = COLS * cellSize + INFO_WIDTH
    canvas.height = ROWS * cellSize
    
    // Initialize game state
    const initialState = initializeTetrisGame(COLS * cellSize, ROWS * cellSize)
    setGameState(initialState)
    setPaused(true) // Start paused
    
    // Handle window resize
    const handleResize = () => {
      const maxWidth = Math.min(30, Math.floor((window.innerWidth - INFO_WIDTH) / COLS))
      const maxHeight = Math.min(30, Math.floor(window.innerHeight / ROWS))
      const newCellSize = Math.min(maxWidth, maxHeight)
      
      canvas.width = COLS * newCellSize + INFO_WIDTH
      canvas.height = ROWS * newCellSize
      
      if (gameState) {
        setGameState({
          ...gameState,
          cellSize: newCellSize
        })
      }
    }
    
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current)
      }
    }
  }, [])
  
  // Game loop
  useEffect(() => {
    if (!gameState || !canvasRef.current || gameOver || paused) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const dropSpeed = 1000 - (gameState.level - 1) * 100 // ms
    
    // Set up automatic dropping
    if (dropIntervalRef.current) {
      clearInterval(dropIntervalRef.current)
    }
    
    dropIntervalRef.current = setInterval(() => {
      movePieceDown()
    }, dropSpeed)
    
    // Render game
    const renderLoop = () => {
      renderTetrisGame(ctx, gameState)
      gameLoopRef.current = requestAnimationFrame(renderLoop)
    }
    
    gameLoopRef.current = requestAnimationFrame(renderLoop)
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current)
      }
    }
  }, [gameState, gameOver, paused])
  
  // Move piece down
  const movePieceDown = () => {
    if (!gameState) return
    
    const newY = gameState.currentPiece.y + 1
    
    if (isValidMove(gameState.grid, gameState.currentPiece.shape, gameState.currentPiece.x, newY)) {
      // Update piece position
      setGameState({
        ...gameState,
        currentPiece: {
          ...gameState.currentPiece,
          y: newY
        }
      })
    } else {
      // Piece has landed
      const newGrid = mergePiece(
        gameState.grid,
        gameState.currentPiece.shape,
        gameState.currentPiece.x,
        gameState.currentPiece.y,
        gameState.currentPiece.color
      )
      
      // Check for cleared lines
      const { newGrid: clearedGrid, linesCleared } = clearLines(newGrid)
      
      // Update score and level
      const newScore = gameState.score + (linesCleared * 100) * gameState.level
      const newLines = gameState.lines + linesCleared
      const newLevel = Math.floor(newLines / 10) + 1
      
      // Generate new piece
      const randomPieceIndex = Math.floor(Math.random() * SHAPES.length)
      const newPiece = {
        shape: gameState.nextPiece.shape,
        x: Math.floor(gameState.grid[0].length / 2) - Math.floor(gameState.nextPiece.shape[0].length / 2),
        y: 0,
        color: gameState.nextPiece.color
      }
      
      // Generate next piece
      const nextPieceIndex = Math.floor(Math.random() * SHAPES.length)
      const nextPiece = {
        shape: SHAPES[nextPieceIndex],
        color: COLORS[nextPieceIndex]
      }
      
      // Check if game over (new piece overlaps with existing pieces)
      const isGameOver = !isValidMove(clearedGrid, newPiece.shape, newPiece.x, newPiece.y)
      
      setGameState({
        ...gameState,
        grid: clearedGrid,
        currentPiece: newPiece,
        nextPiece: nextPiece,
        score: newScore,
        level: newLevel,
        lines: newLines,
        gameOver: isGameOver
      })
      
      setScore(newScore)
      setLevel(newLevel)
      setLines(newLines)
      setGameOver(isGameOver)
      
      if (isGameOver) {
        if (dropIntervalRef.current) {
          clearInterval(dropIntervalRef.current)
        }
      }
    }
  }
  
  // Move piece left
  const movePieceLeft = () => {
    if (!gameState || gameState.gameOver || gameState.paused) return
    
    const newX = gameState.currentPiece.x - 1
    
    if (isValidMove(gameState.grid, gameState.currentPiece.shape, newX, gameState.currentPiece.y)) {
      setGameState({
        ...gameState,
        currentPiece: {
          ...gameState.currentPiece,
          x: newX
        }
      })
    }
  }
  
  // Move piece right
  const movePieceRight = () => {
    if (!gameState || gameState.gameOver || gameState.paused) return
    
    const newX = gameState.currentPiece.x + 1
    
    if (isValidMove(gameState.grid, gameState.currentPiece.shape, newX, gameState.currentPiece.y)) {
      setGameState({
        ...gameState,
        currentPiece: {
          ...gameState.currentPiece,
          x: newX
        }
      })
    }
  }
  
  // Rotate piece
  const handleRotatePiece = () => {
    if (!gameState || gameState.gameOver || gameState.paused) return
    
    const rotated = rotatePiece(gameState.currentPiece.shape)
    
    if (isValidMove(gameState.grid, rotated, gameState.currentPiece.x, gameState.currentPiece.y)) {
      setGameState({
        ...gameState,
        currentPiece: {
          ...gameState.currentPiece,
          shape: rotated
        }
      })
    } else {
      // Try wall kick (move left or right if rotation is blocked by wall)
      for (let offset of [-1, 1, -2, 2]) {
        if (isValidMove(gameState.grid, rotated, gameState.currentPiece.x + offset, gameState.currentPiece.y)) {
          setGameState({
            ...gameState,
            currentPiece: {
              ...gameState.currentPiece,
              shape: rotated,
              x: gameState.currentPiece.x + offset
            }
          })
          return
        }
      }
    }
  }
  
  // Hard drop
  const hardDrop = () => {
    if (!gameState || gameState.gameOver || gameState.paused) return
    
    let newY = gameState.currentPiece.y
    
    // Find the lowest valid position
    while (isValidMove(gameState.grid, gameState.currentPiece.shape, gameState.currentPiece.x, newY + 1)) {
      newY++
    }
    
    setGameState({
      ...gameState,
      currentPiece: {
        ...gameState.currentPiece,
        y: newY
      }
    })
    
    // Force immediate landing
    setTimeout(movePieceDown, 0)
  }
  
  // Toggle pause
  const togglePause = () => {
    if (!gameState || gameState.gameOver) return
    
    const newPaused = !paused
    setPaused(newPaused)
    
    setGameState({
      ...gameState,
      paused: newPaused
    })
    
    if (newPaused && dropIntervalRef.current) {
      clearInterval(dropIntervalRef.current)
    }
  }
  
  // Reset game
  const resetGame = () => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const initialState = initializeTetrisGame(canvas.width, canvas.height)
    setGameState(initialState)
    setScore(0)
    setLevel(1)
    setLines(0)
    setGameOver(false)
    setPaused(false)
  }
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState?.gameOver) {
        if (e.code === "Space") {
          resetGame()
        }
        return
      }
      
      if (paused) {
        if (e.code === "KeyP") {
          togglePause()
        }
        return
      }
      
      switch (e.code) {
        case "ArrowLeft":
          movePieceLeft()
          break
        case "ArrowRight":
          movePieceRight()
          break
        case "ArrowUp":
          handleRotatePiece()
          break
        case "ArrowDown":
          movePieceDown()
          break
        case "Space":
          hardDrop()
          break
        case "KeyP":
          togglePause()
          break
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [gameState, paused])
  
  // Handle touch input for mobile
  useEffect(() => {
    if (!gameState || !canvasRef.current) return
    
    const canvas = canvasRef.current
    
    const handleTouchStart = (e: TouchEvent) => {
      if (gameState.gameOver) {
        resetGame()
        return
      }
      
      if (paused) {
        togglePause()
        return
      }
      
      const touch = e.touches[0]
      setGameState({
        ...gameState,
        touchStartX: touch.clientX,
        touchStartY: touch.clientY
      })
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (gameState.gameOver || paused || !gameState.touchStartX || !gameState.touchStartY) return
      
      const touch = e.changedTouches[0]
      const touchEndX = touch.clientX
      const touchEndY = touch.clientY
      
      const dx = touchEndX - gameState.touchStartX
      const dy = touchEndY - gameState.touchStartY
      
      // Determine swipe direction
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
        // Horizontal swipe
        if (dx > 0) {
          movePieceRight()
        } else {
          movePieceLeft()
        }
      } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30) {
        // Vertical swipe
        if (dy > 0) {
          hardDrop()
        } else {
          rotatePiece(gameState.currentPiece.shape)
        }
      } else {
        // Tap (rotate)
        rotatePiece(gameState.currentPiece.shape)
      }
      
      setGameState({
        ...gameState,
        touchStartX: null,
        touchStartY: null
      })
    }
    
    canvas.addEventListener("touchstart", handleTouchStart)
    canvas.addEventListener("touchend", handleTouchEnd)
    
    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchend", handleTouchEnd)
    }
  }, [gameState, paused])
  
  // Render game
  useEffect(() => {
    if (!gameState || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    renderTetrisGame(ctx, gameState)
  }, [gameState])

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Tetris</h2>
      
      <div className="mb-4 flex items-center gap-4">
        <div className="text-white">
          <span className="text-lg font-medium">Score: {score}</span>
        </div>
        <div className="text-white">
          <span className="text-lg font-medium">Level: {level}</span>
        </div>
      </div>
      
      <div className="relative">
        <canvas ref={canvasRef} className="border border-gray-700 rounded-lg shadow-lg bg-gray-800" />
        
        {gameState?.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
            <div className="text-center">
              <p className="text-xl font-bold text-white mb-2">Game Over!</p>
              <p className="text-lg text-white mb-4">Final Score: {score}</p>
              <Button className="bg-primary hover:bg-primary/80" onClick={resetGame}>
                Play Again
              </Button>
            </div>
          </div>
        )}
        
        {paused && !gameState?.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
            <div className="text-center">
              <p className="text-xl font-bold text-white mb-4">Game Paused</p>
              <Button className="bg-primary hover:bg-primary/80" onClick={togglePause}>
                Resume
              </Button>
            </div>
          </div>
        )}
        
        {!gameState?.gameOver && !paused && (
          <div className="absolute bottom-4 right-4">
            <Button variant="ghost" size="icon" className="bg-black/30 text-white" onClick={togglePause}>
              <Pause className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
      
      {isMobile && (
        <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-xs">
          <div></div>
          <Button variant="outline" className="aspect-square bg-gray-800 border-gray-700 text-white" onClick={() => handleRotatePiece()}>
            <ArrowUp className="h-6 w-6" />
          </Button>
          <div></div>
          <Button variant="outline" className="aspect-square bg-gray-800 border-gray-700 text-white" onClick={movePieceLeft}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button variant="outline" className="aspect-square bg-gray-800 border-gray-700 text-white" onClick={hardDrop}>
            <ArrowDown className="h-6 w-6" />
          </Button>
          <Button variant="outline" className="aspect-square bg-gray-800 border-gray-700 text-white" onClick={movePieceRight}>
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
      )}
      
      {isMobile ? (
        <div className="mt-4 text-sm text-center text-gray-400">
          <p>Tap buttons to move, rotate, and drop</p>
        </div>
      ) : (
        <div className="mt-4 text-sm text-center text-gray-400">
          <p>Use arrow keys to move and rotate, Space to drop, P to pause</p>
        </div>
      )}
      
      {!gameState?.gameOver && (
        <Button className="mt-4 bg-primary hover:bg-primary/80" onClick={() => setPaused(false)}>
          <Play className="h-4 w-4 mr-2" />
          Start Game
        </Button>
      )}
    </div>
  )
}
