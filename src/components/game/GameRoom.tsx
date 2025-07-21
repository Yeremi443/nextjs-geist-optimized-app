'use client'

import { EstadoJuego } from '@/types/game'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { obtenerDescripcionCuarto } from '@/lib/gameLogic'

interface GameRoomProps {
  estado: EstadoJuego
}

export function GameRoom({ estado }: GameRoomProps) {
  const { cuarto, jugador } = estado

  // Crear una representación visual del cuarto usando CSS Grid
  const renderCuarto = () => {
    const nivelCuarto = cuarto.nivel
    const equipos = cuarto.equipos

    // Colores y estilos basados en el nivel del cuarto
    const estilosCuarto = {
      1: {
        pared: 'bg-gray-600',
        suelo: 'bg-gray-700',
        mobiliario: 'bg-gray-800'
      },
      2: {
        pared: 'bg-gray-500',
        suelo: 'bg-gray-600',
        mobiliario: 'bg-gray-700'
      },
      3: {
        pared: 'bg-gray-400',
        suelo: 'bg-gray-500',
        mobiliario: 'bg-gray-600'
      }
    }

    const estilo = estilosCuarto[Math.min(nivelCuarto, 3) as keyof typeof estilosCuarto]

    return (
      <div className="relative w-full h-80 bg-gray-800 rounded-lg overflow-hidden">
        {/* Fondo del cuarto (vista isométrica simulada) */}
        <div className={`absolute inset-0 ${estilo.suelo}`}>
          {/* Patrón de suelo */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-gray-600 opacity-30" />
              ))}
            </div>
          </div>
        </div>

        {/* Paredes */}
        <div className={`absolute top-0 left-0 w-full h-16 ${estilo.pared} opacity-80`} />
        <div className={`absolute top-0 right-0 w-16 h-full ${estilo.pared} opacity-60`} />

        {/* Mobiliario básico */}
        <div className="absolute bottom-4 left-4 space-y-2">
          {/* Cama */}
          <div className={`w-20 h-12 ${estilo.mobiliario} rounded border-2 border-gray-600`}>
            <div className="w-full h-2 bg-blue-900 rounded-t opacity-60" />
          </div>
          
          {/* Mesa/Escritorio */}
          <div className={`w-16 h-8 ${estilo.mobiliario} rounded border border-gray-600`} />
        </div>

        {/* Equipos del jugador */}
        <div className="absolute bottom-4 right-4 space-y-1">
          {equipos.map((equipo, index) => (
            <div
              key={equipo.id}
              className="relative group"
              style={{ transform: `translateX(${index * -8}px) translateY(${index * -4}px)` }}
            >
              <div className={`
                w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-bold
                ${equipo.calidad >= 5 ? 'bg-green-600 border-green-400' : 
                  equipo.calidad >= 3 ? 'bg-yellow-600 border-yellow-400' : 
                  'bg-red-600 border-red-400'}
              `}>
                {equipo.tipo === 'telefono' ? '📱' : 
                 equipo.tipo === 'camara' ? '📷' : 
                 equipo.tipo === 'microfono' ? '🎤' : 
                 equipo.tipo === 'iluminacion' ? '💡' : 
                 equipo.tipo === 'ordenador' ? '💻' : '📦'}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {equipo.nombre} (Calidad: {equipo.calidad})
              </div>
            </div>
          ))}
        </div>

        {/* Iluminación ambiental */}
        <div className="absolute top-2 right-2">
          {equipos.some(e => e.tipo === 'iluminacion') ? (
            <div className="w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-pulse" />
          ) : (
            <div className="w-4 h-4 bg-yellow-600 rounded-full opacity-30" />
          )}
        </div>

        {/* Indicador de nivel del cuarto */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
          Nivel {nivelCuarto}
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          Mi Cuarto
          <span className="text-sm font-normal text-gray-400">
            {jugador.estadisticas.energia}/100 energía
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vista del cuarto */}
        {renderCuarto()}

        {/* Descripción del cuarto */}
        <div className="bg-gray-700 p-3 rounded text-sm text-gray-300">
          {obtenerDescripcionCuarto(cuarto.nivel, cuarto.equipos)}
        </div>

        {/* Lista de equipos */}
        <div className="space-y-2">
          <h4 className="text-white font-medium">Equipos Disponibles:</h4>
          <div className="grid grid-cols-2 gap-2">
            {cuarto.equipos.map((equipo) => (
              <div
                key={equipo.id}
                className="bg-gray-700 p-2 rounded text-xs"
              >
                <div className="text-white font-medium">{equipo.nombre}</div>
                <div className="text-gray-400">
                  Calidad: {equipo.calidad}/10
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
