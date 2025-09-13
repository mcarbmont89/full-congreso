
"use client"

import { useState, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Tipos definidos con claridad
interface NavigationItem {
  id: string
  title: string
  subtitle?: string
  image: string
  link: string
}

// Datos extraídos fuera del componente para mejor mantenibilidad
const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: "radio",
    title: "RADIO",
    subtitle: "CONGRESO",
    image: "/images/radio-congreso.png",
    link: "/radio",
  },
  {
    id: "programacion",
    title: "NUESTRA",
    subtitle: "PROGRAMACIÓN",
    image: "/images/nuestra-programacion.png",
    link: "/programacion",
  },
  {
    id: "noticias",
    title: "NOTICIAS",
    subtitle: "CONGRESO",
    image: "/images/noticias-congreso.png",
    link: "/noticias",
  },
  {
    id: "transparencia",
    title: "TRANSPARENCIA",
    image: "/images/transparencia.png",
    link: "/transparencia",
  },
  {
    id: "contacto",
    title: "CONTACTO",
    image: "/images/contacto.png",
    link: "/contacto",
  },
]

export default function ExpandedProgramNavigation() {
  const [activeIndex, setActiveIndex] = useState(2) // Inicialmente el elemento del centro está activo

  // Funciones memoizadas para evitar recreaciones innecesarias
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? NAVIGATION_ITEMS.length - 1 : prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === NAVIGATION_ITEMS.length - 1 ? 0 : prev + 1))
  }, [])

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  // Componente de elemento de navegación extraído para mejor legibilidad
  const NavigationCard = useMemo(() => {
    return function NavigationCard({
      item,
      index,
      isActive,
      distance,
    }: {
      item: NavigationItem
      index: number
      isActive: boolean
      distance: number
    }) {
      // Clases calculadas basadas en el estado - DIMENSIONES AMPLIADAS (3x ancho, 2x alto)
      const cardClasses = cn(
        "relative flex-shrink-0 rounded-3xl overflow-hidden transition-all duration-500 transform",
        // Tamaños responsivos ampliados para móvil y escritorio - WIDER CARDS
        isActive
          ? "w-92.4 h-80 sm:w-104.4 sm:h-88 md:w-116.4 md:h-96 z-20 scale-100 shadow-lg" // Incrementado 20% más en ancho
          : distance === 1
            ? "w-69.6 h-64 sm:w-81.6 sm:h-72 md:w-92.4 md:h-80 z-10 scale-90 opacity-80" // Incrementado 20% más en ancho
            : "hidden sm:block w-57.6 h-48 sm:w-63.6 sm:h-56 md:w-69.6 md:h-64 scale-75 opacity-60", // Incrementado 20% más en ancho
        "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50",
      )

      // Tamaño de texto ampliado para mantener proporciones
      const textClasses =
        "text-3xl sm:text-4xl md:text-5xl font-bold text-white absolute bottom-6 left-6 right-6 text-center drop-shadow-lg"

      return (
        <Link
          href={item.link}
          className={cardClasses}
          onClick={(e) => {
            if (!isActive) {
              e.preventDefault()
              setActiveIndex(index)
            }
          }}
          aria-label={`${item.title}${item.subtitle ? ` ${item.subtitle}` : ""}`}
        >
          {/* Imagen de fondo con overlay */}
          <div className="absolute inset-0">
            <Image
              src={item.image || "/placeholder.svg"}
              alt=""
              fill
              className="object-cover scale-98"
              sizes="(max-width: 640px) 240vw, (max-width: 768px) 120vw, 100vw"
              priority={isActive}
            />
          </div>

          {/* Texto ampliado con más padding */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
            <div className="text-white font-bold drop-shadow-lg">
              <div className="text-2xl sm:text-3xl md:text-4xl">{item.title}</div>
              {item.subtitle && <div className="text-2xl sm:text-3xl md:text-4xl mt-2">{item.subtitle}</div>}
            </div>
          </div>

          {/* Efecto de brillo para el elemento activo */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          )}
        </Link>
      )
    }
  }, [setActiveIndex])

  return (
    <section className="relative py-12 md:py-16 bg-[#fdf2f8]" aria-label="Navegación de programas ampliada">
      <div className="container mx-auto px-4">
        <div className="relative max-w-full mx-auto px-8">
          {" "}
          {/* Contenedor de ancho completo */}
          {/* Botones de navegación ampliados */}
          <button
            onClick={handlePrev}
            className="absolute -left-24 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 sm:p-6 hover:bg-gray-100 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#3b0764]"
            aria-label="Elemento anterior"
          >
            <ChevronLeft className="w-12 h-12 sm:w-15 sm:h-15 md:w-18 md:h-18 text-[#3b0764]" />{" "}
            {/* Iconos más grandes */}
          </button>
          <button
            onClick={handleNext}
            className="absolute -right-24 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 sm:p-6 hover:bg-gray-100 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#3b0764]"
            aria-label="Elemento siguiente"
          >
            <ChevronRight className="w-12 h-12 sm:w-15 sm:h-15 md:w-18 md:h-18 text-[#3b0764]" />{" "}
            {/* Iconos más grandes */}
          </button>
          {/* Contenedor de elementos con espaciado ampliado */}
          <div className="flex justify-center items-center space-x-12 sm:space-x-18 md:space-x-24 py-8 overflow-hidden">
            {NAVIGATION_ITEMS.map((item, index) => {
              // Calcular la distancia desde el elemento activo de manera más eficiente
              const distance = Math.min(
                Math.abs(index - activeIndex),
                Math.abs(index - activeIndex - NAVIGATION_ITEMS.length),
                Math.abs(index - activeIndex + NAVIGATION_ITEMS.length),
              )

              return (
                <NavigationCard
                  key={item.id}
                  item={item}
                  index={index}
                  isActive={index === activeIndex}
                  distance={distance}
                />
              )
            })}
          </div>
          {/* Indicadores ampliados */}
          <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 space-x-3 sm:space-x-6" role="tablist">
            {NAVIGATION_ITEMS.map((item, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={cn(
                  "h-3 sm:h-4 rounded-full transition-all",
                  index === activeIndex ? "bg-[#3b0764] w-12 sm:w-18" : "bg-gray-300 w-4.5 sm:w-6",
                )}
                aria-selected={index === activeIndex}
                aria-label={`Ir a ${item.title}`}
                role="tab"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
