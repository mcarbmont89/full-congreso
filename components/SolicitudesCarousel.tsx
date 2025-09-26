'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const solicitudesData = [
  {
    pregunta: "¿Por qué no transmiten las sesiones completas del Senado?",
    respuesta: "Le informamos que el Canal del Congreso transmite íntegramente todas las sesiones ordinarias y extraordinarias del Senado conforme a la programación oficial.",
    fecha: "15 de agosto, 2024"
  },
  {
    pregunta: "¿Pueden mejorar la calidad del audio en las transmisiones?",
    respuesta: "Agradecemos su observación. Hemos implementado mejoras técnicas en nuestro sistema de audio para brindar una mejor experiencia a nuestra audiencia.",
    fecha: "22 de agosto, 2024"
  },
  {
    pregunta: "¿Por qué no hay subtítulos en las transmisiones?",
    respuesta: "Estamos trabajando en implementar subtítulos automáticos para hacer más accesible nuestro contenido a personas con discapacidad auditiva.",
    fecha: "1 de septiembre, 2024"
  },
  {
    pregunta: "¿Cómo puedo reportar una falla técnica durante la transmisión?",
    respuesta: "Puede contactarnos a través de nuestro formulario de contacto o enviando un mensaje directo a nuestras redes sociales oficiales durante la transmisión.",
    fecha: "10 de septiembre, 2024"
  },
  {
    pregunta: "¿Tienen programación especial para eventos legislativos importantes?",
    respuesta: "Sí, programamos cobertura especial para sesiones extraordinarias, comparecencias y eventos legislativos de alta relevancia nacional.",
    fecha: "18 de septiembre, 2024"
  }
]

export default function SolicitudesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  })
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={scrollNext}
          disabled={nextBtnDisabled}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {solicitudesData.map((item, i) => (
            <div key={i} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-6">
              <div className="bg-white shadow-md p-0 overflow-hidden mr-6">
                <div className="bg-[#5b199a] text-white px-6 py-3 text-sm font-extrabold tracking-wide">
                  PREGUNTA:
                </div>
                <div className="p-6">
                  <p className="text-[14px] font-semibold text-gray-700 mb-3">
                    {item.pregunta}
                  </p>
                  <div className="bg-gray-100 text-white px-4 py-2 text-xs font-extrabold tracking-wide mb-3">
                    <span className="text-gray-600">RESPUESTA:</span>
                  </div>
                  <p className="text-[13px] text-[#5b199a] leading-5 mb-4">
                    {item.respuesta}
                  </p>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 font-medium">
                      {item.fecha}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {solicitudesData.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === 0 ? 'bg-purple-600' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => emblaApi?.scrollTo(i)}
          />
        ))}
      </div>
    </div>
  )
}