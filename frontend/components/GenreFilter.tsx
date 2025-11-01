"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface GenreFilterProps {
  genres: string[]
  selectedGenre: string
  onGenreChange: (genre: string) => void
}

export default function GenreFilter({ genres, selectedGenre, onGenreChange }: GenreFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollTo = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollAmount = 200

    const targetScroll =
      direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    })

    setTimeout(() => {
      updateScrollButtons()
    }, 300)
  }

  return (
    <div className="px-8 py-6 border-b border-gray-800">
      <h2 className="text-white text-lg font-medium mb-4">Filtrar por género</h2>
      <div className="relative group">
        {/* Botón izquierdo */}
        {canScrollLeft && (
          <button
            onClick={() => scrollTo("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all duration-300 opacity-60 hover:opacity-100 backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* Botón derecho */}
        {canScrollRight && (
          <button
            onClick={() => scrollTo("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all duration-300 opacity-60 hover:opacity-100 backdrop-blur-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Contenedor de géneros */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide"
          onScroll={updateScrollButtons}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedGenre === genre
                  ? "bg-white text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
