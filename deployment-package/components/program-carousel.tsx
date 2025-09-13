"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"

export interface CarouselItem {
  id: string
  title: string
  image: string
  link: string
}

interface ProgramCarouselProps {
  items: CarouselItem[]
}

export default function ProgramCarousel({ items }: ProgramCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [itemsToShow, setItemsToShow] = useState(4)

  // Always call useMobile hook consistently
  const isMobile = useMobile()

  // Hydration effect - always called
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Items to show effect - always called
  useEffect(() => {
    const updateItemsToShow = () => {
      if (!isHydrated) {
        setItemsToShow(4)
        return
      }
      if (isMobile) {
        setItemsToShow(1)
        return
      }
      if (typeof window !== "undefined") {
        if (window.innerWidth < 768) {
          setItemsToShow(1)
        } else if (window.innerWidth < 1024) {
          setItemsToShow(2)
        } else {
          setItemsToShow(4)
        }
      } else {
        setItemsToShow(4)
      }
    }

    updateItemsToShow()

    if (typeof window !== "undefined") {
      window.addEventListener('resize', updateItemsToShow)
      return () => window.removeEventListener('resize', updateItemsToShow)
    }
  }, [isHydrated, isMobile])

  // Filter out invalid items with more defensive checks
  const validItems = Array.isArray(items) ? items.filter(item => 
    item && 
    typeof item === 'object' && 
    item.id && 
    item.title && 
    item.image && 
    item.link &&
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.image === 'string' &&
    typeof item.link === 'string'
  ) : []

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : validItems.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < validItems.length - 1 ? prevIndex + 1 : 0))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrevious()
    }

    // Reset touch states
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Calculate visible items
  const visibleItems = () => {
    const result = []
    const itemsToDisplay = Math.min(itemsToShow, validItems.length)
    for (let i = 0; i < itemsToDisplay; i++) {
      const index = (currentIndex + i) % validItems.length
      result.push(validItems[index])
    }
    return result
  }

  // Auto-slide effect - always called, no conditional logic
  useEffect(() => {
    if (validItems.length <= 1) {
      return // Do nothing if no items or only one item, but still call the hook
    }

    const autoSlide = setInterval(() => {
      handleNext()
    }, 5000)

    return () => clearInterval(autoSlide)
  }, [validItems.length]) // Add dependency to ensure it works with dynamic items

  // Don't render if no valid items - moved after all hooks
  if (validItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay programas disponibles</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#3b0764]">Categorías</h2>
        {validItems.length > 1 && (
          <div className="flex space-x-2">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full bg-[#3b0764] text-white hover:bg-[#4c0a80] transition-colors"
              aria-label="Anterior categoría"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-[#3b0764] text-white hover:bg-[#4c0a80] transition-colors"
              aria-label="Siguiente categoría"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={carouselRef}
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex transition-transform duration-500 ease-in-out gap-4">
          {visibleItems().map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-72 h-96 flex-shrink-0 transition-all duration-300"
            >
              <Link href={item.link} className="block h-full">
                <div className="relative h-full w-full rounded-lg overflow-hidden group cursor-pointer">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 288px"
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h1 className="text-4xl font-extrabold mb-2 drop-shadow-lg text-center">
                      {item.title}
                    </h1>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}