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
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden"
      style={{
        backgroundColor: "#3b0764",
        backgroundImage: "url(/images/purple-pattern-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
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
            <div className="flex items-center justify-center h-full w-full">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title}
                width={800}
                height={600}
                className="object-contain transition-transform duration-300 rounded-3xl max-h-full max-w-full"
                unoptimized={true}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
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
            <span className="inline-block px-4 py-2 bg-purple-700/90 backdrop-blur-sm text-white text-xs uppercase font-bold rounded-full mb-3 shadow-lg">
              {activeItem.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold mb-3 group-hover:text-purple-300 transition-colors drop-shadow-2xl leading-tight">
              {activeItem.title}
            </h1>
            <div
                className="text-gray-200 text-sm mb-4 line-clamp-3 drop-shadow-lg"
                dangerouslySetInnerHTML={{ __html: activeItem.summary }}
              />
            <span className="inline-block mt-4 text-purple-300 font-medium group-hover:underline drop-shadow-lg">Leer más</span>
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