import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Film, Play, Shield, Globe } from "lucide-react"
import { getMovieById } from "@/data/movies"
import VideoPlayer from "@/components/VideoPlayer"
import LicenseInfo from "@/components/LicenseInfo"
import ShareButton from "@/components/ShareButton"
import DonationButton from "@/components/DonationButton"

interface MoviePageProps {
  params: Promise<{ id: string }>
}

// Componente para el logo de Creative Commons - Dominio Público
const PublicDomainLogo = () => (
  <div className="flex items-center space-x-2 text-sm text-gray-300">
    <div className="flex items-center space-x-1">
      {/* Logo CC */}
      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
        <span className="text-black font-bold text-xs">CC</span>
      </div>
      {/* Logo PD (Public Domain) */}
      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
        <span className="text-black font-bold text-xs">PD</span>
      </div>
    </div>
    <span>Dominio Público</span>
  </div>
)

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params
  const movieId = Number.parseInt(id)
  const movie = getMovieById(movieId)

  if (!movie) {
    notFound()
  }

  const getGenreColor = (genre: string) => {
    const colors = {
      Horror: "from-red-600 via-red-500 to-red-700",
      "Sci-Fi": "from-blue-500 via-cyan-400 to-blue-600",
      Drama: "from-purple-500 via-violet-400 to-purple-600",
      Comedy: "from-yellow-500 via-amber-400 to-orange-500",
      Western: "from-orange-500 via-red-400 to-yellow-500",
      Romance: "from-pink-500 via-rose-400 to-red-500",
      Thriller: "from-gray-600 via-slate-500 to-gray-700",
      Action: "from-green-500 via-emerald-400 to-teal-500",
      Adventure: "from-teal-500 via-cyan-400 to-blue-500",
      Mystery: "from-indigo-500 via-purple-400 to-violet-500",
      Fantasy: "from-violet-500 via-purple-400 to-pink-500",
      Documentary: "from-stone-500 via-gray-400 to-slate-500",
    }
    return colors[genre as keyof typeof colors] || "from-gray-500 via-slate-400 to-gray-600"
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="relative z-10 px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/catalog" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          <span className="text-white text-sm sm:text-base">Volver al catálogo</span>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <Film className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          <span className="text-lg sm:text-xl font-medium text-white">FreeMovies</span>
        </div>
      </header>

      <main className="px-4 sm:px-8 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                {movie.posterUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={movie.posterUrl}
                      alt={`Póster de ${movie.title}`}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${getGenreColor(movie.genre)} flex flex-col items-center justify-center text-center p-4 sm:p-8 relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-6 left-6 w-8 h-8 border-2 border-white rounded-full"></div>
                      <div className="absolute top-12 right-8 w-6 h-6 border border-white rounded-full"></div>
                      <div className="absolute bottom-8 left-8 w-10 h-10 border border-white rounded-full"></div>
                      <div className="absolute bottom-6 right-6 w-4 h-4 bg-white rounded-full"></div>
                      <div className="absolute top-0 left-1/2 w-px h-full bg-white opacity-10"></div>
                      <div className="absolute left-0 top-1/2 w-full h-px bg-white opacity-10"></div>
                    </div>

                    <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-white/20 rounded-full border-2 border-white/30">
                      <Film className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                    </div>
                    <div className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-3 leading-tight px-2">{movie.title}</div>
                    <div className="text-white/80 text-base sm:text-lg mb-1 sm:mb-2">{movie.year}</div>
                    <div className="text-white/60 text-sm mb-2 sm:mb-4">{movie.genre}</div>
                    <div className="text-white/50 text-xs sm:text-sm px-2">Dir. {movie.director}</div>

                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-green-600/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs text-white font-medium flex items-center space-x-1 sm:space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold text-[8px] sm:text-[10px]">CC</span>
                        </div>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold text-[8px] sm:text-[10px]">PD</span>
                        </div>
                      </div>
                      <span className="hidden sm:inline">Dominio Público</span>
                      <span className="sm:hidden">Público</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Información detallada */}
            <div className="lg:col-span-2 flex flex-col justify-center">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center space-x-1 sm:space-x-2 text-gray-300 text-sm sm:text-base">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 text-gray-300 text-sm sm:text-base">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{movie.duration}</span>
                </div>
                <span
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r ${getGenreColor(movie.genre)} text-white`}
                >
                  {movie.genre}
                </span>
              </div>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">{movie.description}</p>

              <div className="text-gray-400 mb-4 sm:mb-6 space-y-1">
                <p className="text-sm sm:text-base">
                  <strong>Director:</strong> {movie.director}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Año:</strong> {movie.year}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Duración:</strong> {movie.duration}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Género:</strong> {movie.genre}
                </p>
              </div>

              {/* Información de licencia */}
              <div className="mb-4 sm:mb-6">
                <LicenseInfo type="public-domain" />
              </div>

              {movie.videoUrl && (
                <div className="mt-4 sm:mt-6">
                  <div className="flex items-center space-x-2 text-green-400 mb-2">
                    <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="font-medium text-sm sm:text-base">Película disponible para ver</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reproductor de video */}
          {movie.videoUrl ? (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Ver película</h2>
              <VideoPlayer videoUrl={movie.videoUrl} title={movie.title} />
              
              {/* Botones de acción - Compartir y Donación */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <ShareButton />
                <DonationButton />
              </div>
            </div>
          ) : (
            <div className="mb-6 sm:mb-8 p-6 sm:p-8 bg-gray-900 rounded-2xl text-center">
              <Film className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">Video no disponible</h2>
              <p className="text-gray-500 text-sm sm:text-base">Esta película aún no tiene un enlace de video configurado.</p>
              
              {/* Botones de acción también cuando no hay video */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <ShareButton />
                <DonationButton />
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-gray-800/50">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Información técnica</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              <div>
                <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4 flex items-center space-x-2">
                  <Film className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <span>Detalles de la película</span>
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400 text-sm sm:text-base">Año de producción</span>
                    <span className="text-white font-medium text-sm sm:text-base">{movie.year}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400 text-sm sm:text-base">Duración</span>
                    <span className="text-white font-medium text-sm sm:text-base">{movie.duration}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400 text-sm sm:text-base">Género</span>
                    <span className="text-white font-medium text-sm sm:text-base">{movie.genre}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-400 text-sm sm:text-base">Director</span>
                    <span className="text-white font-medium text-sm sm:text-base">{movie.director}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4 flex items-center space-x-2">
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <span>Disponibilidad</span>
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400 text-sm sm:text-base">Streaming</span>
                    <span className={`font-medium text-sm sm:text-base ${movie.videoUrl ? 'text-green-400' : 'text-red-400'}`}>
                      {movie.videoUrl ? "Disponible" : "No disponible"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400 text-sm sm:text-base">Calidad</span>
                    <span className="text-white font-medium text-sm sm:text-base">Variable</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de licencia destacada - MEJORADA PARA MÓVILES */}
            <div className="border-t border-gray-800 pt-6 sm:pt-8">
              <h3 className="text-base sm:text-lg font-medium text-white mb-4 sm:mb-6 flex items-center space-x-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <span>Licencia y derechos de uso</span>
              </h3>
              
              {/* Logo CC destacado en la sección final - RESPONSIVE */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 border border-gray-700/50 rounded-xl p-4 sm:p-6 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-1 flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-gray-800 font-bold text-base sm:text-lg">CC</span>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-gray-800 font-bold text-base sm:text-lg">PD</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="text-white font-medium text-base sm:text-lg mb-1">Creative Commons - Dominio Público</div>
                    <div className="text-gray-300 mb-3 text-sm sm:text-base">Esta obra forma parte del dominio público mundial</div>
                    
                    {/* Razón específica del dominio público */}
                    <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3 mb-3">
                      <div className="text-blue-300 font-medium text-sm mb-1">¿Por qué es dominio público?</div>
                      <div className="text-blue-200 text-xs sm:text-sm leading-relaxed">
                        {movie.publicDomainReason}
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <LicenseInfo type="public-domain" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Grid de permisos - MEJORADO PARA MÓVILES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm mb-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span>Uso comercial permitido</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span>Modificación permitida</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span>Distribución libre</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span>Sin atribución requerida</span>
                </div>
              </div>
              
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Esta película forma parte del dominio público, lo que significa que puedes verla, descargarla,
                compartirla y usarla libremente sin restricciones de derechos de autor.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}