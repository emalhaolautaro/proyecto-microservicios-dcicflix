"use client"

import { Play, Film } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import HomeFooter from "@/components/HomeFooter"

export default function StreamingLanding() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Efectos de fondo minimalistas */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-32 left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-32 w-80 h-80 bg-white/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header minimalista coherente */}
      <header className="relative z-20 px-8 h-20 flex items-center">
        <div className="flex items-center space-x-3">
          <Film className="h-7 w-7 text-white" />
          <span className="text-xl font-medium text-white">FreeMovies</span>
        </div>
      </header>

      {/* Hero Section cinematográfica */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] relative z-10 px-8 max-w-4xl mx-auto">
        {/* Título principal minimalista */}
        <div className="relative mb-16 animate-fade-in">
          <h1 className="text-7xl md:text-8xl font-light text-white mb-12 tracking-tight">
            FreeMovies
          </h1>
        </div>

        {/* Descripción simple */}
        <p className="text-lg text-gray-400 mb-16 leading-relaxed max-w-lg mx-auto animate-fade-in-delayed text-center">
          Películas clásicas de dominio público.
          <br />
          Streaming gratuito.
        </p>

        {/* Botón mejorado pero coherente sin efecto gris */}
        <div className="relative inline-block animate-fade-in-slow mb-6">
          <Link href="/catalog" legacyBehavior>
            <button 
              className="relative inline-flex items-center justify-center bg-white text-black px-12 py-4 text-lg font-medium rounded-full transition-transform duration-300 hover:scale-105 shadow-xl hover:shadow-white/20"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Contenido del botón */}
              <div className="relative flex items-center">
                <div className={`mr-3 transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`}>
                  <Play className="h-5 w-5" />
                </div>
                <span>Ingresar</span>
              </div>
            </button>
          </Link>
        </div>

        {/* Links a Privacidad y Acerca de */}
        <div className="flex space-x-10 mb-12">
          <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-lg underline">
            Acerca de
          </Link>
          <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-lg underline">
            Privacidad
          </Link>
        </div>

        {/* Footer con donación y contacto */}
        <HomeFooter />
      </main>
    </div>
  )
}
