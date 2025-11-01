"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getGenres, filterMoviesByGenre, movies } from "@/data/movies"
import MovieCard from "@/components/MovieCard"
import GenreFilter from "@/components/GenreFilter"
import SearchBar from "@/components/SearchBar"
import SearchSuggestion from "@/components/SearchSuggestion"
import NotFoundPage from "@/components/NotFoundPage"
import Footer from "@/components/Footer"
import { findSuggestion } from "@/utils/search"
import DiscoverButton from "@/components/DiscoverButton"

// Componente para el indicador de carga
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      <span className="ml-3 text-gray-400">Cargando más películas...</span>
    </div>
  )
}

export default function CatalogPage() {
  const [selectedGenre, setSelectedGenre] = useState("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNotFound, setShowNotFound] = useState(false)
  
  // Estados para lazy loading
  const [displayedMoviesCount, setDisplayedMoviesCount] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement | null>(null)

  const genres = getGenres()

  // Obtener todos los títulos para sugerencias
  const allTitles = useMemo(() => movies.map((movie) => movie.title), [])

  // Filtrar películas por género y búsqueda
  const filteredMovies = useMemo(() => {
    let result = filterMoviesByGenre(selectedGenre)

    if (searchQuery.trim()) {
      result = result.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genre.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return result
  }, [selectedGenre, searchQuery])

  // Películas que se muestran actualmente (para lazy loading)
  const displayedMovies = useMemo(() => {
    return filteredMovies.slice(0, displayedMoviesCount)
  }, [filteredMovies, displayedMoviesCount])

  // Verificar si mostrar sugerencia
  const suggestion = useMemo(() => {
    if (searchQuery.trim() && filteredMovies.length === 0) {
      return findSuggestion(searchQuery, allTitles, 0.3)
    }
    return null
  }, [searchQuery, filteredMovies.length, allTitles])

  // Función para cargar más películas
  const loadMoreMovies = useCallback(() => {
    if (isLoading || displayedMoviesCount >= filteredMovies.length) return
    
    setIsLoading(true)
    
    // Simular un pequeño delay para una mejor UX
    setTimeout(() => {
      setDisplayedMoviesCount(prev => Math.min(prev + 10, filteredMovies.length))
      setIsLoading(false)
    }, 300)
  }, [isLoading, displayedMoviesCount, filteredMovies.length])

  // Configurar Intersection Observer
  useEffect(() => {
    if (!loadingRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreMovies()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(loadingRef.current)
    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMoreMovies])

  // Reset del contador cuando cambian los filtros
  useEffect(() => {
    setDisplayedMoviesCount(10)
  }, [selectedGenre, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowNotFound(false)
    setDisplayedMoviesCount(10)

    // Si hay búsqueda y no hay resultados, mostrar página de error después de un delay
    if (query.trim() && filteredMovies.length === 0) {
      setTimeout(() => setShowNotFound(true), 300)
    }
  }

  const handleAcceptSuggestion = (suggestedTitle: string) => {
    setSearchQuery(suggestedTitle)
    setShowNotFound(false)
  }

  const handleBackToSearch = () => {
    setSearchQuery("")
    setShowNotFound(false)
    setSelectedGenre("Todos")
  }

  // Si hay búsqueda sin resultados pero con sugerencia, mostrar sugerencia
  if (searchQuery.trim() && filteredMovies.length === 0 && suggestion && !showNotFound) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Header */}
        <header className="relative z-10 px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5 text-white" />
            <span className="text-white">Volver</span>
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-xl font-medium text-white">FreeMovies</span>
          </div>
        </header>

        {/* Contenido principal */}
        <div className="flex-1">
          {/* Título y búsqueda */}
          <div className="px-8 py-12">
            <h1 className="text-4xl md:text-5xl font-light text-white mb-8 text-center">
              Catálogo de Películas Clásicas
            </h1>
            <div className="mb-8">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Sugerencia */}
          <SearchSuggestion
            originalQuery={searchQuery}
            suggestedTitle={suggestion}
            onAcceptSuggestion={handleAcceptSuggestion}
          />

          {/* Botón para mostrar página de error */}
          <div className="text-center px-8">
            <button
              onClick={() => setShowNotFound(true)}
              className="text-gray-400 hover:text-white transition-colors text-sm underline"
            >
              No, busco exactamente "{searchQuery}"
            </button>
          </div>
        </div>

        {/* Footer */}
        <Footer searchQuery={searchQuery} movieCount={filteredMovies.length} />
      </div>
    )
  }

  // Si hay búsqueda sin resultados y sin sugerencia, mostrar página de error
  if (searchQuery.trim() && filteredMovies.length === 0 && showNotFound) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Header */}
        <header className="relative z-10 px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5 text-white" />
            <span className="text-white">Volver</span>
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-xl font-medium text-white">FreeMovies</span>
          </div>
        </header>

        <div className="flex-1">
          <NotFoundPage searchQuery={searchQuery} onBackToSearch={handleBackToSearch} />
        </div>

        {/* Footer */}
        <Footer searchQuery={searchQuery} movieCount={0} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header con navegación */}
      <header className="relative z-10 px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <ArrowLeft className="h-5 w-5 text-white" />
          <span className="text-white">Volver</span>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="text-xl font-medium text-white">FreeMovies</span>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex-1">
        {/* Título y búsqueda */}
        <div className="px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-8 text-center">Catálogo de Películas Clásicas</h1>

          {/* Barra de búsqueda */}
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          <p className="text-gray-400 text-lg text-center">
            {searchQuery ? (
              <>
                Resultados para "{searchQuery}" • {filteredMovies.length} película{filteredMovies.length !== 1 ? "s" : ""}
              </>
            ) : (
              <>
                Descubre joyas del cine de dominio público
                {selectedGenre !== "Todos" && <span className="ml-2 text-white">• {selectedGenre}</span>}
              </>
            )}
          </p>
        </div>

        {/* BOTÓN DESCUBRIR: solo si no hay búsqueda */}
        {!searchQuery && (
          <div className="flex justify-center mb-6">
            <DiscoverButton />
          </div>
        )}

        {/* Filtro de géneros (solo si no hay búsqueda) */}
        {!searchQuery && (
          <GenreFilter genres={genres} selectedGenre={selectedGenre} onGenreChange={setSelectedGenre} />
        )}

        {/* Grilla de películas con lazy loading */}
        <main className="py-12 px-8">
          {/* Grid responsive de MovieCards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {displayedMovies.map((movie, index) => (
              <MovieCard key={`${movie.title}-${index}`} movie={movie} />
            ))}
          </div>

          {/* Indicador de carga */}
          {displayedMoviesCount < filteredMovies.length && (
            <div ref={loadingRef}>
              {isLoading && <LoadingSpinner />}
            </div>
          )}

          {/* Mensaje cuando se han cargado todas */}
          {displayedMoviesCount >= filteredMovies.length && filteredMovies.length > 10 && (
            <div className="text-center py-8">
              <p className="text-gray-400">
                Has visto todas las {filteredMovies.length} películas disponibles
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Footer con botón de donación */}
      <Footer searchQuery={searchQuery} movieCount={filteredMovies.length} />
    </div>
  )
}