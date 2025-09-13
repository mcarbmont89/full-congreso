"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Tipos definidos con claridad
interface NavigationItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
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
];

export default function ExtremeProgramNavigation() {
  const [activeIndex, setActiveIndex] = useState(2); // Inicialmente el elemento del centro está activo

  // Funciones memoizadas para evitar recreaciones innecesarias
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) =>
      prev === 0 ? NAVIGATION_ITEMS.length - 1 : prev - 1,
    );
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) =>
      prev === NAVIGATION_ITEMS.length - 1 ? 0 : prev + 1,
    );
  }, []);

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Componente de elemento de navegación extraído para mejor legibilidad
  const NavigationCard = useMemo(() => {
    return function NavigationCard({
      item,
      index,
      isActive,
      distance,
    }: {
      item: NavigationItem;
      index: number;
      isActive: boolean;
      distance: number;
    }) {
      // Clases calculadas basadas en el estado - DIMENSIONES EXTREMAS (12x ancho original, 4x alto original)
      const cardClasses = cn(
        "relative flex-shrink-0 rounded-[3rem] overflow-hidden transition-all duration-500 transform",
        // Tamaños extremadamente ampliados - WIDER CARDS
        isActive
          ? "w-556.8 h-192 sm:w-627.6 sm:h-224 md:w-697.2 md:h-256 z-20 scale-100 shadow-xl" // Incrementado 20% más en ancho
          : distance === 1
            ? "w-418.8 h-160 sm:w-488.4 sm:h-192 md:w-556.8 md:h-224 z-10 scale-90 opacity-80" // Incrementado 20% más en ancho
            : "hidden sm:block w-348 h-128 sm:w-382.8 sm:h-160 md:w-418.8 md:h-192 scale-75 opacity-60", // Incrementado 20% más en ancho
        "hover:opacity-100 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50",
      );

      // Tamaño de texto extremadamente ampliado
      const textClasses =
        "text-6xl sm:text-7xl md:text-8xl font-bold text-white absolute bottom-12 left-12 right-12 text-center drop-shadow-xl";

      return (
        <Link
          href={item.link}
          className={cardClasses}
          onClick={(e) => {
            if (!isActive) {
              e.preventDefault();
              setActiveIndex(index);
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
              sizes="(max-width: 640px) 960vw, (max-width: 768px) 480vw, 400vw"
              priority={isActive}
            />
          </div>

          {/* Overlay para mejorar legibilidad */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Texto extremadamente ampliado con más padding */}
          <div className="absolute bottom-0 left-0 right-0 p-16 text-center">
            <div className="text-white font-bold drop-shadow-xl">
              <div className="text-5xl sm:text-6xl md:text-7xl text-stroke-sm">{item.title}</div>
              {item.subtitle && (
                <div className="text-5xl sm:text-6xl md:text-7xl mt-6 text-stroke-sm">{item.subtitle}</div>
              )}
            </div>
          </div>

          {/* Efecto de brillo para el elemento activo */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          )}
        </Link>
      );
    };
  }, [setActiveIndex]);

  return (
    <section
      className="relative py-24 md:py-32 bg-[#fdf2f8] overflow-x-hidden"
      aria-label="Navegación de programas extremadamente ampliada"
    >
      <div className="container-fluid px-8 mx-auto">
        <div className="relative mx-auto w-full px-12">
          {" "}
          {/* Contenedor de ancho completo */}
          {/* Botones de navegación extremadamente ampliados */}
          <button
            onClick={handlePrev}
            className="absolute -left-40 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-12 hover:bg-gray-100 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#3b0764]"
            aria-label="Elemento anterior"
          >
            <ChevronLeft className="w-48 h-48 text-[#3b0764]" />{" "}
            {/* Iconos extremadamente grandes */}
          </button>
          <button
            onClick={handleNext}
            className="absolute -right-40 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-12 hover:bg-gray-100 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#3b0764]"
            aria-label="Elemento siguiente"
          >
            <ChevronRight className="w-48 h-48 text-[#3b0764]" />{" "}
            {/* Iconos extremadamente grandes */}
          </button>
          {/* Contenedor de elementos con espaciado extremadamente ampliado */}
          <div className="flex justify-center items-center space-x-32 sm:space-x-48 md:space-x-64 py-32 overflow-hidden">
            {NAVIGATION_ITEMS.map((item, index) => {
              // Calcular la distancia desde el elemento activo de manera más eficiente
              const distance = Math.min(
                Math.abs(index - activeIndex),
                Math.abs(index - activeIndex - NAVIGATION_ITEMS.length),
                Math.abs(index - activeIndex + NAVIGATION_ITEMS.length),
              );

              return (
                <NavigationCard
                  key={item.id}
                  item={item}
                  index={index}
                  isActive={index === activeIndex}
                  distance={distance}
                />
              );
            })}
          </div>
          {/* Indicadores extremadamente ampliados */}
          <div
            className="flex justify-center mt-16 sm:mt-24 md:mt-32 space-x-12 sm:space-x-24"
            role="tablist"
          >
            {NAVIGATION_ITEMS.map((item, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={cn(
                  "h-12 sm:h-16 rounded-full transition-all",
                  index === activeIndex
                    ? "bg-[#3b0764] w-48 sm:w-72"
                    : "bg-gray-300 w-18 sm:w-24",
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
  );
}