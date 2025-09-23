"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Clock, FileText } from "lucide-react"

interface RecentRequest {
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

export default function RecentRequests() {
  const [requests, setRequests] = useState<RecentRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecentRequests()
  }, [])

  const fetchRecentRequests = async () => {
    try {
      const response = await fetch('/api/defensoria-audiencia?section=recent_requests')
      
      if (response.ok) {
        const data = await response.json()
        console.log('Recent requests data:', data)
        
        if (data && data.length > 0) {
          setRequests(data)
        } else {
          // Set default content when no data is found
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
      } else {
        throw new Error('Failed to fetch recent requests')
      }
    } catch (error) {
      console.error('Error fetching recent requests:', error)
      setError('Error al cargar las solicitudes recientes')
      
      // Set fallback data on error
      setRequests([
        {
          id: 'default',
          title: 'Solicitudes Recientes',
          content: 'Aquí se muestran las solicitudes más recientes atendidas por la Defensoría de Audiencia.',
          metadata: {
            date: new Date().toISOString().split('T')[0],
            status: 'Información',
            type: 'Sistema'
          }
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

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
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Recientes Solicitudes <span className="text-purple-600">Atendidas</span>
            </h2>
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error && requests.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Recientes Solicitudes <span className="text-purple-600">Atendidas</span>
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Recientes Solicitudes <span className="text-purple-600">Atendidas</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Conoce las últimas solicitudes que hemos atendido y las mejoras implementadas gracias a la participación ciudadana.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <Card
                key={request.id}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white overflow-hidden"
              >
                <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold leading-tight group-hover:text-purple-100 transition-colors">
                      {request.title}
                    </CardTitle>
                    {request.metadata?.status && getStatusIcon(request.metadata.status)}
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Status and Type Badges */}
                    <div className="flex flex-wrap gap-2">
                      {request.metadata?.status && (
                        <Badge className={`${getStatusColor(request.metadata.status)} font-medium`}>
                          {request.metadata.status}
                        </Badge>
                      )}
                      {request.metadata?.type && (
                        <Badge className={`${getTypeColor(request.metadata.type)} font-medium`}>
                          {request.metadata.type}
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 leading-relaxed">
                      {request.content}
                    </p>

                    {/* Description */}
                    {request.metadata?.description && (
                      <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-purple-500">
                        <p className="text-sm text-gray-600 font-medium">
                          {request.metadata.description}
                        </p>
                      </div>
                    )}

                    {/* Date */}
                    {request.metadata?.date && (
                      <div className="flex items-center text-sm text-gray-500 pt-2 border-t">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Atendido el {new Date(request.metadata.date).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
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