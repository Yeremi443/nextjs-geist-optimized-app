'use client'

import { useState, useEffect } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { CarreraProfesional } from '@/types/game'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GameRoom } from '@/components/game/GameRoom'
import { GameUI } from '@/components/game/GameUI'
import { Sidebar } from '@/components/game/Sidebar'

const CARRERAS: { value: CarreraProfesional; label: string; descripcion: string }[] = [
  {
    value: 'modelo',
    label: 'Modelo de Ropa',
    descripcion: 'Especialízate en moda, estética y poses para redes sociales'
  },
  {
    value: 'streamer',
    label: 'Streamer',
    descripcion: 'Transmite videojuegos y entretén a tu audiencia en vivo'
  },
  {
    value: 'musico',
    label: 'Músico',
    descripcion: 'Crea y comparte música original para ganar seguidores'
  },
  {
    value: 'contador-historias',
    label: 'Contador de Historias',
    descripcion: 'Narra historias cautivadoras y conecta emocionalmente'
  },
  {
    value: 'fitness',
    label: 'Influencer Fitness',
    descripcion: 'Inspira con rutinas de ejercicio y consejos de salud'
  },
  {
    value: 'belleza',
    label: 'Influencer de Belleza',
    descripcion: 'Comparte tutoriales de maquillaje y cuidado personal'
  },
  {
    value: 'cosas-locas',
    label: 'Contenido Loco',
    descripcion: 'Realiza retos extremos y contenido viral divertido'
  },
  {
    value: 'periodista',
    label: 'Periodista Digital',
    descripcion: 'Investiga y comparte noticias y controversias'
  }
]

export default function JuegoPage() {
  const {
    estado,
    iniciarNuevoJuego,
    cargarJuego,
    avanzarTiempo
  } = useGameState()

  const [mostrarCreacion, setMostrarCreacion] = useState(false)
  const [nombreJugador, setNombreJugador] = useState('')
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<CarreraProfesional | ''>('')
  const [juegoGuardadoExiste, setJuegoGuardadoExiste] = useState(false)

  // Verificar si existe un juego guardado al cargar
  useEffect(() => {
    const savedGame = localStorage.getItem('influencer-x-save')
    setJuegoGuardadoExiste(!!savedGame)
  }, [])

  // Auto-avanzar tiempo cada 30 segundos (simulación)
  useEffect(() => {
    if (estado.juegoIniciado && !estado.juegoEnPausa) {
      const interval = setInterval(() => {
        avanzarTiempo()
      }, 30000) // 30 segundos = 1 hora del juego

      return () => clearInterval(interval)
    }
  }, [estado.juegoIniciado, estado.juegoEnPausa, avanzarTiempo])

  const handleIniciarNuevoJuego = () => {
    if (nombreJugador.trim() && carreraSeleccionada) {
      iniciarNuevoJuego(nombreJugador.trim(), carreraSeleccionada)
      setMostrarCreacion(false)
    }
  }

  const handleCargarJuego = () => {
    cargarJuego()
  }

  // Pantalla de inicio/menú
  if (!estado.juegoIniciado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              INFLUENCER X
            </h1>
            <p className="text-gray-300">Tu camino hacia la fama digital comienza aquí</p>
          </div>

          {!mostrarCreacion ? (
            <div className="max-w-md mx-auto space-y-4">
              <Button 
                onClick={() => setMostrarCreacion(true)}
                className="w-full bg-white text-black hover:bg-gray-200"
                size="lg"
              >
                NUEVO JUEGO
              </Button>
              
              {juegoGuardadoExiste && (
                <Button 
                  onClick={handleCargarJuego}
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white hover:text-black"
                  size="lg"
                >
                  CONTINUAR JUEGO
                </Button>
              )}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-center">Crear Nuevo Personaje</CardTitle>
                  <CardDescription className="text-gray-300 text-center">
                    Elige tu nombre y carrera profesional
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-white">Nombre del Influencer</Label>
                    <Input
                      id="nombre"
                      value={nombreJugador}
                      onChange={(e) => setNombreJugador(e.target.value)}
                      placeholder="Ingresa tu nombre..."
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Carrera Profesional</Label>
                    <Select value={carreraSeleccionada} onValueChange={(value) => setCarreraSeleccionada(value as CarreraProfesional)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Selecciona tu especialidad..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {CARRERAS.map((carrera) => (
                          <SelectItem key={carrera.value} value={carrera.value} className="text-white hover:bg-gray-700">
                            <div>
                              <div className="font-medium">{carrera.label}</div>
                              <div className="text-sm text-gray-400">{carrera.descripcion}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      onClick={() => setMostrarCreacion(false)}
                      variant="outline"
                      className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleIniciarNuevoJuego}
                      disabled={!nombreJugador.trim() || !carreraSeleccionada}
                      className="flex-1 bg-white text-black hover:bg-gray-200"
                    >
                      Comenzar Aventura
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Pantalla principal del juego
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-4">
        {/* Header del juego */}
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{estado.jugador.nombre}</h1>
            <p className="text-gray-400">
              {CARRERAS.find(c => c.value === estado.jugador.carrera)?.label} - Día {estado.dia}, {estado.hora}:00
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{estado.jugador.estadisticas.seguidores.toLocaleString()} seguidores</p>
            <p className="text-green-400">${estado.jugador.estadisticas.dinero}</p>
          </div>
        </div>

        {/* Layout principal del juego */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-120px)]">
          {/* Cuarto del jugador */}
          <div className="lg:col-span-2">
            <GameRoom estado={estado} />
          </div>

          {/* Panel de acciones */}
          <div className="lg:col-span-1">
            <GameUI estado={estado} />
          </div>

          {/* Sidebar de eventos */}
          <div className="lg:col-span-1">
            <Sidebar estado={estado} />
          </div>
        </div>
      </div>
    </div>
  )
}
