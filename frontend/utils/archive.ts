// Utilidades para trabajar con Internet Archive

export interface ArchiveMetadata {
  identifier: string
  title: string
  creator?: string
  date?: string
  description?: string
  subject?: string[]
  mediatype: string
}

// Función para buscar películas en Internet Archive
export const searchArchiveMovies = async (query: string, rows = 50) => {
  const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl=identifier,title,creator,date,description,subject&rows=${rows}&page=1&output=json&mediatype=movies`

  try {
    const response = await fetch(searchUrl)
    const data = await response.json()
    return data.response.docs as ArchiveMetadata[]
  } catch (error) {
    console.error("Error buscando en Archive.org:", error)
    return []
  }
}

// Función para obtener metadatos de una película específica
export const getArchiveMetadata = async (identifier: string) => {
  try {
    const response = await fetch(`https://archive.org/metadata/${identifier}`)
    const data = await response.json()
    return data.metadata
  } catch (error) {
    console.error("Error obteniendo metadatos:", error)
    return null
  }
}

// Función para construir URLs de Internet Archive
export const buildArchiveUrls = (identifier: string) => {
  return {
    details: `https://archive.org/details/${identifier}`,
    download: `https://archive.org/download/${identifier}`,
    thumbnail: `https://archive.org/download/${identifier}/${identifier}.thumbs/${identifier}_000001.jpg`,
    poster: `https://archive.org/download/${identifier}/${identifier}_poster.jpg`,
    embed: `https://archive.org/embed/${identifier}`,
  }
}
