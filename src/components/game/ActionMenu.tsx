'use client'

import { useState } from 'react'
import { EstadoJuego, TipoContenido, CarreraProfesional } from '@/types/game'
import { useGameState } from '@/hooks/useGameState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ActionMenuProps {
  estado: EstadoJuego
}

export function ActionMenu({ estado }: ActionMenuProps) {
  const { crearContenido, comprarEquipo } = useGameState()
  const [tituloContenido, setTituloContenido] = useState('')
  const [tipoContenidoSeleccionado, setTipoContenidoSeleccionado] = useState<TipoContenido | ''>('')
  const [dialogoAbierto, setDialogoAbierto] = useState(false)

  const { jugador } = estado

  // Mapeo de carreras a tipos de contenido
  const obtenerTiposContenidoPorCarrera = (carrera: CarreraProfesional | null): { value: TipoContenido; label: string; descripcion: string }[] => {
    const tiposBase = [
      { value: 'foto-moda' as TipoContenido, label: 'Foto de Moda', descripcion: 'Foto estilizada para redes sociales' },
      { value: 'video-stream' as TipoContenido, label: 'Video/Stream', descripcion: 'Contenido de video o transmisión en vivo' },
      { value: 'cancion' as TipoContenido, label: 'Canción', descripcion: 'Composición musical original' },
      { value: 'historia' as TipoContenido, label: 'Historia/Relato', descripcion: 'Narrativa escrita o hablada' },
      { value: 'rutina-ejercicio' as TipoContenido, label: 'Rutina de Ejercicio', descripcion: 'Video de entrenamiento físico' },
      { value: 'tutorial-belleza' as TipoContenido, label: 'Tutorial de Belleza', descripcion: 'Guía de maquillaje o cuidado personal' },
      { value: 'reto-loco' as TipoContenido, label: 'Reto Loco', descripcion: 'Contenido viral y divertido' },
      { value: 'noticia' as TipoContenido, label: 'Noticia/Artículo', descripcion: 'Contenido informativo o periodístico' }
    ]

    // Filtrar según la carrera
    switch (carrera) {
      case 'modelo':
        return tiposBase.filter(t => ['foto-moda', 'video-stream'].includes(t.value))
      case 'streamer':
        return tiposBase.filter(t => ['video-stream', 'reto-loco'].includes(t.value))
      case 'musico':
        return tiposBase.filter(t => ['cancion', 'video-stream'].includes(t.value))
      case 'contador-historias':
        return tiposBase.filter(t => ['historia', 'video-stream'].includes(t.value))
      case 'fitness':
        return tiposBase.filter(t => ['rutina-ejercicio', 'video-stream'].includes(t.value))
      case 'belleza':
        return tiposBase.filter(t => ['tutorial-belleza', 'foto-moda'].includes(t.value))
      case 'cosas-locas':
        return tiposBase.filter(t => ['reto-loco', 'video-stream'].includes(t.value))
      case 'periodista':
        return tiposBase.filter(t => ['noticia', 'video-stream'].includes(t.value))
      default:
        return tiposBase
    }
  }

  const tiposContenidoDisponibles = obtenerTiposContenidoPorCarrera(jugador.carrera)

  const handleCrearContenido = () => {
    if (tituloContenido.trim() && tipoContenidoSeleccionado) {
      crearContenido(tipoContenidoSeleccionado, tituloContenido.trim())
      setTituloContenido('')
      setTipoContenidoSeleccionado('')
      setDialogoAbierto(false)
    }
  }

  const puedeCrearContenido = jugador.estadisticas.energia >= 20

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-sm">Acciones Principales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Crear Contenido */}
        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
          <DialogTrigger asChild>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!puedeCrearContenido}
            >
              {puedeCrearContenido ? 'Crear Contenido' : 'Sin Energía (20 requerida)'}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Contenido</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título del Contenido</Label>
                <Input
                  id="titulo"
                  value={tituloContenido}
                  onChange={(e) => setTituloContenido(e.target.value)}
                  placeholder="Ingresa un título atractivo..."
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Contenido</Label>
                <Select value={tipoContenidoSeleccionado} onValueChange={(value) => setTipoContenidoSeleccionado(value as TipoContenido)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Selecciona el tipo..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {tiposContenidoDisponibles.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value} className="text-white hover:bg-gray-700">
                        <div>
                          <div className="font-medium">{tipo.label}</div>
                          <div className="text-sm text-gray-400">{tipo.descripcion}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogoAbierto(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCrearContenido}
                  disabled={!tituloContenido.trim() || !tipoContenidoSeleccionado}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Crear (-20 energía)
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Otras acciones */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs"
          >
            Colaborar
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs"
          >
            Patrocinios
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs"
          >
            Interactuar
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs"
          >
            Estudiar
          </Button>
        </div>

        {/* Información de costos */}
        <div className="bg-gray-700 p-2 rounded text-xs space-y-1">
          <div className="text-gray-300 font-medium">Costos de Acciones:</div>
          <div className="text-gray-400">• Crear Contenido: 20 energía</div>
          <div className="text-gray-400">• Practicar Habilidad: 15 energía</div>
          <div className="text-gray-400">• Descansar: +30 energía, +2 horas</div>
        </div>
      </CardContent>
    </Card>
  )
}
