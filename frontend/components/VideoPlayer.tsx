"use client"

import { useState } from "react"

interface VideoPlayerProps {
  videoUrl: string
  title: string
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [loading, setLoading] = useState(true)

  // Función para convertir URLs a formato embed
  const getEmbedUrl = (url: string): string => {
    // YouTube
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    // Archive.org
    if (url.includes("archive.org")) {
      if (url.includes("/embed/")) return url
      if (url.includes("/details/")) {
        const identifier = url.split("details/")[1]?.split("/")[0]?.split("?")[0]
        return `https://archive.org/embed/${identifier}`
      }
      const parts = url.split("/")
      const identifier = parts[parts.length - 1]?.split("?")[0]
      if (identifier) return `https://archive.org/embed/${identifier}`
    }

    return url
  }

  const embedUrl = getEmbedUrl(videoUrl)

  const handleIframeError = () => {
    console.log("Error loading video, trying alternative URL...")
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={handleIframeError}
      />
    </div>
  )
}
