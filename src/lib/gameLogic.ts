import { HabilidadesEspecificas, Equipo, TipoContenido, Evento } from '@/types/game'

// Calcular calidad del contenido basado en habilidades y equipo
export function calcularCalidadContenido(
  habilidades: HabilidadesEspecificas,
  equipos: Equipo[],
  tipo: TipoContenido
): number {
  let calidadBase = 1
  let multiplicadorHabilidad = 1
  let multiplicadorEquipo = 1

  // Calcular multiplicador de habilidad según el tipo de contenido
  switch (tipo) {
    case 'foto-moda':
      multiplicadorHabilidad = 1 + ((habilidades.atractivo || 0) + (habilidades.habilidadPosar || 0)) * 0.2
      break
    case 'video-stream':
      multiplicadorHabilidad = 1 + ((habilidades.habilidadJuego || 0) + (habilidades.carisma || 0)) * 0.2
      break
    case 'cancion':
      multiplicadorHabilidad = 1 + ((habilidades.habilidadMusical || 0) + (habilidades.composicion || 0)) * 0.2
      break
    case 'historia':
      multiplicadorHabilidad = 1 + ((habilidades.creatividad || 0) + (habilidades.habilidadEscritura || 0)) * 0.2
      break
    case 'rutina-ejercicio':
      multiplicadorHabilidad = 1 + ((habilidades.fuerza || 0) + (habilidades.conocimientoFitness || 0)) * 0.2
      break
    case 'tutorial-belleza':
      multiplicadorHabilidad = 1 + ((habilidades.habilidadMaquillaje || 0) + (habilidades.estiloPersonal || 0)) * 0.2
      break
    case 'reto-loco':
      multiplicadorHabilidad = 1 + ((habilidades.valentia || 0) + (habilidades.creatividadRetos || 0)) * 0.2
      break
    case 'noticia':
      multiplicadorHabilidad = 1 + ((habilidades.investigacion || 0) + (habilidades.oratoria || 0)) * 0.2
      break
  }

  // Calcular multiplicador de equipo
  const equipoRelevante = equipos.filter(e => 
    e.tipo === 'telefono' || e.tipo === 'camara' || e.tipo === 'microfono' || e.tipo === 'iluminacion'
  )
  
  if (equipoRelevante.length > 0) {
    const calidadPromedio = equipoRelevante.reduce((sum, eq) => sum + eq.calidad, 0) / equipoRelevante.length
    multiplicadorEquipo = 1 + (calidadPromedio - 1) * 0.3
  }

  const calidadFinal = Math.floor(calidadBase * multiplicadorHabilidad * multiplicadorEquipo)
  return Math.min(10, Math.max(1, calidadFinal))
}

// Calcular ganancia de seguidores
export function calcularGananciasSeguidores(calidad: number, esViral: boolean): number {
  let baseSeguidores = calidad * 10
  
  if (esViral) {
    baseSeguidores *= Math.floor(Math.random() * 50) + 10 // Entre 10x y 60x más seguidores
  }
  
  // Añadir algo de aleatoriedad
  const variacion = Math.random() * 0.4 + 0.8 // Entre 80% y 120%
  
  return Math.floor(baseSeguidores * variacion)
}

// Verificar si el contenido se vuelve viral
export function verificarViralidad(calidad: number): boolean {
  // Probabilidad base muy baja
  let probabilidad = 0.001
  
  // Aumenta con la calidad
  probabilidad += calidad * 0.002
  
  // Máximo 5% de probabilidad
  probabilidad = Math.min(0.05, probabilidad)
  
  return Math.random() < probabilidad
}

// Generar evento aleatorio
export function generarEventoAleatorio(): Evento {
  const tiposEventos = [
    {
      tipo: 'oportunidad' as const,
      titulo: 'Oportunidad de Colaboración',
      descripcion: 'Un influencer más grande quiere colaborar contigo',
      efectos: { seguidores: 50, reputacion: 10 }
    },
    {
      tipo: 'problema-tecnico' as const,
      titulo: 'Problema Técnico',
      descripcion: 'Tu equipo falló durante una transmisión importante',
      efectos: { felicidad: -15, reputacion: -5 }
    },
    {
      tipo: 'viral' as const,
      titulo: 'Momento Viral Inesperado',
      descripcion: 'Uno de tus videos antiguos se volvió viral de repente',
      efectos: { seguidores: 200, dinero: 100, felicidad: 20 }
    },
    {
      tipo: 'acoso' as const,
      titulo: 'Comentarios Negativos',
      descripcion: 'Recibiste una ola de comentarios negativos',
      efectos: { felicidad: -20, energia: -10 }
    },
    {
      tipo: 'cancelacion' as const,
      titulo: 'Controversia Menor',
      descripcion: 'Un comentario tuyo fue malinterpretado',
      efectos: { seguidores: -30, reputacion: -15, felicidad: -10 }
    }
  ]

  const eventoAleatorio = tiposEventos[Math.floor(Math.random() * tiposEventos.length)]
  
  return {
    id: Date.now().toString(),
    tipo: eventoAleatorio.tipo,
    titulo: eventoAleatorio.titulo,
    descripcion: eventoAleatorio.descripcion,
    efectos: eventoAleatorio.efectos,
    fecha: new Date()
  }
}

// Calcular costo de mejora de habilidad
export function calcularCostoMejoraHabilidad(nivelActual: number): { energia: number; dinero: number } {
  const costoBase = {
    energia: 15,
    dinero: 0
  }

  if (nivelActual >= 3) {
    costoBase.energia = 25
    costoBase.dinero = nivelActual * 50
  }

  if (nivelActual >= 5) {
    costoBase.energia = 40
    costoBase.dinero = nivelActual * 100
  }

  return costoBase
}

// Obtener equipos disponibles para comprar
export function obtenerEquiposDisponibles(nivelJugador: number, dineroDisponible: number): Equipo[] {
  const todosLosEquipos: Equipo[] = [
    // Teléfonos
    {
      id: 'telefono-medio',
      nombre: 'Teléfono Decente',
      tipo: 'telefono',
      calidad: 3,
      precio: 200,
      descripcion: 'Un teléfono con mejor cámara para videos de calidad media',
      nivelRequerido: 2
    },
    {
      id: 'telefono-bueno',
      nombre: 'Smartphone Premium',
      tipo: 'telefono',
      calidad: 5,
      precio: 800,
      descripcion: 'Teléfono de alta gama con excelente cámara',
      nivelRequerido: 4
    },
    
    // Cámaras
    {
      id: 'webcam-basica',
      nombre: 'Webcam HD',
      tipo: 'camara',
      calidad: 4,
      precio: 150,
      descripcion: 'Webcam básica para streams de mejor calidad',
      nivelRequerido: 2
    },
    {
      id: 'camara-dslr',
      nombre: 'Cámara DSLR',
      tipo: 'camara',
      calidad: 7,
      precio: 1500,
      descripcion: 'Cámara profesional para contenido de alta calidad',
      nivelRequerido: 5
    },
    
    // Micrófonos
    {
      id: 'microfono-usb',
      nombre: 'Micrófono USB',
      tipo: 'microfono',
      calidad: 3,
      precio: 100,
      descripcion: 'Micrófono básico para mejor calidad de audio',
      nivelRequerido: 2
    },
    {
      id: 'microfono-profesional',
      nombre: 'Micrófono Profesional',
      tipo: 'microfono',
      calidad: 6,
      precio: 500,
      descripcion: 'Micrófono de estudio para audio cristalino',
      nivelRequerido: 4
    },
    
    // Iluminación
    {
      id: 'anillo-luz',
      nombre: 'Anillo de Luz',
      tipo: 'iluminacion',
      calidad: 4,
      precio: 80,
      descripcion: 'Iluminación básica para mejorar la presentación',
      nivelRequerido: 2
    },
    {
      id: 'kit-luces',
      nombre: 'Kit de Luces Profesional',
      tipo: 'iluminacion',
      calidad: 6,
      precio: 400,
      descripcion: 'Sistema de iluminación completo',
      nivelRequerido: 4
    },
    
    // Ordenadores
    {
      id: 'laptop-basica',
      nombre: 'Laptop para Edición',
      tipo: 'ordenador',
      calidad: 3,
      precio: 600,
      descripcion: 'Laptop básica para editar videos',
      nivelRequerido: 3
    },
    {
      id: 'pc-gaming',
      nombre: 'PC Gaming/Streaming',
      tipo: 'ordenador',
      calidad: 7,
      precio: 2000,
      descripcion: 'PC potente para streaming y edición profesional',
      nivelRequerido: 5
    }
  ]

  return todosLosEquipos.filter(equipo => 
    equipo.nivelRequerido <= nivelJugador && equipo.precio <= dineroDisponible
  )
}

// Calcular experiencia necesaria para subir de nivel
export function calcularExperienciaNecesaria(nivelActual: number): number {
  return nivelActual * 100 + 50
}

// Verificar si el jugador puede subir de nivel
export function puedeSubirNivel(experienciaActual: number, nivelActual: number): boolean {
  return experienciaActual >= calcularExperienciaNecesaria(nivelActual)
}

// Obtener descripción del cuarto según el nivel
export function obtenerDescripcionCuarto(nivel: number, equipos: Equipo[]): string {
  const descripciones = [
    'Un cuarto humilde con paredes deterioradas, una cama simple y mobiliario básico de cajas.',
    'El cuarto se ve un poco mejor, con algunos equipos básicos y decoración modesta.',
    'Un espacio más organizado con mejor iluminación y equipos de calidad media.',
    'Un cuarto bien equipado con tecnología decente y decoración agradable.',
    'Un estudio semi-profesional con buen equipo y ambiente acogedor.',
    'Un espacio de trabajo profesional con equipos de alta calidad.',
    'Un estudio de influencer de élite con la mejor tecnología disponible.'
  ]

  const indice = Math.min(nivel - 1, descripciones.length - 1)
  let descripcion = descripciones[indice]

  // Añadir menciones específicas del equipo
  if (equipos.length > 1) {
    const equipoDestacado = equipos.find(e => e.calidad >= 5)
    if (equipoDestacado) {
      descripcion += ` Destaca tu ${equipoDestacado.nombre.toLowerCase()}.`
    }
  }

  return descripcion
}
