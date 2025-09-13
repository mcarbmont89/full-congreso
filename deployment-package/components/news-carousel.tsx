"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"


interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  imageUrl: string
  category?: string
  publishedAt: Date
  createdAt: Date
  slug: string
}

interface NewsCarouselProps {
  newsItems: NewsItem[]
}

export default function NewsCarousel({ newsItems }: NewsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Auto-advance the carousel
  useEffect(() => {
    if (isHovering) return

    const interval = setInterval(() => {
      handleNext()
    }, 6000)

    return () => clearInterval(interval)
  }, [isHovering, newsItems.length])

  const handlePrev = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setActiveIndex((current) => (current === 0 ? newsItems.length - 1 : current - 1))
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning, newsItems.length])

  const handleNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setActiveIndex((current) => (current === newsItems.length - 1 ? 0 : current + 1))
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning, newsItems.length])

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setActiveIndex(index)
      setTimeout(() => setIsTransitioning(false), 500)
    },
    [isTransitioning],
  )

  if (!newsItems.length) return null

  const activeItem = newsItems[activeIndex]

  return (
    <div
      className="relative w-full h-[563px] md:h-[675px] bg-gray-800 overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      

      {/* Main Carousel */}
      <div className="relative h-full w-full">
        {/* Slides */}
        {newsItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover"
              priority={index === activeIndex}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
        ))}

        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all duration-300 ease-in-out"
          aria-label="Anterior"
          disabled={isTransitioning}
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all duration-300 ease-in-out"
          aria-label="Siguiente"
          disabled={isTransitioning}
        >
          <ChevronRight className="h-8 w-8" />
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 p-8 text-white max-w-3xl z-20">
          <Link href={`/noticias/${activeItem.id}`} className="group">
            <span className="inline-block px-3 py-1 bg-purple-700 text-white text-xs uppercase font-bold rounded mb-2">
              {activeItem.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
              {activeItem.title}
            </h1>
            <div 
                className="text-gray-600 text-sm mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: activeItem.summary }}
              />
            <span className="inline-block mt-4 text-purple-300 font-medium group-hover:underline">Leer más</span>
          </Link>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
        {newsItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Ir a la noticia ${index + 1}`}
            disabled={isTransitioning}
          />
        ))}
      </div>
    </div>
  )
}