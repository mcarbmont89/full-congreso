"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Clock, FileText } from "lucide-react"

interface DefensoriaContent {
  id: number
  section: string
  title?: string
  content?: string
  image_url?: string
  file_url?: string
  metadata?: any
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface CarouselItem {
  question: string
  answer: string
}

export default function RecentRequestsSection() {
  const [carouselData, setCarouselData] = useState<CarouselItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true) // Added isLoading state

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const response = await fetch('/api/defensoria-audiencia?section=recent_requests')
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            const items = data.map((item: DefensoriaContent) => {
              const metadata = item.metadata || {}
              return {
                question: metadata.question || item.title || '',
                answer: metadata.answer || item.content || ''
              }
            })
            setCarouselData(items)
          } else {
            // Fallback data if no database content
            setCarouselData([
              {
                question: "¿Cómo puedo presentar una queja sobre el contenido del Canal del Congreso?",
                answer: "Puedes presentar tu queja a través de nuestros formularios en línea, por correo electrónico o directamente en nuestras oficinas. Tu opinión es muy importante para nosotros."
              },
              {
                question: "¿Qué tipo de programación maneja el Canal del Congreso?",
                answer: "Transmitimos sesiones legislativas, programas informativos, debates, entrevistas y contenido educativo relacionado con el trabajo parlamentario y la democracia."
              },
              {
                question: "¿Cómo puedo acceder a transmisiones anteriores?",
                answer: "Todas nuestras transmisiones están disponibles en nuestro archivo digital y plataformas digitales oficiales para consulta pública las 24 horas del día."
              }
            ])
          }
        }
      } catch (error) {
        console.error('Error fetching carousel data:', error)
        // Set fallback data on error
        setCarouselData([
          {
            question: "¿Cómo puedo presentar una queja sobre el contenido del Canal del Congreso?",
            answer: "Puedes presentar tu queja a través de nuestros formularios en línea, por correo electrónico o directamente en nuestras oficinas."
          }
        ])
      } finally { // Ensure isLoading is set to false after fetch
        setIsLoading(false)
      }
    }

    fetchCarouselData()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselData.length - 1 : prevIndex - 1
    )
  }

  // Original helper functions (kept for potential future use or if not fully refactored)
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resuelto':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'en proceso':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'pendiente':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'queja':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'sugerencia':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'felicitaciones':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resuelto':
        return <CheckCircle className="w-4 h-4" />
      case 'en proceso':
        return <Clock className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  // Removed the card mapping and rendering logic from the original code
  // as the new carousel structure replaces it.

  if (isLoading) { // Added loading state handling
    return (
      <section className="py-12 md:py-16" style={{ backgroundImage: "url('/images/defensoria-micrositio-fondo-new.png')" }}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h2 className="text-center font-black uppercase text-[22px] md:text-[28px] mb-8">
            RECIENTES SOLICITUDES ATENDIDAS
          </h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (carouselData.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-14 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-center font-black text-[#1f1f1f] tracking-tight uppercase leading-tight text-[26px] sm:text-[30px] md:text-[36px] mb-8 md:mb-10">
          RECIENTES SOLICITUDES
        </h2>

        <div className="mx-auto max-w-4xl">
          <div className="bg-[#7746d6] rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
            {/* Carousel Content */}
            <div className="relative min-h-[200px] flex items-center">
              <div className="w-full">
                <h3 className="text-[18px] md:text-[20px] font-bold mb-4">
                  {carouselData[currentIndex]?.question}
                </h3>
                <p className="text-[15px] md:text-[16px] leading-relaxed opacity-95">
                  {carouselData[currentIndex]?.answer}
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            {carouselData.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
                  aria-label="Anterior solicitud"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
                  aria-label="Siguiente solicitud"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {carouselData.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {carouselData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    aria-label={`Ir a solicitud ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}