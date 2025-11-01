import Link from "next/link";
import { Play, Calendar, Clock } from "lucide-react";
import { useState } from "react";

type Movie = {
  id: number;
  title: string;
  year: number;
  duration: string;
  genre: string;
  posterUrl?: string;
  videoUrl?: string;
  description: string;
  director: string;
};

type MovieCardProps = {
  movie: Movie;
};

function getGenreColor(genre: string) {
  switch (genre.toLowerCase()) {
    case "acción":
      return "bg-red-800";
    case "comedia":
      return "bg-yellow-700";
    case "drama":
      return "bg-blue-900";
    case "terror":
      return "bg-black";
    case "aventura":
      return "bg-green-800";
    default:
      return "bg-gray-800";
  }
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardContent = (
    <div 
      className="cursor-pointer transform transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-white/10 transition-all duration-300">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center text-white text-3xl font-bold ${getGenreColor(
                movie.genre
              )}`}
            >
              {movie.genre}
            </div>
          )}

          {/* Overlay controlado por estado React */}
          <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 flex items-center justify-center ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            {movie.videoUrl ? (
              <div className={`border-2 border-white/70 rounded-full p-3 transition-all duration-300 backdrop-blur-sm hover:bg-white/10 ${
                isHovered ? 'scale-100' : 'scale-90'
              }`}>
                <Play className="h-6 w-6 text-white ml-0.5 fill-white" />
              </div>
            ) : (
              <div className="text-white/80 text-sm font-medium border border-white/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                Próximamente
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center space-x-4 text-gray-400 text-sm mb-3">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{movie.year}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{movie.duration}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="inline-block bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
              {movie.genre}
            </span>
            {movie.videoUrl ? (
              <span className="inline-block bg-green-900/50 text-green-300 px-2 py-1 rounded text-xs">
                ▶ Ver ahora
              </span>
            ) : (
              <span className="inline-block bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded text-xs">
                Próximamente
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {movie.description}
          </p>
          <p className="text-gray-500 text-xs">Dir. {movie.director}</p>
        </div>
      </div>
    </div>
  );

  return movie.videoUrl ? (
    <Link href={`/movie/${movie.id}`}>{cardContent}</Link>
  ) : (
    cardContent
  );
}