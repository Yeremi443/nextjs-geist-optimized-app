# 📱 Influencer X - Documentación Completa

## 🎯 Descripción General
**Influencer X** es un simulador de vida y gestión con elementos de RPG, presentado en una estética 2D pixel-art, donde el jugador comienza en un humilde cuarto y busca convertirse en una superestrella de las redes sociales.

## 🚀 Características Principales

### 📊 Sistema de Estadísticas
- **Seguidores**: Métrica principal de éxito
- **Dinero**: Para comprar equipo y mejoras
- **Felicidad**: Afecta la eficiencia y el estado mental
- **Energía**: Recurso limitado para realizar acciones
- **Reputación**: Cómo es percibido por el público

### 🎭 Carreras Profesionales
1. **Modelo de Ropa** - Estética, moda, poses
2. **Streamer** - Videojuegos, entretenimiento en vivo
3. **Músico** - Composición, producción musical
4. **Contador de Historias** - Narrativa, expresión oral
5. **Influencer Fitness** - Rutinas de ejercicio, salud
6. **Influencer de Belleza** - Maquillaje, cuidado personal
7. **Contenido Loco** - Retos extremos, contenido viral
8. **Periodista Digital** - Noticias, investigación

### 🏠 Sistema de Cuarto
- **Niveles 1-7**: Desde cuarto humilde hasta estudio profesional
- **Equipos**: Teléfonos, cámaras, micrófonos, iluminación, PCs
- **Decoraciones**: Mejoras visuales que afectan la felicidad

### 🎮 Mecánicas de Juego

#### Creación de Contenido
- **Tipos de contenido** según carrera
- **Calidad** basada en habilidades y equipo
- **Posibilidad viral** muy baja pero posible
- **Ganancias** en seguidores y dinero

#### Sistema de Habilidades
- **Niveles 0-7** para cada habilidad específica
- **Curva de dificultad** progresiva
- **Retos de habilidad** con riesgo y recompensa

#### Eventos Aleatorios
- **Oportunidades** de colaboración
- **Problemas técnicos** y cancelaciones
- **Momentos virales** inesperados
- **Acoso online** y controversias

## 🗂️ Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx           # Página de inicio
│   ├── juego/
│   │   └── page.tsx       # Página principal del juego
│   └── globals.css        # Estilos globales
├── components/
│   ├── game/
│   │   ├── GameRoom.tsx   # Vista del cuarto
│   │   ├── GameUI.tsx     # Panel de acciones
│   │   ├── Sidebar.tsx    # Feed de eventos
│   │   ├── StatsOverview.tsx # Estadísticas
│   │   └── ActionMenu.tsx # Menú de acciones
│   └── ui/               # Componentes de shadcn/ui
├── hooks/
│   └── useGameState.ts   # Hook principal del estado
├── lib/
│   └── gameLogic.ts      # Lógica del juego
└── types/
    └── game.ts          # Tipos TypeScript
```

## 🎮 Cómo Jugar

### 1. Iniciar Nuevo Juego
1. Visita `http://localhost:8000`
2. Haz clic en "COMENZAR JUEGO"
3. Ingresa tu nombre
4. Selecciona tu carrera profesional
5. ¡Comienza tu aventura!

### 2. Acciones Principales
- **Crear Contenido**: Usa energía para crear posts/videos
- **Practicar Habilidades**: Mejora tus estadísticas
- **Descansar**: Recupera energía
- **Comprar Equipos**: Mejora tu setup

### 3. Objetivos
- Alcanzar 1M+ seguidores
- Desbloquear todos los equipos
- Llegar al nivel 7 de habilidades
- Crear contenido viral

## 🛠️ Tecnologías Utilizadas

- **Next.js 15.3.2** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **LocalStorage** - Guardado de partidas

## 🎯 Próximas Mejoras Sugeridas

### 🔧 Funcionalidades Técnicas
1. **Sistema de Guardado en la Nube**
   - Integrar Firebase o Supabase
   - Sincronización entre dispositivos

2. **Mejoras de UI/UX**
   - Animaciones más fluidas
   - Sonidos y efectos de audio
   - Modo oscuro/claro

3. **Sistema de Logros**
   - Medallas por hitos
   - Estadísticas globales
   - Tabla de líderes

### 🎮 Nuevas Mecánicas
1. **Sistema de Colaboraciones**
   - Colaborar con NPCs
   - Eventos conjuntos
   - Beneficios mutuos

2. **Gestión de Finanzas**
   - Inversiones
   - Impuestos
   - Presupuesto mensual

3. **Redes Sociales Específicas**
   - Instagram, TikTok, YouTube
   - Algoritmos diferentes
   - Audiencias específicas

4. **Modo Historia**
   - Misiones específicas
   - Finales múltiples
   - Decisiones morales

### 🏆 Contenido Adicional
1. **Nuevas Carreras**
   - Chef
   - Viajero
   - Educador
   - Tecnología

2. **Eventos Especiales**
   - Premios
   - Festivales
   - Tendencias temporales

3. **Personalización**
   - Avatar personalizable
   - Temas de cuarto
   - Estilos de contenido

## 📊 Balance del Juego

### Dificultad Actual
- **Inicio**: Muy fácil (0-1 nivel)
- **Medio**: Moderado (2-4 niveles)
- **Avanzado**: Desafiante (5-7 niveles)

### Economía
- **Ingresos iniciales**: $0.01 por vista
- **Mejora de equipos**: +50% por nivel de calidad
- **Costos de vida**: $50/día básicos

## 🐛 Errores Conocidos y Soluciones

1. **Error de TypeScript en imports**
   - Solución: Usar rutas absolutas con `@/`

2. **Problemas de rendimiento**
   - Optimizar re-renders con React.memo
   - Implementar lazy loading

3. **Guardado de estado**
   - Validar JSON antes de parsear
   - Manejar corrupción de datos

## 🚀 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
http://localhost:8000
```

## 📱 Responsive Design

- **Desktop**: Layout de 3 columnas
- **Tablet**: Layout de 2 columnas
- **Mobile**: Layout de 1 columna vertical

## 🎨 Paleta de Colores

- **Fondo Principal**: `bg-gray-900`
- **Fondo Secundario**: `bg-gray-800`
- **Acentos**: `bg-blue-600`
- **Éxito**: `text-green-400`
- **Advertencia**: `text-yellow-400`
- **Error**: `text-red-400`

## 📞 Contacto y Contribuciones

Este proyecto está diseñado para ser mejorado continuamente. ¡Las contribuciones son bienvenidas!

---

**Última actualización**: [Fecha actual]
**Versión**: 1.0.0
**Estado**: Funcional y listo para mejoras
```

## 📁 Archivos Creados

He creado todos los archivos necesarios para el juego "Influencer X":

1. **Páginas principales**:
   - `src/app/page.tsx` - Página de inicio
   - `src/app/juego/page.tsx` - Página del juego

2. **Componentes del juego**:
   - `src/components/game/GameRoom.tsx` - Vista del cuarto
   - `src/components/game/GameUI.tsx` - Panel de acciones
   - `src/components/game/Sidebar.tsx` - Feed de eventos
   - `src/components/game/StatsOverview.tsx` - Estadísticas
   - `src/components/game/ActionMenu.tsx` - Menú de acciones

3. **Lógica y tipos**:
   - `src/types/game.ts` - Tipos TypeScript
   - `src/hooks/useGameState.ts` - Hook principal
   - `src/lib/gameLogic.ts` - Lógica del juego

4. **Documentación**:
   - `INFLUENCER_X_DOCUMENTACION.md` - Este archivo completo

## 🎮 Estado Actual

El juego está **funcional y listo para usar**:
- ✅ Interfaz moderna y responsive
- ✅ Sistema de guardado en localStorage
- ✅ 8 carreras profesionales disponibles
- ✅ Sistema de estadísticas y habilidades
- ✅ Eventos aleatorios y virales
- ✅ Progresión visual del cuarto
- ✅ Equipos y mejoras disponibles

Puedes acceder al juego en `http://localhost:8000` y comenzar tu aventura como influencer digital!
