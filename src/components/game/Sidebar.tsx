'use client'

import { EstadoJuego } from '@/types/game'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SidebarProps {
  estado: EstadoJuego
}

export function Sidebar({ estado }: SidebarProps) {
  const { eventos, videosVirales } = estado

  const formatearFecha = (fecha: Date) => {
    const ahora = new Date()
    const diferencia = ahora.getTime() - fecha.getTime()
    const minutos = Math.floor(diferencia / (1000 * 60))
    const horas = Math.floor(diferencia / (1000 * 60 * 60))
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))

    if (dias > 0) return `hace ${dias} día${dias > 1 ? 's' : ''}`
    if (horas > 0) return `hace ${horas} hora${horas > 1 ? 's' : ''}`
    if (minutos > 0) return `hace ${minutos} min`
    return 'ahora'
  }

  const obtenerColorEvento = (tipo: string) => {
    switch (tipo) {
      case 'viral':
        return 'bg-green-600'
      case 'oportunidad':
        return 'bg-blue-600'
      case 'cancelacion':
        return 'bg-red-600'
      case 'acoso':
        return 'bg-orange-600'
      case 'problema-tecnico':
        return 'bg-yellow-600'
      default:
        return 'bg-gray-600'
    }
  }

  const obtenerIconoEvento = (tipo: string) => {
    switch (tipo) {
      case 'viral':
        return '🚀'
      case 'oportunidad':
        return '✨'
      case 'cancelacion':
        return '❌'
      case 'acoso':
        return '😠'
      case 'problema-tecnico':
        return '⚠️'
      default:
        return '📢'
    }
  }

  const formatearNumero = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  return (
    <div className="space-y-4 h-full">
      {/* Videos Virales */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-sm flex items-center gap-2">
            🔥 Videos Virales
            <Badge variant="secondary" className="text-xs">
              {videosVirales.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32">
            {videosVirales.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-4">
                Aún no tienes videos virales
              </p>
            ) : (
              <div className="space-y-2">
                {videosVirales.slice(-5).reverse().map((video) => (
                  <div
                    key={video.id}
                    className="bg-gray-700 p-2 rounded text-xs"
                  >
                    <div className="text-white font-medium truncate">
                      {video.titulo}
                    </div>
                    <div className="flex justify-between text-gray-400 mt-1">
                      <span>{formatearNumero(video.vistas)} vistas</span>
                      <span>${formatearNumero(video.ingresos)}</span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      {formatearFecha(video.fecha)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Feed de Eventos */}
      <Card className="bg-gray-800 border-gray-700 flex-1">
        <CardHeader>
          <CardTitle className="text-white text-sm flex items-center gap-2">
            📰 Feed de Eventos
            <Badge variant="secondary" className="text-xs">
              {eventos.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            {eventos.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-4">
                No hay eventos recientes
              </p>
            ) : (
              <div className="space-y-3">
                {eventos.slice().reverse().map((evento) => (
                  <div
                    key={evento.id}
                    className="bg-gray-700 p-3 rounded border-l-4"
                    style={{ borderLeftColor: obtenerColorEvento(evento.tipo).replace('bg-', '#') }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">
                        {obtenerIconoEvento(evento.tipo)}
                      </span>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">
                          {evento.titulo}
                        </div>
                        <p className="text-gray-300 text-xs mt-1">
                          {evento.descripcion}
                        </p>
                        
                        {/* Efectos del evento */}
                        {Object.keys(evento.efectos).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {Object.entries(evento.efectos).map(([stat, value]) => {
                              if (!value) return null
                              const isPositive = value > 0
                              return (
                                <Badge
                                  key={stat}
                                  variant="outline"
                                  className={`text-xs ${
                                    isPositive ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'
                                  }`}
                                >
                                  {stat}: {isPositive ? '+' : ''}{value}
                                </Badge>
                              )
                            })}
                          </div>
                        )}
                        
                        <div className="text-gray-500 text-xs mt-2">
                          {formatearFecha(evento.fecha)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-white font-bold text-lg">
                {estado.dia}
              </div>
              <div className="text-gray-400 text-xs">Días jugados</div>
            </div>
            <div>
              <div className="text-white font-bold text-lg">
                {videosVirales.length}
              </div>
              <div className="text-gray-400 text-xs">Videos virales</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
