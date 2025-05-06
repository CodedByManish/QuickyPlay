"use client"

import { useEffect, useState, useRef } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Eraser, RotateCcw, Lightbulb } from "lucide-react"

type SudokuCell = {
  value: number | null
  isGiven: boolean
  notes: number[]
  isHighlighted: boolean
  isError: boolean
}

type SudokuBoard = SudokuCell[][]

export default function SudokuGame() {
  const [board, setBoard] = useState<SudokuBoard>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [isNoteMode, setIsNoteMode] = useState(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [gameComplete, setGameComplete] = useState(false)
  const [errors, setErrors] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useMobile()

  // Initialize board
  useEffect(() => {
    generateNewGame(difficulty)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Timer
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerRunning])

  // Generate a new game
  const generateNewGame = (diff: "easy" | "medium" | "hard") => {
    setDifficulty(diff)
    setSelectedCell(null)
    setGameComplete(false)
    setErrors(0)
    setTimer(0)
    setIsTimerRunning(true)

    // Create an empty board
    const emptyBoard: SudokuBoard = Array(9)
      .fill(null)
      .map(() =>
        Array(9)
          .fill(null)
          .map(() => ({
            value: null,
            isGiven: false,
            notes: [],
            isHighlighted: false,
            isError: false,
          })),
      )

    // Generate a solved board
    const solvedBoard = generateSolvedBoard(emptyBoard)

    // Remove numbers based on difficulty
    let cellsToRemove: number
    switch (diff) {
      case "easy":
        cellsToRemove = 40 // 41 clues
        break
      case "medium":
        cellsToRemove = 50 // 31 clues
        break
      case "hard":
        cellsToRemove = 60 // 21 clues
        break
    }

    const gameBoard = removeNumbers(solvedBoard, cellsToRemove)
    setBoard(gameBoard)
  }

  // Generate a solved Sudoku board
  const generateSolvedBoard = (board: SudokuBoard): SudokuBoard => {
    const newBoard = JSON.parse(JSON.stringify(board))

    // Simple algorithm to generate a valid Sudoku board
    // This is a basic implementation and could be improved
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]

    // Fill diagonal 3x3 boxes first (these can be filled independently)
    for (let box = 0; box < 9; box += 3) {
      const shuffled = [...nums].sort(() => Math.random() - 0.5)
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          newBoard[box + i][box + j].value = shuffled[i * 3 + j]
        }
      }
    }

    // Solve the rest of the board
    solveSudoku(newBoard)

    return newBoard
  }

  // Solve the Sudoku board using backtracking
  const solveSudoku = (board: SudokuBoard): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col].value === null) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)

          for (const num of nums) {
            if (isValidPlacement(board, row, col, num)) {
              board[row][col].value = num

              if (solveSudoku(board)) {
                return true
              }

              board[row][col].value = null
            }
          }

          return false
        }
      }
    }

    return true
  }

  // Check if a number can be placed in a cell
  const isValidPlacement = (board: SudokuBoard, row: number, col: number, num: number): boolean => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (board[row][i].value === num) {
        return false
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col].value === num) {
        return false
      }
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j].value === num) {
          return false
        }
      }
    }

    return true
  }

  // Remove numbers from the board to create a puzzle
  const removeNumbers = (board: SudokuBoard, count: number): SudokuBoard => {
    const newBoard = JSON.parse(JSON.stringify(board))
    let removed = 0

    while (removed < count) {
      const row = Math.floor(Math.random() * 9)
      const col = Math.floor(Math.random() * 9)

      if (newBoard[row][col].value !== null && !newBoard[row][col].isGiven) {
        newBoard[row][col].value = null
        removed++
      }
    }

    // Mark remaining numbers as given
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (newBoard[row][col].value !== null) {
          newBoard[row][col].isGiven = true
        }
      }
    }

    return newBoard
  }

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (gameComplete) return

    // Update highlighted cells
    const newBoard = board.map((boardRow, r) =>
      boardRow.map((cell, c) => ({
        ...cell,
        isHighlighted:
          r === row ||
          c === col ||
          (Math.floor(r / 3) === Math.floor(row / 3) && Math.floor(c / 3) === Math.floor(col / 3)),
      })),
    )

    setBoard(newBoard)
    setSelectedCell({ row, col })
  }

  // Handle number input
  const handleNumberInput = (num: number) => {
    if (!selectedCell || gameComplete) return

    const { row, col } = selectedCell

    // Don't modify given cells
    if (board[row][col].isGiven) return

    const newBoard = [...board]

    if (isNoteMode) {
      // Toggle note
      const notes = [...newBoard[row][col].notes]
      const noteIndex = notes.indexOf(num)

      if (noteIndex === -1) {
        notes.push(num)
      } else {
        notes.splice(noteIndex, 1)
      }

      newBoard[row][col] = {
        ...newBoard[row][col],
        notes,
      }
    } else {
      // Check if the number is valid
      const isValid = isValidPlacement(board, row, col, num)

      if (!isValid) {
        setErrors((prev) => prev + 1)
      }

      // Clear notes when setting a value
      newBoard[row][col] = {
        ...newBoard[row][col],
        value: num,
        notes: [],
        isError: !isValid,
      }

      // Check if the game is complete
      if (isBoardComplete(newBoard)) {
        setGameComplete(true)
        setIsTimerRunning(false)
      }
    }

    setBoard(newBoard)
  }

  // Handle eraser
  const handleErase = () => {
    if (!selectedCell || gameComplete) return

    const { row, col } = selectedCell

    // Don't erase given cells
    if (board[row][col].isGiven) return

    const newBoard = [...board]
    newBoard[row][col] = {
      ...newBoard[row][col],
      value: null,
      notes: [],
      isError: false,
    }

    setBoard(newBoard)
  }

  // Check if the board is complete and correct
  const isBoardComplete = (board: SudokuBoard): boolean => {
    // Check if all cells are filled
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col].value === null || board[row][col].isError) {
          return false
        }
      }
    }

    return true
  }

  // Format timer
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Get hint
  const getHint = () => {
    if (!selectedCell || gameComplete) return

    const { row, col } = selectedCell

    // Don't give hints for given cells or already filled cells
    if (board[row][col].isGiven || board[row][col].value !== null) return

    // Find the correct value for this cell
    const solvedBoard = JSON.parse(JSON.stringify(board))
    solveSudoku(solvedBoard)

    const correctValue = solvedBoard[row][col].value

    // Update the board
    const newBoard = [...board]
    newBoard[row][col] = {
      ...newBoard[row][col],
      value: correctValue,
      notes: [],
      isError: false,
    }

    setBoard(newBoard)

    // Check if the game is complete
    if (isBoardComplete(newBoard)) {
      setGameComplete(true)
      setIsTimerRunning(false)
    }
  }

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Game header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              variant={difficulty === "easy" ? "default" : "outline"}
              size="sm"
              onClick={() => generateNewGame("easy")}
              className={difficulty === "easy" ? "bg-primary" : ""}
            >
              Easy
            </Button>
            <Button
              variant={difficulty === "medium" ? "default" : "outline"}
              size="sm"
              onClick={() => generateNewGame("medium")}
              className={difficulty === "medium" ? "bg-primary" : ""}
            >
              Medium
            </Button>
            <Button
              variant={difficulty === "hard" ? "default" : "outline"}
              size="sm"
              onClick={() => generateNewGame("hard")}
              className={difficulty === "hard" ? "bg-primary" : ""}
            >
              Hard
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">{formatTime(timer)}</div>
            <div className="text-sm font-medium text-red-500">Errors: {errors}</div>
          </div>
        </div>

        {/* Sudoku board */}
        <div className="aspect-square w-full bg-background border-2 border-primary/30 rounded-lg overflow-hidden mb-4">
          {board.length > 0 && (
            <div className="grid grid-cols-9 h-full">
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      relative border border-gray-300 flex items-center justify-center cursor-pointer
                      ${cell.isHighlighted ? "bg-primary/10" : ""}
                      ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? "bg-primary/20" : ""}
                      ${cell.isGiven ? "font-bold" : ""}
                      ${cell.isError ? "text-red-500" : ""}
                      ${rowIndex % 3 === 2 && rowIndex < 8 ? "border-b-2 border-b-primary/30" : ""}
                      ${colIndex % 3 === 2 && colIndex < 8 ? "border-r-2 border-r-primary/30" : ""}
                    `}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell.value ? (
                      <span className="text-lg">{cell.value}</span>
                    ) : (
                      <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                          <div key={num} className="flex items-center justify-center">
                            {cell.notes.includes(num) && <span className="text-[8px] text-gray-500">{num}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )),
              )}
            </div>
          )}
        </div>

        {/* Number pad */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outline"
              className="aspect-square text-lg font-bold"
              onClick={() => handleNumberInput(num)}
            >
              {num}
            </Button>
          ))}
          <Button
            variant={isNoteMode ? "default" : "outline"}
            className={`aspect-square ${isNoteMode ? "bg-primary" : ""}`}
            onClick={() => setIsNoteMode(!isNoteMode)}
          >
            {isNoteMode ? "Notes On" : "Notes"}
          </Button>
        </div>

        {/* Controls */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleErase} className="flex items-center gap-2">
            <Eraser className="h-4 w-4" />
            Erase
          </Button>
          <Button variant="outline" onClick={() => generateNewGame(difficulty)} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            New Game
          </Button>
          <Button variant="outline" onClick={getHint} className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Hint
          </Button>
        </div>
      </div>

      {/* Game complete modal */}
      {gameComplete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">Congratulations!</h2>
            <p className="text-center mb-4">You completed the {difficulty} puzzle!</p>
            <p className="text-center mb-6">
              Time: {formatTime(timer)} | Errors: {errors}
            </p>
            <div className="flex justify-center">
              <Button onClick={() => generateNewGame(difficulty)}>Play Again</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
