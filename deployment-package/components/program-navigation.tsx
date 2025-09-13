"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

interface NavigationItem {
  id: string;
  title: string;
  image: string;
  link: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "radio", title: "Radio", image: "/images/radio-congreso.png", link: "/radio" },
  { id: "programacion", title: "Programación", image: "/images/nuestra-programacion.png", link: "/programacion" },
  { id: "noticias", title: "Noticias", image: "/images/noticias-congreso.png", link: "/noticias" },
  { id: "transparencia", title: "Transparencia", image: "/images/transparencia.png", link: "https://www.canaldelcongreso.gob.mx/Transparencia" },
  { id: "contacto", title: "Contacto", image: "/images/contacto.png", link: "https://www.canaldelcongreso.gob.mx/Transparencia/contacto" },
];

export default function ProgramNavigation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useMobile();

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + NAVIGATION_ITEMS.length) % NAVIGATION_ITEMS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % NAVIGATION_ITEMS.length);
  };

  const getCircularIndex = (offset: number) => {
    return (activeIndex + offset + NAVIGATION_ITEMS.length) % NAVIGATION_ITEMS.length;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <section className="relative  lg:py-12">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-center min-h-[30rem]">
          {!isMobile && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 z-10 bg-white rounded-full p-3 hover:bg-gray-100 shadow"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-8 h-8 text-gray-800" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 z-10 bg-white rounded-full p-3 hover:bg-gray-100 shadow"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-8 h-8 text-gray-800" />
              </button>
            </>
          )}

          <div
            className="flex items-center justify-center gap-4 overflow-hidden min-h-[30rem] w-full"
            onTouchStart={(e) => {
              e.currentTarget.dataset.touchStart = String(e.touches[0].clientX);
              e.currentTarget.dataset.touchStartY = String(e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              e.currentTarget.dataset.touchEnd = String(e.touches[0].clientX);
              e.currentTarget.dataset.touchEndY = String(e.touches[0].clientY);
            }}
            onTouchEnd={(e) => {
              const startX = Number(e.currentTarget.dataset.touchStart || 0);
              const startY = Number(e.currentTarget.dataset.touchStartY || 0);
              const endX = Number(e.currentTarget.dataset.touchEnd || startX);
              const endY = Number(e.currentTarget.dataset.touchEndY || startY);
              
              const deltaX = startX - endX;
              const deltaY = Math.abs(startY - endY);
              
              // Only trigger swipe if horizontal movement is greater than vertical
              if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
                if (deltaX > 0) {
                  handleNext(); // Swipe left = next
                } else {
                  handlePrev(); // Swipe right = previous
                }
              }
            }}
          >
            {(isMobile ? [-1, 0, 1] : [-2, -1, 0, 1, 2]).map((offset) => {
              const index = getCircularIndex(offset);
              const item = NAVIGATION_ITEMS[index];
              const isCenter = offset === 0;

              const cardClasses = cn(
                "relative flex-shrink-0 rounded-[50px] overflow-hidden transition-all duration-300 transform",
                isCenter ? "scale-110 shadow-2xl" : "scale-90 opacity-60"
              );

              return (
                <Link
                  key={item.id}
                  href={item.link}
                  className={cn(cardClasses, "w-32 sm:w-36 md:w-44 lg:w-48")}
                  onClick={(e) => {
                    if (!isCenter) {
                      e.preventDefault();
                      if (offset < 0) handlePrev();
                      if (offset > 0) handleNext();
                    }
                  }}
                >
                  <div className="relative w-full aspect-[4/7] bg-gray-200">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 30vw, 15vw"
                      priority={isCenter}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
