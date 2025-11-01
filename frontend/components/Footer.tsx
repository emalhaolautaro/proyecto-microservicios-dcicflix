"use client"

import { Heart, Film, Coffee, Mail, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import DonationButton from './DonationButton'

interface FooterProps {
  searchQuery?: string
  movieCount?: number
}

const Footer = ({ searchQuery, movieCount }: FooterProps) => {
  const [emailCopied, setEmailCopied] = useState(false)
  
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('freemoviesvercelapp@gmail.com')
      setEmailCopied(true)
      // Resetear después de 2 segundos
      setTimeout(() => setEmailCopied(false), 2000)
    } catch (err) {
      console.log('Error copying email:', err)
    }
  }

  return (
    <footer className="bg-gradient-to-t from-gray-900 to-gray-800 border-t border-gray-700">
      {/* Sección de donación destacada */}
      <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-b border-yellow-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-red-400 mr-2" />
              <h3 className="text-xl sm:text-2xl font-medium text-white">
                ¿Te gusta el proyecto?
              </h3>
            </div>
            
            <p className="text-gray-300 text-base sm:text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
              Si te interesa apoyarme para seguir agregando más películas clásicas 
              y mejorando la plataforma, <span className="text-yellow-400">invitame un café</span>. 
              Tu apoyo hace posible que este proyecto siga creciendo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <DonationButton variant="inline" className="transform hover:scale-105" />
              
              <div className="flex items-center text-sm text-gray-400">
                <Coffee className="w-4 h-4 mr-1" />
                <span>Cada aporte cuenta</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información del sitio */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6">
          {/* Sobre el proyecto */}
          <div>
            <div className="flex items-center mb-3">
              <Film className="w-5 h-5 text-white mr-2" />
              <h4 className="text-white font-medium">FreeMovies</h4>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Una plataforma dedicada a preservar y compartir el cine clásico 
              de dominio público, haciéndolo accesible para todos.
            </p>
          </div>

          {/* Estadísticas */}
          <div>
            <h4 className="text-white font-medium mb-3">Colección</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Películas disponibles:</span>
                <span className="text-white font-medium">{movieCount || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Géneros:</span>
                <span className="text-white font-medium">12+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Todas:</span>
                <span className="text-green-400 font-medium">Dominio Público</span>
              </div>
            </div>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="text-white font-medium mb-3">Contacto</h4>
            <div className="space-y-2">
              <button 
                onClick={handleCopyEmail}
                className="flex items-center text-gray-400 hover:text-white transition-colors text-sm group"
              >
                {emailCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    <span className="text-green-400">¡Email copiado!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    <span>Sugerir película</span>
                    <Copy className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </button>

              {/* Nuevos links */}
              <a 
                href="/about"
                className="block text-gray-400 hover:text-white transition-colors text-sm mt-2"
              >
                Acerca de
              </a>
              <a 
                href="/privacy"
                className="block text-gray-400 hover:text-white transition-colors text-sm mt-1"
              >
                Privacidad
              </a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-gray-500 text-xs sm:text-sm">
                {searchQuery ? (
                  <>
                    Mostrando {movieCount} resultado{movieCount !== 1 ? "s" : ""} para "{searchQuery}"
                  </>
                ) : (
                  <>
                    Mostrando {movieCount} película{movieCount !== 1 ? "s" : ""}
                  </>
                )}{" "}
                • Todas las películas son de dominio público
              </p>
            </div>
            
            <div className="text-center sm:text-right">
              <p className="text-gray-500 text-xs">
                FreeMovies 2025 • Hecho con{" "}
                <Heart className="w-3 h-3 inline text-red-400 mx-1" />
                para el cine clásico
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Marca de agua sutil */}
      <div className="bg-gray-900 py-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center text-gray-600 text-xs">
            © 2025 - Preservando el patrimonio cinematográfico mundial
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer