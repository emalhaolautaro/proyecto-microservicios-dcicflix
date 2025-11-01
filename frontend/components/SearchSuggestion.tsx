"use client"

import { Search } from "lucide-react"

interface SearchSuggestionProps {
  originalQuery: string
  suggestedTitle: string
  onAcceptSuggestion: (suggestion: string) => void
}

export default function SearchSuggestion({ originalQuery, suggestedTitle, onAcceptSuggestion }: SearchSuggestionProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mx-8 mb-8">
      <div className="flex items-center justify-center text-center">
        <div className="flex items-center space-x-3">
          <Search className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-gray-300 mb-2">
              No se encontraron resultados para <span className="text-white font-medium">"{originalQuery}"</span>
            </p>
            <p className="text-gray-400 mb-4">¿Quisiste decir:</p>
            <button
              onClick={() => onAcceptSuggestion(suggestedTitle)}
              className="inline-flex items-center bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105"
            >
              <span className="mr-2">"{suggestedTitle}"</span>
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
