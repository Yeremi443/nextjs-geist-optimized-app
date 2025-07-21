export interface EstadisticasJugador {
  seguidores: number
  dinero: number
  felicidad: number
  energia: number
  reputacion: number
}

export interface HabilidadesEspecificas {
  // Modelo
  atractivo?: number
  habilidadPosar?: number
  conocimientoModa?: number
  
  // Streamer
  habilidadJuego?: number
  carisma?: number
  conocimientoJuegos?: number
  
  // Músico
  habilidadMusical?: number
  composicion?: number
  marketingMusical?: number
  
  // Contador de Historias
  creatividad?: number
  habilidadEscritura?: number
  empatia?: number
  
  // Fitness
  fuerza?: number
  conocimientoFitness?: number
  motivacion?: number
  
  // Belleza
  habilidadMaquillaje?: number
  estiloPersonal?: number
  
  // Cosas Locas
  valentia?: number
  creatividadRetos?: number
  humor?: number
  
  // Periodista
  investigacion?: number
  oratoria?: number
  credibilidad?: number
  impacto?: number
  etica?: number
}

export type CarreraProfesional = 
  | 'modelo'
  | 'streamer' 
  | 'musico'
  | 'contador-historias'
  | 'fitness'
  | 'belleza'
  | 'cosas-locas'
  | 'periodista'

export interface Equipo {
  id: string
  nombre: string
  tipo: 'telefono' | 'camara' | 'microfono' | 'iluminacion' | 'ordenador' | 'fondo'
  calidad: number
  precio: number
  descripcion: string
  nivelRequerido: number
}

export interface EstadoCuarto {
  nivel: number
  equipos: Equipo[]
  decoraciones: string[]
  descripcion: string
}

export interface Evento {
  id: string
  tipo: 'viral' | 'cancelacion' | 'acoso' | 'oportunidad' | 'problema-tecnico'
  titulo: string
  descripcion: string
  efectos: {
    seguidores?: number
    dinero?: number
    felicidad?: number
    energia?: number
    reputacion?: number
  }
  fecha: Date
}

export interface VideoViral {
  id: string
  titulo: string
  vistas: number
  likes: number
  comentarios: number
  ingresos: number
  fecha: Date
}

export interface EstadoJuego {
  jugador: {
    nombre: string
    carrera: CarreraProfesional | null
    estadisticas: EstadisticasJugador
    habilidades: HabilidadesEspecificas
    nivel: number
    experiencia: number
  }
  cuarto: EstadoCuarto
  eventos: Evento[]
  videosVirales: VideoViral[]
  dia: number
  hora: number
  juegoIniciado: boolean
  juegoEnPausa: boolean
}

export interface AccionJuego {
  id: string
  nombre: string
  descripcion: string
  costo: {
    energia?: number
    dinero?: number
    tiempo?: number
  }
  recompensas: {
    experiencia?: number
    dinero?: number
    seguidores?: number
    felicidad?: number
  }
  requisitos: {
    nivel?: number
    habilidad?: string
    nivelHabilidad?: number
    equipo?: string
  }
  disponible: boolean
}

export type TipoContenido = 
  | 'foto-moda'
  | 'video-stream'
  | 'cancion'
  | 'historia'
  | 'rutina-ejercicio'
  | 'tutorial-belleza'
  | 'reto-loco'
  | 'noticia'

export interface ContenidoCreado {
  id: string
  tipo: TipoContenido
  titulo: string
  calidad: number
  vistas: number
  likes: number
  comentarios: number
  ingresos: number
  fecha: Date
  viral: boolean
}
