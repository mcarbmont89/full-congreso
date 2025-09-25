"use client"

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import useEmblaCarousel from 'embla-carousel-react'

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

interface RequestItem {
  id: string
  pregunta: string
  respuesta: string
  fecha: string
}

export default function RecentRequestsSection() {
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 1 },
      '(min-width: 1024px)': { slidesToScroll: 1 }
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

  useEffect(() => {
    const fetchRequestsData = async () => {
      try {
        const response = await fetch('/api/defensoria-audiencia?section=recent_requests')
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            const items = data.slice(0, 6).map((item: DefensoriaContent, index: number) => {
              const metadata = item.metadata || {}
              return {
                id: item.id.toString(),
                pregunta: item.title || `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.`,
                respuesta: item.content || `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.`,
                fecha: metadata.date || '2025-09-15'
              }
            })
            setRequests(items)
          } else {
            // Fallback data if no database content
            setRequests([
              {
                id: '1',
                pregunta: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
                respuesta: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
                fecha: '2025-09-15'
              },
              {
                id: '2',
                pregunta: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
                respuesta: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
                fecha: '2025-09-10'
              },
              {
                id: '3',
                pregunta: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
                respuesta: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
                fecha: '2025-09-05'
              },
              {
                id: '4',
                pregunta: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
                respuesta: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
                fecha: '2025-08-30'
              },
              {
                id: '5',
                pregunta: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
                respuesta: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
                fecha: '2025-08-25'
              },
              {
                id: '6',
                pregunta: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
                respuesta: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
                fecha: '2025-08-20'
              }
            ])
          }
        }
      } catch (error) {
        console.error('Error fetching requests data:', error)
        // Set fallback data on error with the same structure as above
        setRequests([
          {
            id: '1',
            pregunta: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
            respuesta: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
            fecha: '2025-09-15'
          },
          {
            id: '2',
            pregunta: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
            respuesta: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
            fecha: '2025-09-10'
          },
          {
            id: '3',
            pregunta: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
            respuesta: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
            fecha: '2025-09-05'
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequestsData()
  }, [])

  if (isLoading) {
    return (
      <section
        className="py-12 md:py-14"
        style={{
          backgroundImage: "url('/images/defensoria-micrositio-fondo-new.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-center font-black text-[#1f1f1f] tracking-tight uppercase leading-tight text-[26px] sm:text-[30px] md:text-[36px] mb-8 md:mb-10">
            RECIENTES SOLICITUDES ATENDIDAS
          </h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (requests.length === 0) {
    return null
  }

  return (
    <section
      className="py-12 md:py-14"
      style={{
        backgroundImage: "url('/images/defensoria-micrositio-fondo-new.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-center font-black text-[#4f148c] tracking-tight uppercase leading-tight text-[26px] sm:text-[30px] md:text-[36px] mb-8 md:mb-10">
          RECIENTES SOLICITUDES ATENDIDAS
        </h2>

        <div className="relative mx-auto max-w-7xl">
          {/* Navigation Buttons - Purple circular arrows */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-20 h-20 rounded-full bg-[#8b5cdf] hover:bg-[#7746d6] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg -ml-10"
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
          >
            <ChevronLeft className="w-10 h-10" strokeWidth={3} />
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-20 h-20 rounded-full bg-[#8b5cdf] hover:bg-[#7746d6] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg -mr-10"
            onClick={scrollNext}
            disabled={nextBtnDisabled}
          >
            <ChevronRight className="w-10 h-10" strokeWidth={3} />
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {requests.map((request) => (
                <div key={request.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-6">
                  <div className="bg-white rounded-2xl overflow-hidden mr-6 shadow-[0_6px_20px_rgba(0,0,0,0.07)] relative">
                    {/* Checkmark icon in top-right corner */}
                    <div className="absolute top-4 right-4 z-10 w-8 h-8 bg-[#8b5cdf] rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>

                    {/* Purple header with "PREGUNTA:" */}
                    <div className="bg-[#8b5cdf] text-white px-6 py-4 relative">
                      <h3 className="text-sm font-black tracking-wide uppercase">
                        PREGUNTA:
                      </h3>
                    </div>

                    {/* White content area */}
                    <div className="p-6">
                      {/* Question text */}
                      <p className="text-[14px] font-medium text-gray-800 mb-4 leading-relaxed">
                        {request.pregunta}
                      </p>

                      {/* Purple "RESPUESTA:" label */}
                      <div className="bg-[#8b5cdf] text-white px-4 py-2 mb-4 rounded">
                        <h4 className="text-xs font-black tracking-wide uppercase">
                          RESPUESTA:
                        </h4>
                      </div>

                      {/* Answer text */}
                      <p className="text-[13px] text-gray-600 leading-relaxed">
                        {request.respuesta}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}