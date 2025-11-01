"use client"

import { Mail, Coffee } from "lucide-react"
import { useState } from "react"

export default function HomeFooter() {
  const [emailCopied, setEmailCopied] = useState(false)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("freemoviesvercelapp@gmail.com")
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    } catch {
      // fallback o error
    }
  }

  return (
    <footer className="text-center py-8 border-t border-gray-800 bg-black">
      <div className="space-y-4">
        <p className="text-gray-400 text-sm">
          FreeMovies 2025 • Películas clásicas de dominio público • Todos los derechos reservados ©
        </p>

        <div className="flex justify-center space-x-6 text-gray-500 text-sm">
          <a
            href="https://cafecito.app/lauemalhao"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Coffee className="w-5 h-5" />
            Donar
          </a>

          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1 hover:text-white transition-colors text-sm"
          >
            <Mail className="w-5 h-5" />
            {emailCopied ? "¡Email copiado!" : "Contacto"}
          </button>
        </div>

        <p className="text-xs text-gray-500">Desarrollado por Lautaro Emalhao</p>
      </div>
    </footer>
  )
}
