"use client"

import { useEffect, useRef, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Flag, Bomb, SmilePlus, Frown, Smile } from "lucide-react"

export type MinesweeperState = {
  grid: number[][]
  revealed: boolean[][]
  flagged: boolean[][]
  mines: number
  gameOver: boolean
  win: boolean
  cellSize: number
  firstClick: boolean
}

export function initializeMinesweeper(
  width: number,
  height: number,
  difficulty: "easy" | "medium" | "hard" = "medium",
): MinesweeperState {
  // Set grid size based on difficulty
  let rows, cols, mines

  switch (difficulty) {
    case "easy":
      rows = 9
      cols = 9
      mines = 10
      break
    case "medium":
      rows = 16
      cols = 16
      mines = 40
      break
    case "hard":
      rows = 16
      cols = 30
      mines = 99
      break
    default:
      rows = 9
      cols = 9
      mines = 10
  }

  // Adjust for small screens
  if (width < 500) {
    if (difficulty === "hard") {
      rows = 12
      cols = 12
      mines = 30
    } else if (difficulty === "medium") {
      rows = 10
      cols = 10
      mines = 20
    }
  }

  const cellSize = Math.min(Math.floor(width / cols), 30)

  // Create empty grid
  const grid = Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(0))
  const revealed = Array(rows)
    .fill(false)
    .map(() => Array(cols).fill(false))
  const flagged = Array(rows)
    .fill(false)
    .map(() => Array(cols).fill(false))

  return {
    grid,
    revealed,
    flagged,
    mines,
    gameOver: false,
    win: false,
    cellSize,
    firstClick: true,
  }
}

export function placeMines(state: MinesweeperState, clickRow: number, clickCol: number): MinesweeperState {
  const { grid, mines } = state
  const rows = grid.length
  const cols = grid[0].length

  // Create a copy of the grid
  const newGrid = grid.map((row) => [...row])

  // Place mines randomly
  let minesPlaced = 0
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * cols)

    // Don't place a mine where the user clicked or around it (3x3 area)
    const isSafeZone = Math.abs(row - clickRow) <= 1 && Math.abs(col - clickCol) <= 1

    // Don't place a mine where there's already one
    if (newGrid[row][col] !== -1 && !isSafeZone) {
      newGrid[row][col] = -1 // -1 represents a mine
      minesPlaced++
    }
  }

  // Calculate numbers for each cell
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Skip if this cell is a mine
      if (newGrid[row][col] === -1) continue

      // Count adjacent mines
      let count = 0
      for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
          if (newGrid[r][c] === -1) count++
        }
      }

      newGrid[row][col] = count
    }
  }

  return {
    ...state,
    grid: newGrid,
    firstClick: false,
  }
}

export function revealCell(state: MinesweeperState, row: number, col: number): MinesweeperState {
  const { grid, revealed, flagged, gameOver } = state

  // If game is over or cell is already revealed or flagged, do nothing
  if (gameOver || revealed[row][col] || flagged[row][col]) {
    return state
  }

  // Handle first click
  if (state.firstClick) {
    state = placeMines(state, row, col)
  }

  // Create copies of the arrays
  const newRevealed = revealed.map((row) => [...row])

  // Reveal the cell
  newRevealed[row][col] = true

  // If it's a mine, game over
  if (grid[row][col] === -1) {
    return {
      ...state,
      revealed: newRevealed,
      gameOver: true,
    }
  }

  // If it's a 0, reveal adjacent cells
  if (grid[row][col] === 0) {
    const rows = grid.length
    const cols = grid[0].length

    // Use a queue for flood fill
    const queue = [{ row, col }]
    while (queue.length > 0) {
      const { row: r, col: c } = queue.shift()!

      // Check all adjacent cells
      for (let i = Math.max(0, r - 1); i <= Math.min(rows - 1, r + 1); i++) {
        for (let j = Math.max(0, c - 1); j <= Math.min(cols - 1, c + 1); j++) {
          // Skip if already revealed or flagged
          if (newRevealed[i][j] || flagged[i][j]) continue

          // Reveal this cell
          newRevealed[i][j] = true

          // If it's also a 0, add to queue
          if (grid[i][j] === 0) {
            queue.push({ row: i, col: j })
          }
        }
      }
    }
  }

  // Check if player has won
  const win = checkWin(grid, newRevealed)

  return {
    ...state,
    revealed: newRevealed,
    win,
    gameOver: win,
  }
}

export function toggleFlag(state: MinesweeperState, row: number, col: number): MinesweeperState {
  const { revealed, flagged, gameOver } = state

  // If game is over or cell is already revealed, do nothing
  if (gameOver || revealed[row][col]) {
    return state
  }

  // Create a copy of the flagged array
  const newFlagged = flagged.map((row) => [...row])

  // Toggle flag
  newFlagged[row][col] = !newFlagged[row][col]

  return {
    ...state,
    flagged: newFlagged,
  }
}

export function checkWin(grid: number[][], revealed: boolean[][]): boolean {
  const rows = grid.length
  const cols = grid[0].length

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // If a non-mine cell is not revealed, player hasn't won yet
      if (grid[row][col] !== -1 && !revealed[row][col]) {
        return false
      }
    }
  }

  return true
}

export function renderMinesweeper(ctx: CanvasRenderingContext2D, state: MinesweeperState) {
  const { grid, revealed, flagged, cellSize, gameOver, win } = state
  const rows = grid.length
  const cols = grid[0].length

  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Draw grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cellSize
      const y = row * cellSize

      // Draw cell background
      if (revealed[row][col]) {
        ctx.fillStyle = "#e0e0e0"
      } else {
        ctx.fillStyle = "#a0a0a0"
      }
      ctx.fillRect(x, y, cellSize, cellSize)

      // Draw cell border
      ctx.strokeStyle = "#808080"
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, cellSize, cellSize)

      if (revealed[row][col]) {
        // Cell is revealed
        if (grid[row][col] === -1) {
          // Draw mine
          ctx.fillStyle = gameOver && !win ? "#ff0000" : "#000000"
          ctx.beginPath()
          ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 3, 0, Math.PI * 2)
          ctx.fill()
        } else if (grid[row][col] > 0) {
          // Draw number
          ctx.fillStyle = getNumberColor(grid[row][col])
          ctx.font = `bold ${cellSize * 0.6}px Arial`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(grid[row][col].toString(), x + cellSize / 2, y + cellSize / 2)
        }
      } else if (flagged[row][col]) {
        // Draw flag
        ctx.fillStyle = "#ff0000"
        ctx.beginPath()
        ctx.moveTo(x + cellSize * 0.3, y + cellSize * 0.2)
        ctx.lineTo(x + cellSize * 0.7, y + cellSize * 0.35)
        ctx.lineTo(x + cellSize * 0.3, y + cellSize * 0.5)
        ctx.closePath()
        ctx.fill()

        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x + cellSize * 0.3, y + cellSize * 0.2)
        ctx.lineTo(x + cellSize * 0.3, y + cellSize * 0.8)
        ctx.stroke()
      }
    }
  }

  // Draw game over message
  if (gameOver) {
    // Reveal all mines
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col] === -1 && !revealed[row][col]) {
          const x = col * cellSize
          const y = row * cellSize

          // Draw mine
          ctx.fillStyle = "#000000"
          ctx.beginPath()
          ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
  }
}

function getNumberColor(num: number): string {
  switch (num) {
    case 1:
      return "#0000ff" // Blue
    case 2:
      return "#008000" // Green
    case 3:
      return "#ff0000" // Red
    case 4:
      return "#000080" // Navy
    case 5:
      return "#800000" // Maroon
    case 6:
      return "#008080" // Teal
    case 7:
      return "#000000" // Black
    case 8:
      return "#808080" // Gray
    default:
      return "#000000"
  }
}

export default function MinesweeperGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<MinesweeperState | null>(null)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [flagMode, setFlagMode] = useState(false)
  const [minesLeft, setMinesLeft] = useState(0)
  const isMobile = useMobile()

  // Initialize game
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size based on difficulty
    let rows, cols
    switch (difficulty) {
      case "easy":
        rows = 9
        cols = 9
        break
      case "medium":
        rows = 16
        cols = 16
        break
      case "hard":
        rows = 16
        cols = 30
        break
      default:
        rows = 9
        cols = 9
    }

    // Adjust for small screens
    if (window.innerWidth < 500) {
      if (difficulty === "hard") {
        rows = 12
        cols = 12
      } else if (difficulty === "medium") {
        rows = 10
        cols = 10
      }
    }

    const cellSize = Math.min(Math.floor(window.innerWidth / cols), 30)
    canvas.width = cols * cellSize
    canvas.height = rows * cellSize

    // Initialize game state
    const initialState = initializeMinesweeper(canvas.width, canvas.height, difficulty)
    setGameState(initialState)
    setMinesLeft(initialState.mines)

    // Handle window resize
    const handleResize = () => {
      if (gameState) {
        const newCellSize = Math.min(Math.floor(window.innerWidth / cols), 30)
        canvas.width = cols * newCellSize
        canvas.height = rows * newCellSize

        setGameState({
          ...gameState,
          cellSize: newCellSize,
        })

        renderMinesweeper(ctx, {
          ...gameState,
          cellSize: newCellSize,
        })
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [difficulty])

  // Update mines left counter
  useEffect(() => {
    if (!gameState) return

    const flaggedCount = gameState.flagged.flat().filter(Boolean).length
    setMinesLeft(gameState.mines - flaggedCount)
  }, [gameState])

  // Handle canvas click
  useEffect(() => {
    if (!canvasRef.current || !gameState) return

    const canvas = canvasRef.current

    const handleClick = (e: MouseEvent) => {
      if (gameState.gameOver) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const col = Math.floor(x / gameState.cellSize)
      const row = Math.floor(y / gameState.cellSize)

      if (row >= 0 && row < gameState.grid.length && col >= 0 && col < gameState.grid[0].length) {
        if (e.button === 2 || flagMode) {
          // Right click or flag mode - toggle flag
          setGameState(toggleFlag(gameState, row, col))
        } else {
          // Left click - reveal cell
          setGameState(revealCell(gameState, row, col))
        }
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()

      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      const col = Math.floor(x / gameState.cellSize)
      const row = Math.floor(y / gameState.cellSize)

      if (row >= 0 && row < gameState.grid.length && col >= 0 && col < gameState.grid[0].length) {
        if (flagMode) {
          // Flag mode - toggle flag
          setGameState(toggleFlag(gameState, row, col))
        } else {
          // Normal mode - reveal cell
          setGameState(revealCell(gameState, row, col))
        }
      }
    }

    canvas.addEventListener("mousedown", handleClick)
    canvas.addEventListener("contextmenu", handleContextMenu)
    canvas.addEventListener("touchstart", handleTouchStart)

    return () => {
      canvas.removeEventListener("mousedown", handleClick)
      canvas.removeEventListener("contextmenu", handleContextMenu)
      canvas.removeEventListener("touchstart", handleTouchStart)
    }
  }, [gameState, flagMode])

  // Render game
  useEffect(() => {
    if (!gameState || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    renderMinesweeper(ctx, gameState)
  }, [gameState])

  // Reset game
  const resetGame = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const initialState = initializeMinesweeper(canvas.width, canvas.height, difficulty)
    setGameState(initialState)
    setMinesLeft(initialState.mines)
  }

  // Change difficulty
  const changeDifficulty = (newDifficulty: "easy" | "medium" | "hard") => {
    setDifficulty(newDifficulty)
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Minesweeper</h2>

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

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{minesLeft}</span>
          <Bomb className="h-4 w-4" />
        </div>
      </div>

      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFlagMode(!flagMode)}
          className={flagMode ? "bg-red-100 dark:bg-red-900/30" : ""}
        >
          <Flag className={`h-4 w-4 mr-2 ${flagMode ? "text-red-500" : ""}`} />
          {flagMode ? "Flag Mode" : "Dig Mode"}
        </Button>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-lg" />

        {gameState?.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg text-center">
              {gameState.win ? (
                <>
                  <div className="flex justify-center mb-2">
                    <SmilePlus className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-xl font-bold mb-2">You Win!</p>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-2">
                    <Frown className="h-8 w-8 text-red-500" />
                  </div>
                  <p className="text-xl font-bold mb-2">Game Over!</p>
                </>
              )}
              <Button className="bg-primary hover:bg-primary/80" onClick={resetGame}>
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>

      {isMobile && (
        <div className="mt-4 text-sm text-center text-gray-500">
          <p>Tap to dig, use Flag Mode button to place flags</p>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <Button variant="outline" size="sm" onClick={resetGame} className="flex items-center gap-2">
          <Smile className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  )
}
