import React from "react"
import {movies} from "@/data/movies" // Importamos la lista de películas
import { FiShuffle } from "react-icons/fi" // icono para dar impronta, usa react-icons

export default function DiscoverButton() {
  const handleClick = () => {
    const randomId = `/movie/${movies[Math.floor(Math.random() * movies.length)].id.toString()}`
    window.location.href = randomId
  }

  return (
    <button
      onClick={handleClick}
      className="
        flex items-center space-x-2
        bg-gray-900 text-gray-200
        border border-gray-700
        px-5 py-3 rounded-md
        font-semibold tracking-wide
        transition
        hover:bg-gray-800 hover:border-gray-500
        shadow-md hover:shadow-lg
        active:scale-95
        select-none
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
      "
      aria-label="Descubrir película aleatoria"
    >
      <FiShuffle className="w-5 h-5" />
      <span>Descubrir película</span>
    </button>
  )
}
