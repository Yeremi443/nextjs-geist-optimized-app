'use client'

import { EstadoJuego, TipoContenido, CarreraProfesional } from '@/types/game'
import { useGameState } from '@/hooks/useGameState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { StatsOverview } from '@/components/game/StatsOverview'
import { ActionMenu } from '@/components/game/ActionMenu'

interface GameUIProps {
  estado: EstadoJuego
}

export function GameUI({ estado }: GameUIProps) {
  const {
    crearContenido,
    practicarHabilidad,
    descansar
  } = useGameState()

  const { jugador } = estado

  // Obtener habilidades relevantes según la carrera
  const obtenerHabilidadesCarrera = () => {
    switch (jugador.carrera) {
      case 'modelo':
        return [
          { key: 'atractivo', label: 'Atractivo' },
          { key: 'habilidadPosar', label: 'Habilidad de Posar' },
          { key: 'conocimientoModa', label: 'Conocimiento de Moda' }
        ]
      case 'streamer':
        return [
          { key: 'habilidadJuego', label: 'Habilidad de Juego' },
          { key: 'carisma', label: 'Carisma' },
          { key: 'conocimientoJuegos', label: 'Conocimiento de Juegos' }
        ]
      case 'musico':
        return [
          { key: 'habilidadMusical', label: 'Habilidad Musical' },
          { key: 'composicion', label: 'Composición' },
          { key: 'marketingMusical', label: 'Marketing Musical' }
        ]
      case 'contador-historias':
        return [
          { key: 'creatividad', label: 'Creatividad' },
          { key: 'habilidadEscritura', label: 'Habilidad de Escritura' },
          { key: 'empatia', label: 'Empatía' }
        ]
      case 'fitness':
        return [
          { key: 'fuerza', label: 'Fuerza' },
          { key: 'conocimientoFitness', label: 'Conocimiento Fitness' },
          { key: 'motivacion', label: 'Motivación' }
        ]
      case 'belleza':
        return [
          { key: 'habilidadMaquillaje', label: 'Habilidad de Maquillaje' },
          { key: 'estiloPersonal', label: 'Estilo Personal' }
        ]
      case 'cosas-locas':
        return [
          { key: 'valentia', label: 'Valentía' },
          { key: 'creatividadRetos', label: 'Creatividad en Retos' },
          { key: 'humor', label: 'Sentido del Humor' }
        ]
      case 'periodista':
        return [
          { key: 'investigacion', label: 'Investigación' },
          { key: 'oratoria', label: 'Oratoria' },
          { key: 'credibilidad', label: 'Credibilidad' },
          { key: 'etica', label: 'Ética' }
        ]
      default:
        return []
    }
  }

  const habilidadesCarrera = obtenerHabilidadesCarrera()

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Estadísticas principales */}
      <StatsOverview estado={estado} />

      {/* Habilidades específicas de la carrera */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">Habilidades Profesionales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {habilidadesCarrera.map((habilidad) => {
            const nivel = (jugador.habilidades as any)[habilidad.key] || 0
            const porcentaje = (nivel / 7) * 100

            return (
              <div key={habilidad.key} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-white text-xs">{habilidad.label}</span>
                  <Badge variant="outline" className="text-xs">
                    {nivel.toFixed(1)}/7
                  </Badge>
                </div>
                <Progress value={porcentaje} className="h-2" />
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => practicarHabilidad(habilidad.key)}
                  disabled={jugador.estadisticas.energia < 15 || nivel >= 7}
                >
                  Practicar (-15 energía)
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Menú de acciones */}
      <ActionMenu estado={estado} />

      {/* Acciones rápidas */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full text-xs"
            onClick={descansar}
            disabled={jugador.estadisticas.energia >= 90}
          >
            Descansar (+30 energía, +2 horas)
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              className="text-xs bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                const tiposContenido: Record<CarreraProfesional, TipoContenido> = {
                  'modelo': 'foto-moda',
                  'streamer': 'video-stream',
                  'musico': 'cancion',
                  'contador-historias': 'historia',
                  'fitness': 'rutina-ejercicio',
                  'belleza': 'tutorial-belleza',
                  'cosas-locas': 'reto-loco',
                  'periodista': 'noticia'
                }
                const tipo = tiposContenido[jugador.carrera || 'modelo']
                crearContenido(tipo, `Contenido ${Date.now()}`)
              }}
              disabled={jugador.estadisticas.energia < 20}
            >
              Crear Contenido
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              disabled
            >
              Tienda
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información del nivel */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Nivel {jugador.nivel}</span>
              <span className="text-gray-400">EXP: {jugador.experiencia}</span>
            </div>
            <Progress 
              value={(jugador.experiencia % 100)} 
              className="h-2" 
            />
            <p className="text-xs text-gray-500 text-center">
              {100 - (jugador.experiencia % 100)} EXP para siguiente nivel
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
