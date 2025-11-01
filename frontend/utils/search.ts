// Utilidad para búsqueda difusa y sugerencias con validaciones de seguridad

// Función para validar y sanitizar el input
function validateAndSanitizeQuery(query: string): string | null {
  // ✅ Verificar que sea string
  if (typeof query !== 'string') return null
  
  // ✅ Limitar longitud (previene ataques DoS)
  if (query.length > 200) return null
  
  // ✅ Remover caracteres peligrosos
  const sanitized = query
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remover scripts
    .replace(/[<>]/g, '') // Remover < y >
    .trim()
  
  // ✅ Verificar longitud mínima después de sanitización
  if (sanitized.length < 1 || sanitized.length > 200) return null
  
  return sanitized
}

// Función para calcular la distancia de Levenshtein (similitud entre strings)
function levenshteinDistance(str1: string, str2: string): number {
  // ✅ Validar inputs
  if (!str1 || !str2) return Infinity
  
  // ✅ Limitar procesamiento para strings muy largos (prevenir DoS)
  if (str1.length > 100 || str2.length > 100) return Infinity
  
  const matrix = []

  // Crear matriz
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  // Llenar matriz
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitución
          matrix[i][j - 1] + 1, // inserción
          matrix[i - 1][j] + 1, // eliminación
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

// Función para calcular similitud (0-1, donde 1 es idéntico)
function similarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  const distance = levenshteinDistance(longer, shorter)
  return (longer.length - distance) / longer.length
}

// Función para normalizar strings (quitar acentos, espacios extra, etc.)
function normalizeString(str: string): string {
  if (!str || typeof str !== 'string') return ''
  
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
    .replace(/[^\w\s]/g, "") // Quitar puntuación
    .replace(/\s+/g, " ") // Normalizar espacios
    .trim()
}

// Función principal para encontrar sugerencias
export function findSuggestion(
  query: string, 
  titles: string[], 
  threshold = 0.4
): string | null {
  // ✅ Validar y sanitizar query
  const sanitizedQuery = validateAndSanitizeQuery(query)
  if (!sanitizedQuery) return null
  
  const normalizedQuery = normalizeString(sanitizedQuery)

  if (normalizedQuery.length < 2) return null

  // ✅ Validar array de títulos
  if (!Array.isArray(titles) || titles.length === 0) return null
  
  // ✅ Limitar número de títulos procesados (performance y seguridad)
  const limitedTitles = titles.slice(0, 10000) // Máximo 10k títulos

  let bestMatch = ""
  let bestScore = 0

  limitedTitles.forEach((title) => {
    // ✅ Validar cada título
    if (!title || typeof title !== 'string') return
    
    const normalizedTitle = normalizeString(title)
    if (!normalizedTitle) return

    // Calcular similitud
    const score = similarity(normalizedQuery, normalizedTitle)

    // También verificar si la query está contenida en el título
    const containsScore = normalizedTitle.includes(normalizedQuery) ? 0.8 : 0

    // También verificar similitud de palabras individuales
    const queryWords = normalizedQuery.split(" ").filter(word => word.length > 0)
    const titleWords = normalizedTitle.split(" ").filter(word => word.length > 0)

    let wordScore = 0
    queryWords.forEach((queryWord) => {
      titleWords.forEach((titleWord) => {
        const wordSim = similarity(queryWord, titleWord)
        if (wordSim > wordScore) wordScore = wordSim
      })
    })

    const finalScore = Math.max(score, containsScore, wordScore * 0.7)

    if (finalScore > bestScore && finalScore >= threshold) {
      bestScore = finalScore
      bestMatch = title
    }
  })

  return bestMatch || null
}

// Función para verificar si una búsqueda es muy similar a un título existente
export function shouldShowSuggestion(query: string, titles: string[]): boolean {
  const suggestion = findSuggestion(query, titles, 0.3)
  return suggestion !== null && normalizeString(suggestion) !== normalizeString(query)
}

// ✅ Nueva función para uso en componentes React
export function safeSearch(query: string, titles: string[]) {
  try {
    const suggestion = findSuggestion(query, titles)
    const shouldShow = shouldShowSuggestion(query, titles)
    
    return {
      suggestion,
      shouldShow,
      isValid: suggestion !== null
    }
  } catch (error) {
    console.error('Error in search:', error)
    return {
      suggestion: null,
      shouldShow: false,
      isValid: false
    }
  }
}