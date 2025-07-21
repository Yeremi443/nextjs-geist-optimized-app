import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            INFLUENCER X
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comienza en un humilde cuarto y conviértete en una superestrella de las redes sociales
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">🎮 Simulador de Vida</CardTitle>
              <CardDescription className="text-gray-300">
                Gestiona tu tiempo, energía y recursos para alcanzar la fama
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300">
              <ul className="space-y-2">
                <li>• Sistema de habilidades 0-7</li>
                <li>• Múltiples carreras profesionales</li>
                <li>• Progresión visual del cuarto</li>
                <li>• Eventos aleatorios y virales</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">🎯 Carreras Disponibles</CardTitle>
              <CardDescription className="text-gray-300">
                Elige tu camino hacia la fama
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300">
              <ul className="space-y-2">
                <li>• Modelo de Ropa</li>
                <li>• Streamer</li>
                <li>• Músico</li>
                <li>• Contador de Historias</li>
                <li>• Influencer Fitness</li>
                <li>• Belleza y Estilo</li>
                <li>• Contenido Loco</li>
                <li>• Periodista</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/juego">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-xl px-8 py-4">
              COMENZAR JUEGO
            </Button>
          </Link>
        </div>

        <div className="mt-16 text-center text-gray-400">
          <p className="text-sm">
            Estilo pixel-art 2D • Vista isométrica • Gestión de recursos • RPG
          </p>
        </div>
      </div>
    </div>
  )
}
