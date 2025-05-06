"use client"

import { useEffect, useRef, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

export type TicTacToeState = {
  board: string[][]
  currentPlayer: "X" | "O"
  winner: string | null
  gameOver: boolean
  cellSize: number
}

export function initializeTicTacToe(width: number, height: number): TicTacToeState {
  const cellSize = Math.min(width, height) / 3

  return {
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    currentPlayer: "X",
    winner: null,
    gameOver: false,
    cellSize,
  }
}

export function checkWinner(board: string[][]): string | null {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
      return board[i][0]
    }
  }

  // Check columns
  for (let j = 0; j < 3; j++) {
    if (board[0][j] && board[0][j] === board[1][j] && board[0][j] === board[2][j]) {
      return board[0][j]
    }
  }

  // Check diagonals
  if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
    return board[0][0]
  }

  if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
    return board[0][2]
  }

  return null
}

export function isBoardFull(board: string[][]): boolean {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!board[i][j]) {
        return false
      }
    }
  }
  return true
}

export function getAIMove(board: string[][]): { row: number; col: number } | null {
  // Check if AI can win
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!board[i][j]) {
        // Try this move
        board[i][j] = "O"
        if (checkWinner(board) === "O") {
          board[i][j] = "" // Reset
          return { row: i, col: j }
        }
        board[i][j] = "" // Reset
      }
    }
  }

  // Check if player can win and block
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!board[i][j]) {
        // Try this move
        board[i][j] = "X"
        if (checkWinner(board) === "X") {
          board[i][j] = "" // Reset
          return { row: i, col: j }
        }
        board[i][j] = "" // Reset
      }
    }
  }

  // Take center if available
  if (!board[1][1]) {
    return { row: 1, col: 1 }
  }

  // Take corners if available
  const corners = [
    { row: 0, col: 0 },
    { row: 0, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 2 },
  ]

  const availableCorners = corners.filter((corner) => !board[corner.row][corner.col])
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)]
  }

  // Take any available edge
  const edges = [
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: 2 },
    { row: 2, col: 1 },
  ]

  const availableEdges = edges.filter((edge) => !board[edge.row][edge.col])
  if (availableEdges.length > 0) {
    return availableEdges[Math.floor(Math.random() * availableEdges.length)]
  }

  return null
}

export function renderTicTacToe(ctx: CanvasRenderingContext2D, gameState: TicTacToeState) {
  const { board, cellSize, winner, gameOver } = gameState

  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Draw board
  ctx.strokeStyle = "#333"
  ctx.lineWidth = 4

  // Vertical lines
  ctx.beginPath()
  ctx.moveTo(cellSize, 0)
  ctx.lineTo(cellSize, cellSize * 3)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(cellSize * 2, 0)
  ctx.lineTo(cellSize * 2, cellSize * 3)
  ctx.stroke()

  // Horizontal lines
  ctx.beginPath()
  ctx.moveTo(0, cellSize)
  ctx.lineTo(cellSize * 3, cellSize)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(0, cellSize * 2)
  ctx.lineTo(cellSize * 3, cellSize * 2)
  ctx.stroke()

  // Draw X's and O's
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const x = j * cellSize
      const y = i * cellSize

      if (board[i][j] === "X") {
        // Draw X
        ctx.strokeStyle = "#e74c3c"
        ctx.lineWidth = 8

        const padding = cellSize * 0.2

        ctx.beginPath()
        ctx.moveTo(x + padding, y + padding)
        ctx.lineTo(x + cellSize - padding, y + cellSize - padding)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x + cellSize - padding, y + padding)
        ctx.lineTo(x + padding, y + cellSize - padding)
        ctx.stroke()
      } else if (board[i][j] === "O") {
        // Draw O
        ctx.strokeStyle = "#3498db"
        ctx.lineWidth = 8

        const padding = cellSize * 0.2
        const radius = cellSize / 2 - padding

        ctx.beginPath()
        ctx.arc(x + cellSize / 2, y + cellSize / 2, radius, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
  }

  // Draw game status
  ctx.fillStyle = "#333"
  ctx.font = "24px Arial"
  ctx.textAlign = "center"

  if (winner) {
    ctx.fillStyle = winner === "X" ? "#e74c3c" : "#3498db"
    ctx.fillText(`${winner} Wins!`, ctx.canvas.width / 2, ctx.canvas.height + 40)
  } else if (gameOver) {
    ctx.fillText("Draw!", ctx.canvas.width / 2, ctx.canvas.height + 40)
  } else {
    ctx.fillStyle = gameState.currentPlayer === "X" ? "#e74c3c" : "#3498db"
    ctx.fillText(`${gameState.currentPlayer}'s Turn`, ctx.canvas.width / 2, ctx.canvas.height + 40)
  }
}

export default function TicTacToeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<TicTacToeState | null>(null)
  const [vsAI, setVsAI] = useState(true)
  const isMobile = useMobile()

  // Initialize game
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const size = Math.min(300, window.innerWidth - 40)
    canvas.width = size
    canvas.height = size

    // Initialize game state
    const initialState = initializeTicTacToe(canvas.width, canvas.height)
    setGameState(initialState)

    // Handle window resize
    const handleResize = () => {
      const newSize = Math.min(300, window.innerWidth - 40)
      canvas.width = newSize
      canvas.height = newSize

      if (gameState) {
        setGameState({
          ...gameState,
          cellSize: newSize / 3,
        })
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Handle AI moves
  useEffect(() => {
    if (!gameState || !vsAI || gameState.gameOver || gameState.currentPlayer !== "O") return

    // Add a small delay before AI move
    const aiMoveTimeout = setTimeout(() => {
      const move = getAIMove(gameState.board)

      if (move) {
        const newBoard = gameState.board.map((row) => [...row])
        newBoard[move.row][move.col] = "O"

        const winner = checkWinner(newBoard)
        const boardFull = isBoardFull(newBoard)

        setGameState({
          ...gameState,
          board: newBoard,
          currentPlayer: "X",
          winner,
          gameOver: !!winner || boardFull,
        })
      }
    }, 500)

    return () => {
      clearTimeout(aiMoveTimeout)
    }
  }, [gameState, vsAI])

  // Handle player moves
  const handleCellClick = (row: number, col: number) => {
    if (!gameState || gameState.board[row][col] || gameState.gameOver) return

    const newBoard = gameState.board.map((r) => [...r])
    newBoard[row][col] = gameState.currentPlayer

    const winner = checkWinner(newBoard)
    const boardFull = isBoardFull(newBoard)

    setGameState({
      ...gameState,
      board: newBoard,
      currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
      winner,
      gameOver: !!winner || boardFull,
    })
  }

  // Handle canvas click
  useEffect(() => {
    if (!canvasRef.current || !gameState) return

    const canvas = canvasRef.current

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const col = Math.floor(x / gameState.cellSize)
      const row = Math.floor(y / gameState.cellSize)

      if (row >= 0 && row < 3 && col >= 0 && col < 3) {
        handleCellClick(row, col)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      const col = Math.floor(x / gameState.cellSize)
      const row = Math.floor(y / gameState.cellSize)

      if (row >= 0 && row < 3 && col >= 0 && col < 3) {
        handleCellClick(row, col)
      }
    }

    canvas.addEventListener("click", handleClick)
    canvas.addEventListener("touchstart", handleTouchStart)

    return () => {
      canvas.removeEventListener("click", handleClick)
      canvas.removeEventListener("touchstart", handleTouchStart)
    }
  }, [gameState])

  // Render game
  useEffect(() => {
    if (!gameState || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    renderTicTacToe(ctx, gameState)
  }, [gameState])

  // Reset game
  const resetGame = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const initialState = initializeTicTacToe(canvas.width, canvas.height)
    setGameState(initialState)
  }

  // Toggle AI opponent
  const toggleAI = () => {
    setVsAI(!vsAI)
    resetGame()
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Tic Tac Toe</h2>

      <div className="mb-4">
        <button
          className={`px-4 py-2 rounded-l-md ${vsAI ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => vsAI || toggleAI()}
        >
          vs AI
        </button>
        <button
          className={`px-4 py-2 rounded-r-md ${!vsAI ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => vsAI && toggleAI()}
        >
          2 Players
        </button>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-lg" />

        {gameState?.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
            <div className="bg-white p-4 rounded-md shadow-lg text-center">
              {gameState.winner ? (
                <p className="text-xl font-bold mb-2">{gameState.winner === "X" ? "X Wins!" : "O Wins!"}</p>
              ) : (
                <p className="text-xl font-bold mb-2">Draw!</p>
              )}
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80" onClick={resetGame}>
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {isMobile && <p className="mt-4 text-sm text-center text-gray-500">Tap on a cell to make your move</p>}
    </div>
  )
}
