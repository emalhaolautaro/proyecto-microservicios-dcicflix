"use client"

import { useEffect, useState } from "react"

export default function Loading() {
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Asegurar que el loading se muestre por lo menos 1 segundo
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!showLoading) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header skeleton */}
      <header className="relative z-10 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-5 w-5 bg-gray-800 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-800 rounded animate-pulse"></div>
        </div>
        <div className="h-6 w-24 bg-gray-800 rounded animate-pulse"></div>
      </header>

      {/* Title and search skeleton */}
      <div className="px-8 py-12">
        <div className="h-12 w-96 bg-gray-800 rounded mx-auto mb-8 animate-pulse"></div>

        {/* Search bar skeleton */}
        <div className="max-w-md mx-auto mb-8">
          <div className="h-12 w-full bg-gray-800 rounded-full animate-pulse"></div>
        </div>

        <div className="h-4 w-64 bg-gray-800 rounded mx-auto animate-pulse"></div>
      </div>

      {/* Genre filter skeleton */}
      <div className="px-8 py-6 border-b border-gray-800">
        <div className="h-5 w-32 bg-gray-800 rounded mb-4 animate-pulse"></div>
        <div className="flex gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-800 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Movie carousels skeleton */}
      <main className="py-12 space-y-12">
        {[...Array(3)].map((_, carouselIndex) => (
          <div key={carouselIndex} className="relative">
            {/* Carousel title skeleton */}
            <div className="h-6 w-48 bg-gray-800 rounded mb-6 px-8 animate-pulse"></div>

            {/* Movie cards skeleton */}
            <div className="flex gap-6 px-8">
              {[...Array(4)].map((_, cardIndex) => (
                <div key={cardIndex} className="flex-shrink-0 w-72">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    {/* Poster skeleton with genre-like gradient */}
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 animate-pulse">
                      {/* Subtle pattern overlay */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 left-4 w-6 h-6 border-2 border-white/30 rounded-full"></div>
                        <div className="absolute top-8 right-6 w-4 h-4 bg-white/20 rounded-full"></div>
                        <div className="absolute bottom-6 left-6 w-5 h-5 border border-white/20 rounded-full"></div>
                        <div className="absolute bottom-4 right-4 w-3 h-3 bg-white/10 rounded-full"></div>
                      </div>

                      {/* Center content skeleton */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <div className="mb-4 p-4 bg-white/10 rounded-full">
                          <div className="h-8 w-8 bg-white/20 rounded"></div>
                        </div>
                        <div className="h-4 w-32 bg-white/20 rounded mb-2"></div>
                        <div className="h-3 w-16 bg-white/15 rounded mb-1"></div>
                        <div className="h-3 w-20 bg-white/10 rounded mb-3"></div>
                        <div className="h-2 w-24 bg-white/10 rounded"></div>
                      </div>
                    </div>

                    {/* Card info skeleton */}
                    <div className="p-6">
                      <div className="h-5 w-40 bg-gray-800 rounded mb-2 animate-pulse"></div>

                      <div className="flex items-center space-x-4 mb-3">
                        <div className="h-3 w-12 bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-3 w-16 bg-gray-800 rounded animate-pulse"></div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="h-6 w-16 bg-gray-800 rounded-full animate-pulse"></div>
                        <div className="h-5 w-20 bg-gray-800 rounded animate-pulse"></div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="h-3 w-full bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-3 w-3/4 bg-gray-800 rounded animate-pulse"></div>
                      </div>

                      <div className="h-3 w-32 bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Loading indicator */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 flex items-center space-x-3">
          {/* Spinning loader */}
          <div className="relative">
            <div className="w-6 h-6 border-2 border-white/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <span className="text-white text-sm font-medium">Cargando películas...</span>
        </div>
      </div>

      {/* Subtle pulsing overlay */}
      <div className="fixed inset-0 bg-black/20 animate-pulse pointer-events-none"></div>
    </div>
  )
}
