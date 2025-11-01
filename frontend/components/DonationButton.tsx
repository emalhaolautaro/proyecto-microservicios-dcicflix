// components/DonationButton.tsx
"use client"

import { useState } from 'react'
import { Heart, Coffee, X } from 'lucide-react'

interface DonationButtonProps {
  variant?: 'default' | 'floating' | 'inline' | 'minimal'
  showMessage?: boolean
  className?: string
}

const DonationButton = ({ 
  variant = 'default', 
  showMessage = false,
  className = '' 
}: DonationButtonProps) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const cafecitoUrl = 'https://cafecito.app/lauemalhao'

  // Si es variante floating y fue dismisseado, no mostrar
  if (variant === 'floating' && dismissed) {
    return null
  }

  // Variante minimal - solo ícono (versión oscura)
  if (variant === 'minimal') {
    return (
      <a
        href={cafecitoUrl}
        rel="noopener noreferrer"
        target="_blank"
        className={`inline-flex items-center justify-center p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all duration-300 hover:scale-110 ${className}`}
        title="Invitame un café ☕"
      >
        <Coffee className="w-4 h-4" />
      </a>
    )
  }

  // Variante inline - botón simple (versión oscura)
  if (variant === 'inline') {
    return (
      <a
        href={cafecitoUrl}
        rel="noopener noreferrer"
        target="_blank"
        className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 hover:from-gray-600 hover:via-gray-500 hover:to-gray-600 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-gray-600/50 hover:border-gray-500/50 ${className}`}
      >
        <Coffee className="w-4 h-4 text-amber-300" />
        <span>Invitame un café</span>
        <Heart className="w-4 h-4 text-red-400" />
      </a>
    )
  }

  // Variante floating - botón flotante (versión oscura)
  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative">
          {/* Botón principal */}
          <a
            href={cafecitoUrl}
            rel="noopener noreferrer"
            target="_blank"
            className="flex items-center space-x-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-600 hover:to-gray-700 text-white px-4 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl group border border-gray-600/50"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Coffee className="w-5 h-5 group-hover:animate-bounce text-amber-300" />
            <span className="hidden sm:block">¿Te gusta el proyecto?</span>
            <Heart className="w-4 h-4 text-red-400 group-hover:text-red-300" />
          </a>

          {/* Botón de cerrar */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center text-xs transition-colors"
            title="Cerrar"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full mb-2 right-0 bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm">
              ¡Apoya el desarrollo con un cafecito! ☕
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Variante default - con imagen original
  return (
    <div className={`inline-block ${className}`}>
      {showMessage && (
        <div className="mb-3 text-center">
          <p className="text-gray-300 text-sm mb-1">
            ¿Te gustó este proyecto? 
          </p>
          <p className="text-gray-400 text-xs">
            Apóyame para seguir agregando más películas gratuitas
          </p>
        </div>
      )}
      
      <a 
        href={cafecitoUrl} 
        rel="noopener noreferrer" 
        target="_blank"
        className="block transition-all duration-300 hover:scale-105 hover:drop-shadow-lg"
      >
        <img 
          srcSet="https://cdn.cafecito.app/imgs/buttons/button_5.png 1x, https://cdn.cafecito.app/imgs/buttons/button_5_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_5_3.75x.png 3.75x" 
          src="https://cdn.cafecito.app/imgs/buttons/button_5.png" 
          alt="Invitame un café en cafecito.app"
          className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        />
      </a>
    </div>
  )
}

export default DonationButton