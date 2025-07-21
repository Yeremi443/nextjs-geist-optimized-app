'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Pause, Play, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface Position {
  x: number
  y: number
}

interface GameState {
  snake: Position[]
  food: Position
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
  isGameOver: boolean
  isPaused: boolean
  score: number
  highScore: number
}

const GRID_SIZE = 20
const CANVAS_SIZE = 400

export default function SnakePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: 'RIGHT',
    isGameOver: false,
    isPaused: true,
    score: 0,
    highScore: parseInt(localStorage.getItem('snake-high-score') || '0')
  })

  // Generate random food position
  const generateFood = useCallback((snake: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  // Initialize game
  const initGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }]
    setGameState(prev => ({
      ...prev,
      snake: initialSnake,
      food: generateFood(initialSnake),
      direction: 'RIGHT',
      isGameOver: false,
      isPaused: true,
      score: 0
    }))
  }, [generateFood])

  // Move snake
  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.isPaused || prev.isGameOver) return prev

      const newSnake = [...prev.snake]
      const head = { ...newSnake[0] }

      // Move head based on direction
      switch (prev.direction) {
        case 'UP':
          head.y -= 1
          break
        case 'DOWN':
          head.y += 1
          break
        case 'LEFT':
          head.x -= 1
          break
        case 'RIGHT':
          head.x += 1
          break
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return { ...prev, isGameOver: true, isPaused: true }
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, isGameOver: true, isPaused: true }
      }

      newSnake.unshift(head)

      // Check food collision
      let newFood = prev.food
      let newScore = prev.score
      if (head.x === prev.food.x && head.y === prev.food.y) {
        newFood = generateFood(newSnake)
        newScore += 10
      } else {
        newSnake.pop()
      }

      // Update high score
      let newHighScore = prev.highScore
      if (newScore > prev.highScore) {
        newHighScore = newScore
        localStorage.setItem('snake-high-score', newScore.toString())
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        highScore: newHighScore
      }
    })
  }, [generateFood])

  // Handle keyboard input
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    setGameState(prev => {
      if (prev.isGameOver) return prev

      let newDirection = prev.direction

      switch (event.key) {
        case 'ArrowUp':
          if (prev.direction !== 'DOWN') newDirection = 'UP'
          break
        case 'ArrowDown':
          if (prev.direction !== 'UP') newDirection = 'DOWN'
          break
        case 'ArrowLeft':
          if (prev.direction !== 'RIGHT') newDirection = 'LEFT'
          break
        case 'ArrowRight':
          if (prev.direction !== 'LEFT') newDirection = 'RIGHT'
          break
        case ' ':
          event.preventDefault()
          return { ...prev, isPaused: !prev.isPaused }
      }

      return { ...prev, direction: newDirection, isPaused: false }
    })
  }, [])

  // Draw game
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw grid
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID_SIZE; i++) {
      const pos = (i * CANVAS_SIZE) / GRID_SIZE
      ctx.beginPath()
      ctx.moveTo(pos, 0)
      ctx.lineTo(pos, CANVAS_SIZE)
      ctx.moveTo(0, pos)
      ctx.lineTo(CANVAS_SIZE, pos)
      ctx.stroke()
    }

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      const x = (segment.x * CANVAS_SIZE) / GRID_SIZE
      const y = (segment.y * CANVAS_SIZE) / GRID_SIZE
      const size = CANVAS_SIZE / GRID_SIZE

      if (index === 0) {
        // Head
        ctx.fillStyle = '#10b981'
        ctx.fillRect(x + 1, y + 1, size - 2, size - 2)
        // Eyes
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(x + size * 0.2, y + size * 0.2, size * 0.15, size * 0.15)
        ctx.fillRect(x + size * 0.65, y + size * 0.2, size * 0.15, size * 0.15)
      } else {
        // Body
        ctx.fillStyle = '#059669'
        ctx.fillRect(x + 1, y + 1, size - 2, size - 2)
      }
    })

    // Draw food
    const foodX = (gameState.food.x * CANVAS_SIZE) / GRID_SIZE
    const foodY = (gameState.food.y * CANVAS_SIZE) / GRID_SIZE
    const foodSize = CANVAS_SIZE / GRID_SIZE
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(
      foodX + foodSize / 2,
      foodY + foodSize / 2,
      foodSize / 2 - 2,
      0,
      2 * Math.PI
    )
    ctx.fill()

    // Draw game over overlay
    if (gameState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px Inter'
      ctx.textAlign = 'center'
      ctx.fillText('GAME OVER', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20)
      
      ctx.font = '16px Inter'
      ctx.fillText(`Score: ${gameState.score}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 10)
    }
  }, [gameState])

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      moveSnake()
    }, 150)

    return () => clearInterval(gameLoop)
  }, [moveSnake])

  // Event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  // Draw
  useEffect(() => {
    draw()
  }, [draw])

  // Initialize game on mount
  useEffect(() => {
    initGame()
  }, [initGame])

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))
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
          
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            🐍 Snake Game
          </h1>
          <p className="text-gray-300">¡Come la comida y crece sin tocarte a ti mismo!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Game Canvas */}
          <div className="flex flex-col items-center">
            <Card className="bg-gray-800/50 border-gray-700 p-4">
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="border border-gray-600 rounded"
                style={{ imageRendering: 'pixelated' }}
              />
            </Card>
            
            {/* Mobile Controls */}
            <div className="mt-4 grid grid-cols-3 gap-2 lg:hidden">
              <div></div>
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
                onClick={() => handleKeyPress({ key: 'ArrowUp' } as KeyboardEvent)}
              >
                ↑
              </Button>
              <div></div>
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
                onClick={() => handleKeyPress({ key: 'ArrowLeft' } as KeyboardEvent)}
              >
                ←
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
                onClick={() => handleKeyPress({ key: 'ArrowDown' } as KeyboardEvent)}
              >
                ↓
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
                onClick={() => handleKeyPress({ key: 'ArrowRight' } as KeyboardEvent)}
              >
                →
              </Button>
            </div>
          </div>

          {/* Game Info and Controls */}
          <div className="space-y-6">
            {/* Score */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Puntuación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Actual:</span>
                  <Badge variant="secondary" className="bg-green-600 text-white text-lg px-3 py-1">
                    {gameState.score}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Mejor:</span>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500 text-lg px-3 py-1">
                    {gameState.highScore}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Longitud:</span>
                  <span className="text-white font-semibold">{gameState.snake.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Controles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={togglePause}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={gameState.isGameOver}
                  >
                    {gameState.isPaused ? (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Jugar
                      </>
                    ) : (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Pausa
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={initGame}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reiniciar
                  </Button>
                </div>
                
                <div className="text-sm text-gray-400 space-y-1">
                  <p><kbd className="bg-gray-700 px-2 py-1 rounded">↑↓←→</kbd> Mover</p>
                  <p><kbd className="bg-gray-700 px-2 py-1 rounded">Espacio</kbd> Pausa</p>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Cómo Jugar</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 text-sm space-y-2">
                <p>• Usa las flechas del teclado para mover la serpiente</p>
                <p>• Come la comida roja para crecer y ganar puntos</p>
                <p>• Evita chocar contra las paredes o contra ti mismo</p>
                <p>• Cada comida vale 10 puntos</p>
                <p>• ¡Intenta superar tu puntuación más alta!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}