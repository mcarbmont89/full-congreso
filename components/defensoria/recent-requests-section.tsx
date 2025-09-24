
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

interface RequestItem {
  id: string
  title: string
  content: string
  metadata?: {
    date?: string
    status?: string
    type?: string
    description?: string
  }
}

export default function RecentRequestsSection() {
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRequestsData = async () => {
      try {
        const response = await fetch('/api/defensoria-audiencia?section=recent_requests')
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            const items = data.slice(0, 3).map((item: DefensoriaContent, index: number) => {
              const metadata = item.metadata || {}
              return {
                id: item.id.toString(),
                title: item.title || `Solicitud ${index + 1}`,
                content: item.content || '',
                metadata: {
                  date: metadata.date,
                  status: metadata.status,
                  type: metadata.type,
                  description: metadata.description
                }
              }
            })
            setRequests(items)
          } else {
            // Fallback data if no database content
            setRequests([
              {
                id: '1',
                title: 'Mejora en la Calidad de Audio',
                content: 'Solicitud atendida sobre la calidad del audio en las transmisiones en vivo del Canal 45.1.',
                metadata: {
                  date: '2025-09-15',
                  status: 'Resuelto',
                  type: 'Sugerencia',
                  description: 'Se implementaron mejoras técnicas en el sistema de audio.'
                }
              },
              {
                id: '2',
                title: 'Subtítulos para Personas con Discapacidad Auditiva',
                content: 'Propuesta para incluir subtítulos en todas las transmisiones del Canal del Congreso.',
                metadata: {
                  date: '2025-09-10',
                  status: 'En proceso',
                  type: 'Sugerencia',
                  description: 'Se está trabajando en la implementación de subtítulos automáticos.'
                }
              },
              {
                id: '3',
                title: 'Felicitaciones por Cobertura Especial',
                content: 'Reconocimiento por la excelente cobertura del período de sesiones ordinarias.',
                metadata: {
                  date: '2025-09-05',
                  status: 'Resuelto',
                  type: 'Felicitaciones',
                  description: 'Agradecimiento por la profesionalidad en la cobertura legislativa.'
                }
              }
            ])
          }
        }
      } catch (error) {
        console.error('Error fetching requests data:', error)
        // Set fallback data on error
        setRequests([
          {
            id: '1',
            title: 'Mejora en la Calidad de Audio',
            content: 'Solicitud atendida sobre la calidad del audio en las transmisiones en vivo del Canal 45.1.',
            metadata: {
              date: '2025-09-15',
              status: 'Resuelto',
              type: 'Sugerencia',
              description: 'Se implementaron mejoras técnicas en el sistema de audio.'
            }
          },
          {
            id: '2',
            title: 'Subtítulos para Personas con Discapacidad Auditiva',
            content: 'Propuesta para incluir subtítulos en todas las transmisiones del Canal del Congreso.',
            metadata: {
              date: '2025-09-10',
              status: 'En proceso',
              type: 'Sugerencia',
              description: 'Se está trabajando en la implementación de subtítulos automáticos.'
            }
          },
          {
            id: '3',
            title: 'Felicitaciones por Cobertura Especial',
            content: 'Reconocimiento por la excelente cobertura del período de sesiones ordinarias.',
            metadata: {
              date: '2025-09-05',
              status: 'Resuelto',
              type: 'Felicitaciones',
              description: 'Agradecimiento por la profesionalidad en la cobertura legislativa.'
            }
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequestsData()
  }, [])

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

  if (isLoading) {
    return (
      <section 
        className="py-12 md:py-14 bg-white"
        style={{
          backgroundImage: "url('/images/defensoria-micrositio-fondo-new.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-center font-black text-[#1f1f1f] tracking-tight uppercase leading-tight text-[26px] sm:text-[30px] md:text-[36px] mb-8 md:mb-10">
            RECIENTES SOLICITUDES
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
      className="py-12 md:py-14 bg-white"
      style={{
        backgroundImage: "url('/images/defensoria-micrositio-fondo-new.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-center font-black text-[#1f1f1f] tracking-tight uppercase leading-tight text-[26px] sm:text-[30px] md:text-[36px] mb-8 md:mb-10">
          RECIENTES SOLICITUDES
        </h2>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.07)] border border-[#7d4bcd]/20 p-6 text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
              >
                {/* Title */}
                <div className="mb-4">
                  <h3 className="text-[16px] md:text-[18px] font-black text-[#7746d6] leading-tight mb-2">
                    {request.title}
                  </h3>
                </div>

                {/* Status and Type Badges */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {request.metadata?.status && (
                    <Badge className={`${getStatusColor(request.metadata.status)} font-medium text-xs`}>
                      {request.metadata.status}
                    </Badge>
                  )}
                  {request.metadata?.type && (
                    <Badge className={`${getTypeColor(request.metadata.type)} font-medium text-xs`}>
                      {request.metadata.type}
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <p className="text-[13px] md:text-[14px] text-gray-700 leading-relaxed mb-4">
                  {request.content}
                </p>

                {/* Description */}
                {request.metadata?.description && (
                  <div className="bg-[#7746d6]/10 p-3 rounded-lg mb-4">
                    <p className="text-xs text-[#7746d6] font-medium">
                      {request.metadata.description}
                    </p>
                  </div>
                )}

                {/* Date */}
                {request.metadata?.date && (
                  <div className="flex items-center justify-center text-xs text-gray-500 pt-2 border-t border-gray-200">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>
                      {new Date(request.metadata.date).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {requests.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hay solicitudes recientes
              </h3>
              <p className="text-gray-500">
                Las solicitudes atendidas aparecerán aquí cuando estén disponibles.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
