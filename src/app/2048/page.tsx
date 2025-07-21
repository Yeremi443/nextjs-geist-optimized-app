'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react'
import Link from 'next/link'

type Board = number[][]
type Direction = 'up' | 'down' | 'left' | 'right'

interface GameState {
  board: Board
  score: number
  bestScore: number
  isGameOver: boolean
  isWon: boolean
  hasWon2048: boolean
}

const GRID_SIZE = 4
const TARGET_SCORE = 2048

export default function Game2048Page() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0)),
    score: 0,
    bestScore: parseInt(localStorage.getItem('2048-best-score') || '0'),
    isGameOver: false,
    isWon: false,
    hasWon2048: false
  })

  const [animationKey, setAnimationKey] = useState(0)

  // Initialize empty board
  const createEmptyBoard = (): Board => {
    return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0))
  }

  // Get empty cells
  const getEmptyCells = (board: Board): [number, number][] => {
    const emptyCells: [number, number][] = []
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (board[i][j] === 0) {
          emptyCells.push([i, j])
        }
      }
    }
    return emptyCells
  }

  // Add random tile
  const addRandomTile = (board: Board): Board => {
    const emptyCells = getEmptyCells(board)
    if (emptyCells.length === 0) return board

    const newBoard = board.map(row => [...row])
    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    const [row, col] = emptyCells[randomIndex]
    newBoard[row][col] = Math.random() < 0.9 ? 2 : 4

    return newBoard
  }

  // Check if moves are available
  const canMove = (board: Board): boolean => {
    // Check for empty cells
    if (getEmptyCells(board).length > 0) return true

    // Check for possible merges
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const current = board[i][j]
        if (
          (i < GRID_SIZE - 1 && board[i + 1][j] === current) ||
          (j < GRID_SIZE - 1 && board[i][j + 1] === current)
        ) {
          return true
        }
      }
    }
    return false
  }

  // Move and merge logic
  const moveLeft = (board: Board): { newBoard: Board; scoreGained: number; moved: boolean } => {
    let scoreGained = 0
    let moved = false
    const newBoard = board.map(row => {
      // Filter out zeros
      const filtered = row.filter(cell => cell !== 0)
      
      // Merge adjacent same numbers
      const merged: number[] = []
      let i = 0
      while (i < filtered.length) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          const mergedValue = filtered[i] * 2
          merged.push(mergedValue)
          scoreGained += mergedValue
          i += 2
        } else {
          merged.push(filtered[i])
          i++
        }
      }

      // Fill with zeros
      const result = [...merged, ...Array(GRID_SIZE - merged.length).fill(0)]
      
      // Check if moved
      if (JSON.stringify(result) !== JSON.stringify(row)) {
        moved = true
      }
      
      return result
    })

    return { newBoard, scoreGained, moved }
  }

  // Rotate board 90 degrees clockwise
  const rotateBoard = (board: Board): Board => {
    const newBoard = createEmptyBoard()
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        newBoard[j][GRID_SIZE - 1 - i] = board[i][j]
      }
    }
    return newBoard
  }

  // Move in any direction
  const move = (direction: Direction): void => {
    setGameState(prev => {
      if (prev.isGameOver) return prev

      let boardToMove = prev.board
      let rotations = 0

      // Rotate board to convert all moves to left moves
      switch (direction) {
        case 'up':
          rotations = 3
          break
        case 'right':
          rotations = 2
          break
        case 'down':
          rotations = 1
          break
        case 'left':
          rotations = 0
          break
      }

      // Rotate board
      for (let i = 0; i < rotations; i++) {
        boardToMove = rotateBoard(boardToMove)
      }

      // Move left
      const { newBoard: movedBoard, scoreGained, moved } = moveLeft(boardToMove)

      if (!moved) return prev

      // Rotate back
      let finalBoard = movedBoard
      for (let i = 0; i < (4 - rotations) % 4; i++) {
        finalBoard = rotateBoard(finalBoard)
      }

      // Add random tile
      const boardWithNewTile = addRandomTile(finalBoard)

      // Check for 2048
      const hasWon2048 = finalBoard.some(row => row.some(cell => cell >= TARGET_SCORE))
      const isWon = hasWon2048 && !prev.hasWon2048

      // Check game over
      const isGameOver = !canMove(boardWithNewTile)

      // Update best score
      const newScore = prev.score + scoreGained
      let newBestScore = prev.bestScore
      if (newScore > prev.bestScore) {
        newBestScore = newScore
        localStorage.setItem('2048-best-score', newScore.toString())
      }

      setAnimationKey(key => key + 1)

      return {
        ...prev,
        board: boardWithNewTile,
        score: newScore,
        bestScore: newBestScore,
        isGameOver,
        isWon,
        hasWon2048: hasWon2048 || prev.hasWon2048
      }
    })
  }

  // Handle keyboard input
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        move('up')
        break
      case 'ArrowDown':
        event.preventDefault()
        move('down')
        break
      case 'ArrowLeft':
        event.preventDefault()
        move('left')
        break
      case 'ArrowRight':
        event.preventDefault()
        move('right')
        break
    }
  }, [])

  // Initialize game
  const initGame = useCallback(() => {
    let newBoard = createEmptyBoard()
    newBoard = addRandomTile(newBoard)
    newBoard = addRandomTile(newBoard)

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      score: 0,
      isGameOver: false,
      isWon: false,
      hasWon2048: false
    }))

    setAnimationKey(key => key + 1)
  }, [])

  // Event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  // Initialize game on mount
  useEffect(() => {
    initGame()
  }, [initGame])

  // Get tile color
  const getTileColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      2: 'bg-gray-200 text-gray-800',
      4: 'bg-gray-300 text-gray-800',
      8: 'bg-orange-300 text-white',
      16: 'bg-orange-400 text-white',
      32: 'bg-orange-500 text-white',
      64: 'bg-red-400 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-yellow-600 text-white',
      1024: 'bg-purple-500 text-white',
      2048: 'bg-purple-600 text-white',
    }
    return colors[value] || 'bg-pink-500 text-white'
  }

  // Get tile font size
  const getTileFontSize = (value: number): string => {
    if (value < 100) return 'text-2xl'
    if (value < 1000) return 'text-xl'
    return 'text-lg'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4 border-gray-600 text-white hover:bg-gray-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Button>
          </Link>
          
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            🎯 2048
          </h1>
          <p className="text-gray-300">¡Combina números para llegar a 2048!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Game Board */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex gap-4">
              <Card className="bg-gray-800/50 border-gray-700 px-4 py-2">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Puntuación</div>
                  <div className="text-xl font-bold text-white">{gameState.score}</div>
                </div>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700 px-4 py-2">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Mejor</div>
                  <div className="text-xl font-bold text-yellow-500">{gameState.bestScore}</div>
                </div>
              </Card>
            </div>

            <Card className="bg-gray-700 border-gray-600 p-4">
              <div 
                key={animationKey}
                className="grid grid-cols-4 gap-2 w-80 h-80"
              >
                {gameState.board.flat().map((value, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center justify-center rounded-lg font-bold transition-all duration-200
                      ${value === 0 
                        ? 'bg-gray-600' 
                        : `${getTileColor(value)} transform hover:scale-105`
                      }
                      ${getTileFontSize(value)}
                    `}
                  >
                    {value !== 0 && value}
                  </div>
                ))}
              </div>
            </Card>

            {/* Mobile Controls */}
            <div className="mt-4 grid grid-cols-3 gap-2 lg:hidden">
              <div></div>
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
                onClick={() => move('up')}
              >
                ↑
              </Button>
              <div></div>
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
                onClick={() => move('left')}
              >
                ←
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
                onClick={() => move('down')}
              >
                ↓
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
                onClick={() => move('right')}
              >
                →
              </Button>
            </div>
          </div>

          {/* Game Info and Controls */}
          <div className="space-y-6">
            {/* Game Status */}
            {(gameState.isWon || gameState.isGameOver) && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="pt-6">
                  {gameState.isWon && (
                    <div className="text-center mb-4">
                      <Trophy className="mx-auto h-12 w-12 text-yellow-500 mb-2" />
                      <h2 className="text-2xl font-bold text-yellow-500">¡Ganaste!</h2>
                      <p className="text-gray-300">¡Llegaste a 2048!</p>
                    </div>
                  )}
                  {gameState.isGameOver && (
                    <div className="text-center mb-4">
                      <h2 className="text-2xl font-bold text-red-500">Game Over</h2>
                      <p className="text-gray-300">No hay más movimientos posibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Controls */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Controles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={initGame}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Nuevo Juego
                </Button>
                
                <div className="text-sm text-gray-400 space-y-1">
                  <p><kbd className="bg-gray-700 px-2 py-1 rounded">↑↓←→</kbd> Mover fichas</p>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Ficha más alta:</span>
                  <Badge variant="secondary" className="bg-purple-600 text-white">
                    {Math.max(...gameState.board.flat())}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Fichas en tablero:</span>
                  <span className="text-white font-semibold">
                    {gameState.board.flat().filter(cell => cell !== 0).length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Cómo Jugar</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 text-sm space-y-2">
                <p>• Usa las flechas del teclado para mover las fichas</p>
                <p>• Cuando dos fichas con el mismo número se tocan, se combinan</p>
                <p>• ¡El objetivo es crear una ficha con el número 2048!</p>
                <p>• El juego termina cuando no puedes hacer más movimientos</p>
                <p>• ¡Puedes continuar jugando después de llegar a 2048!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}