"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Search } from "lucide-react";

interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  imageUrl: string
  category?: string
  publishedAt: Date
  createdAt: Date
}

interface NewsGridProps {
  newsItems: NewsItem[]
  hideSearch?: boolean
}

export default function NewsGrid({ newsItems, hideSearch = false }: NewsGridProps) {
  const [imageErrors, setImageErrors] = useState(new Set<string>());
  const [searchTerm, setSearchTerm] = useState("");

  const handleImageError = (id: string) => {
    setImageErrors((prevErrors) => new Set(prevErrors.add(id)));
  };

  // Filter news items based on search term
  const filteredNewsItems = newsItems.filter(item => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.summary.toLowerCase().includes(searchLower) ||
      item.content.toLowerCase().includes(searchLower) ||
      (item.category && item.category.toLowerCase().includes(searchLower))
    );
  });

  if (newsItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No hay noticias disponibles</h2>
        <p className="text-gray-600">Las noticias aparecerán aquí cuando sean publicadas desde el panel administrativo.</p>
      </div>
    )
  }

  return (
    <>
      {/* Search Bar */}
      {!hideSearch && (
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Search Results Info */}
      {searchTerm.trim() && (
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            {filteredNewsItems.length > 0 
              ? `Se encontraron ${filteredNewsItems.length} resultado${filteredNewsItems.length !== 1 ? 's' : ''} para "${searchTerm}"`
              : `No se encontraron resultados para "${searchTerm}"`
            }
          </p>
        </div>
      )}

      {filteredNewsItems.length === 0 && searchTerm.trim() ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No se encontraron noticias
          </h3>
          <p className="text-gray-500 mb-4">
            Intenta con diferentes palabras clave o revisa la ortografía.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredNewsItems.map((item, index) => (
          <Link href={`/noticias/${item.id}`} key={`${item.id}-${index}`} className="block">
            <div className="relative overflow-hidden rounded-lg shadow-md group h-[338px] bg-gray-200">
              <Image
                src={imageErrors.has(item.id) ? "/placeholder.svg?height=338&width=400&text=Noticia" : (item.imageUrl || "/placeholder.svg?height=338&width=400&text=Noticia")}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized={true}
                onError={() => handleImageError(item.id)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-base font-bold line-clamp-2">{item.title}</h3>
                {item.category && (
                  <span className="inline-block mt-2 px-2 py-1 bg-purple-600 text-xs rounded">
                    {item.category}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
        </div>
      )}

      {filteredNewsItems.length > 12 && !searchTerm.trim() && (
        <div className="flex justify-center mt-8">
          <p className="text-gray-600">
            Mostrando todas las {filteredNewsItems.length} noticias disponibles
          </p>
        </div>
      )}

      {filteredNewsItems.length > 0 && searchTerm.trim() && (
        <div className="flex justify-center mt-8">
          <p className="text-gray-600">
            Mostrando {filteredNewsItems.length} de {newsItems.length} noticias
          </p>
        </div>
      )}
    </>
  )
}