"use client"

import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

interface NotFoundPageProps {
  searchQuery?: string
  onBackToSearch?: () => void
}

export default function NotFoundPage({ searchQuery, onBackToSearch }: NotFoundPageProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8">
      {/* Muñequito con cartel */}
      <div className="relative mb-8">
        {/* Cuerpo del muñequito */}
        <div className="relative">
          {/* Cabeza */}
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full mx-auto mb-2 relative">
            {/* Ojos */}
            <div className="absolute top-6 left-4 w-2 h-2 bg-black rounded-full"></div>
            <div className="absolute top-6 right-4 w-2 h-2 bg-black rounded-full"></div>
            {/* Boca triste */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-3 border-b-2 border-black rounded-full transform rotate-180"></div>
          </div>

          {/* Cuerpo */}
          <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mx-auto mb-2 relative">
            {/* Brazos */}
            <div className="absolute -left-3 top-2 w-6 h-3 bg-yellow-400 rounded-full transform -rotate-12"></div>
            <div className="absolute -right-3 top-2 w-6 h-3 bg-yellow-400 rounded-full transform rotate-12"></div>
          </div>

          {/* Piernas */}
          <div className="flex justify-center gap-2">
            <div className="w-3 h-8 bg-blue-600 rounded-full"></div>
            <div className="w-3 h-8 bg-blue-600 rounded-full"></div>
          </div>

          {/* Cartel "UPS" */}
          <div className="absolute -top-8 -right-8 bg-white rounded-lg p-2 shadow-lg border-2 border-gray-300 transform rotate-12">
            <div className="text-red-500 font-bold text-sm">¡UPS!</div>
            {/* Palito del cartel */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-yellow-600"></div>
          </div>
        </div>
      </div>

      {/* Mensaje principal */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Esta película no se encuentra disponible</h1>

        {searchQuery && (
          <p className="text-gray-400 text-lg mb-4">No pudimos encontrar "{searchQuery}" en nuestro catálogo</p>
        )}

        <p className="text-gray-500 max-w-md mx-auto">
          Lo sentimos, pero esta película no está en nuestra colección de dominio público. ¡Prueba buscando otra
          película clásica!
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4">
        {onBackToSearch && (
          <button
            onClick={onBackToSearch}
            className="inline-flex items-center justify-center bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
          >
            <Search className="mr-2 h-5 w-5" />
            Buscar otra película
          </button>
        )}

        <Link href="/catalog">
          <button className="inline-flex items-center justify-center bg-gray-800 text-white hover:bg-gray-700 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Ver catálogo completo
          </button>
        </Link>
      </div>

      {/* Sugerencias */}
      <div className="mt-12 text-center">
        <h3 className="text-white font-medium mb-4">¿Qué tal si pruebas con:</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {["Nosferatu", "Metropolis", "Chaplin", "Keaton"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onBackToSearch && onBackToSearch()}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 hover:text-white transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
