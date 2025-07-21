'use client'

import { EstadoJuego } from '@/types/game'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface StatsOverviewProps {
  estado: EstadoJuego
}

export function StatsOverview({ estado }: StatsOverviewProps) {
  const { jugador } = estado

  const formatearNumero = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const obtenerColorEstadistica = (valor: number, max: number = 100) => {
    const porcentaje = (valor / max) * 100
    if (porcentaje >= 70) return 'text-green-400'
    if (porcentaje >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  const obtenerColorProgreso = (valor: number, max: number = 100) => {
    const porcentaje = (valor / max) * 100
    if (porcentaje >= 70) return 'bg-green-600'
    if (porcentaje >= 40) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-sm">Estadísticas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Seguidores */}
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Seguidores</span>
          <span className="text-white font-bold">
            {formatearNumero(jugador.estadisticas.seguidores)}
          </span>
        </div>

        {/* Dinero */}
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Dinero</span>
          <span className="text-green-400 font-bold">
            ${formatearNumero(jugador.estadisticas.dinero)}
          </span>
        </div>

        {/* Energía */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Energía</span>
            <span className={`font-bold ${obtenerColorEstadistica(jugador.estadisticas.energia)}`}>
              {jugador.estadisticas.energia}/100
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${obtenerColorProgreso(jugador.estadisticas.energia)}`}
              style={{ width: `${jugador.estadisticas.energia}%` }}
            />
          </div>
        </div>

        {/* Felicidad */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Felicidad</span>
            <span className={`font-bold ${obtenerColorEstadistica(jugador.estadisticas.felicidad)}`}>
              {jugador.estadisticas.felicidad}/100
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${obtenerColorProgreso(jugador.estadisticas.felicidad)}`}
              style={{ width: `${jugador.estadisticas.felicidad}%` }}
            />
          </div>
        </div>

        {/* Reputación */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Reputación</span>
            <span className={`font-bold ${obtenerColorEstadistica(jugador.estadisticas.reputacion)}`}>
              {jugador.estadisticas.reputacion}/100
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${obtenerColorProgreso(jugador.estadisticas.reputacion)}`}
              style={{ width: `${jugador.estadisticas.reputacion}%` }}
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="pt-2 border-t border-gray-700 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Nivel</span>
            <span className="text-white">{jugador.nivel}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Experiencia</span>
            <span className="text-blue-400">{jugador.experiencia} EXP</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
