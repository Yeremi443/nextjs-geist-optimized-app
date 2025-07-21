'use client'

import { useState, useCallback, useEffect } from 'react'
import { EstadoJuego, CarreraProfesional, AccionJuego, Evento, VideoViral, ContenidoCreado, TipoContenido } from '@/types/game'
import { calcularCalidadContenido, calcularGananciasSeguidores, generarEventoAleatorio, verificarViralidad } from '@/lib/gameLogic'

const ESTADO_INICIAL: EstadoJuego = {
  jugador: {
    nombre: '',
    carrera: null,
    estadisticas: {
      seguidores: 0,
      dinero: 100,
      felicidad: 50,
      energia: 100,
      reputacion: 50
    },
    habilidades: {},
    nivel: 1,
    experiencia: 0
  },
  cuarto: {
    nivel: 1,
    equipos: [
      {
        id: 'telefono-basico',
        nombre: 'Teléfono Básico',
        tipo: 'telefono',
        calidad: 1,
        precio: 0,
        descripcion: 'Un teléfono viejo y básico para grabar videos de baja calidad',
        nivelRequerido: 1
      }
    ],
    decoraciones: [],
    descripcion: 'Un cuarto humilde con paredes deterioradas y mobiliario básico'
  },
  eventos: [],
  videosVirales: [],
  dia: 1,
  hora: 8,
  juegoIniciado: false,
  juegoEnPausa: false
}

export function useGameState() {
  const [estado, setEstado] = useState<EstadoJuego>(ESTADO_INICIAL)

  // Guardar estado en localStorage
  const guardarJuego = useCallback(() => {
    try {
      localStorage.setItem('influencer-x-save', JSON.stringify(estado))
    } catch (error) {
      console.error('Error al guardar el juego:', error)
    }
  }, [estado])

  // Cargar estado desde localStorage
  const cargarJuego = useCallback(() => {
    try {
      const savedGame = localStorage.getItem('influencer-x-save')
      if (savedGame) {
        const parsedGame = JSON.parse(savedGame)
        setEstado(parsedGame)
        return true
      }
    } catch (error) {
      console.error('Error al cargar el juego:', error)
    }
    return false
  }, [])

  // Inicializar nuevo juego
  const iniciarNuevoJuego = useCallback((nombre: string, carrera: CarreraProfesional) => {
    const nuevoEstado = {
      ...ESTADO_INICIAL,
      jugador: {
        ...ESTADO_INICIAL.jugador,
        nombre,
        carrera
      },
      juegoIniciado: true
    }
    setEstado(nuevoEstado)
  }, [])

  // Crear contenido
  const crearContenido = useCallback((tipo: TipoContenido, titulo: string) => {
    setEstado(estadoActual => {
      if (estadoActual.jugador.estadisticas.energia < 20) {
        return estadoActual // No hay suficiente energía
      }

      const calidad = calcularCalidadContenido(
        estadoActual.jugador.habilidades,
        estadoActual.cuarto.equipos,
        tipo
      )

      const contenido: ContenidoCreado = {
        id: Date.now().toString(),
        tipo,
        titulo,
        calidad,
        vistas: Math.floor(Math.random() * 1000) + calidad * 100,
        likes: 0,
        comentarios: 0,
        ingresos: 0,
        fecha: new Date(),
        viral: verificarViralidad(calidad)
      }

      const gananciasSeguidores = calcularGananciasSeguidores(calidad, contenido.viral)
      const ingresos = Math.floor(contenido.vistas * 0.01)

      const nuevoEstado = {
        ...estadoActual,
        jugador: {
          ...estadoActual.jugador,
          estadisticas: {
            ...estadoActual.jugador.estadisticas,
            energia: estadoActual.jugador.estadisticas.energia - 20,
            seguidores: estadoActual.jugador.estadisticas.seguidores + gananciasSeguidores,
            dinero: estadoActual.jugador.estadisticas.dinero + ingresos,
            experiencia: estadoActual.jugador.experiencia + 10
          }
        }
      }

      // Si es viral, agregarlo a la lista
      if (contenido.viral) {
        const videoViral: VideoViral = {
          id: contenido.id,
          titulo: contenido.titulo,
          vistas: contenido.vistas,
          likes: Math.floor(contenido.vistas * 0.1),
          comentarios: Math.floor(contenido.vistas * 0.05),
          ingresos,
          fecha: contenido.fecha
        }
        nuevoEstado.videosVirales = [...estadoActual.videosVirales, videoViral]
      }

      return nuevoEstado
    })
  }, [])

  // Practicar habilidad
  const practicarHabilidad = useCallback((habilidad: string) => {
    setEstado(estadoActual => {
      if (estadoActual.jugador.estadisticas.energia < 15) {
        return estadoActual
      }

      const nivelActual = (estadoActual.jugador.habilidades as any)[habilidad] || 0
      if (nivelActual >= 7) {
        return estadoActual // Máximo nivel alcanzado
      }

      const incremento = nivelActual < 3 ? 0.5 : 0.2
      const nuevoNivel = Math.min(7, nivelActual + incremento)

      return {
        ...estadoActual,
        jugador: {
          ...estadoActual.jugador,
          estadisticas: {
            ...estadoActual.jugador.estadisticas,
            energia: estadoActual.jugador.estadisticas.energia - 15
          },
          habilidades: {
            ...estadoActual.jugador.habilidades,
            [habilidad]: nuevoNivel
          },
          experiencia: estadoActual.jugador.experiencia + 5
        }
      }
    })
  }, [])

  // Comprar equipo
  const comprarEquipo = useCallback((equipoId: string, precio: number) => {
    setEstado(estadoActual => {
      if (estadoActual.jugador.estadisticas.dinero < precio) {
        return estadoActual
      }

      // Aquí deberías tener una lista de equipos disponibles
      const nuevoEquipo = {
        id: equipoId,
        nombre: 'Nuevo Equipo',
        tipo: 'telefono' as const,
        calidad: 2,
        precio,
        descripcion: 'Equipo mejorado',
        nivelRequerido: 1
      }

      return {
        ...estadoActual,
        jugador: {
          ...estadoActual.jugador,
          estadisticas: {
            ...estadoActual.jugador.estadisticas,
            dinero: estadoActual.jugador.estadisticas.dinero - precio
          }
        },
        cuarto: {
          ...estadoActual.cuarto,
          equipos: [...estadoActual.cuarto.equipos, nuevoEquipo]
        }
      }
    })
  }, [])

  // Descansar (recuperar energía)
  const descansar = useCallback(() => {
    setEstado(estadoActual => ({
      ...estadoActual,
      jugador: {
        ...estadoActual.jugador,
        estadisticas: {
          ...estadoActual.jugador.estadisticas,
          energia: Math.min(100, estadoActual.jugador.estadisticas.energia + 30),
          felicidad: Math.min(100, estadoActual.jugador.estadisticas.felicidad + 5)
        }
      },
      hora: (estadoActual.hora + 2) % 24
    }))
  }, [])

  // Avanzar tiempo
  const avanzarTiempo = useCallback(() => {
    setEstado(estadoActual => {
      let nuevoEstado = { ...estadoActual }
      
      // Avanzar hora
      nuevoEstado.hora = (estadoActual.hora + 1) % 24
      
      // Si es un nuevo día
      if (nuevoEstado.hora === 0) {
        nuevoEstado.dia = estadoActual.dia + 1
        
        // Regenerar energía al dormir
        nuevoEstado.jugador.estadisticas.energia = Math.min(100, 
          estadoActual.jugador.estadisticas.energia + 50
        )
        
        // Posibilidad de evento aleatorio
        if (Math.random() < 0.3) {
          const evento = generarEventoAleatorio()
          nuevoEstado.eventos = [...estadoActual.eventos, evento].slice(-10) // Mantener solo los últimos 10
          
          // Aplicar efectos del evento
          Object.entries(evento.efectos).forEach(([stat, value]) => {
            if (value && stat in nuevoEstado.jugador.estadisticas) {
              (nuevoEstado.jugador.estadisticas as any)[stat] = Math.max(0, 
                Math.min(100, (estadoActual.jugador.estadisticas as any)[stat] + value)
              )
            }
          })
        }
      }
      
      return nuevoEstado
    })
  }, [])

  // Auto-guardar cada cambio
  useEffect(() => {
    if (estado.juegoIniciado) {
      guardarJuego()
    }
  }, [estado, guardarJuego])

  return {
    estado,
    iniciarNuevoJuego,
    cargarJuego,
    guardarJuego,
    crearContenido,
    practicarHabilidad,
    comprarEquipo,
    descansar,
    avanzarTiempo
  }
}
