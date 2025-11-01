"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import MovieCard from "./MovieCard"
import type { Movie } from "@/data/movies"

interface MovieCarouselProps {
  movies: Movie[]
  title: string
}

export default function MovieCarousel({ movies, title }: MovieCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const itemWidth = 320 // Ancho de cada card + gap
  const visibleItems = 4 // Número de items visibles

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollTo = (direction: "left" | "right") => {
    if (!scrollContainerRef.current || isScrolling) return

    setIsScrolling(true)
    const container = scrollContainerRef.current
    const scrollAmount = itemWidth * 2 // Scroll 2 items at a time

    const targetScroll =
      direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    })

    setTimeout(() => {
      setIsScrolling(false)
      updateScrollButtons()
    }, 300)
  }

  useEffect(() => {
    updateScrollButtons()
  }, [movies])

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && canScrollRight) {
      scrollTo("right")
    }
    if (isRightSwipe && canScrollLeft) {
      scrollTo("left")
    }
  }

  if (movies.length === 0) return null

  return (
    <div className="relative">
      {/* Título */}
      <h2 className="text-2xl font-semibold text-white mb-6 px-8">{title}</h2>

      {/* Contenedor del carousel */}
      <div className="relative group">
        {/* Botón izquierdo */}
        {canScrollLeft && (
          <button
            onClick={() => scrollTo("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 opacity-60 hover:opacity-100 backdrop-blur-sm"
            disabled={isScrolling}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Botón derecho */}
        {canScrollRight && (
          <button
            onClick={() => scrollTo("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 opacity-60 hover:opacity-100 backdrop-blur-sm"
            disabled={isScrolling}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-8 pb-4"
          onScroll={updateScrollButtons}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-72">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
