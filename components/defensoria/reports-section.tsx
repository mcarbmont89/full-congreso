"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, File, Calendar, ExternalLink } from "lucide-react"

interface Report {
  id: string
  title: string
  content?: string
  file_url?: string
  metadata?: {
    date?: string
    fileType?: string
    size?: string
    description?: string
  }
}

export default function ReportsSection() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/defensoria-audiencia?section=reports')
      
      if (response.ok) {
        const data = await response.json()
        console.log('Reports data:', data)
        
        if (data && data.length > 0) {
          setReports(data)
        } else {
          // Set default content when no data is found
          setReports([
            {
              id: '1',
              title: 'Informe Anual de Defensoría de Audiencia 2024',
              content: 'Informe completo de las actividades, estadísticas y resultados de la Defensoría de Audiencia durante el año 2024.',
              file_url: '/downloads/informe-defensoria-2024.pdf',
              metadata: {
                date: '2024-12-31',
                fileType: 'PDF',
                size: '2.4 MB',
                description: 'Documento con estadísticas, casos atendidos y mejoras implementadas.'
              }
            },
            {
              id: '2',
              title: 'Código de Ética del Canal del Congreso',
              content: 'Marco normativo y principios éticos que rigen el funcionamiento del Canal del Congreso y su programación.',
              file_url: '/downloads/codigo-etica-canal-congreso.pdf',
              metadata: {
                date: '2024-01-15',
                fileType: 'PDF',
                size: '1.8 MB',
                description: 'Lineamientos éticos y códigos de conducta del medio público.'
              }
            },
            {
              id: '3',
              title: 'Manual de Procedimientos - Defensoría',
              content: 'Guía detallada de los procedimientos para la atención de quejas, sugerencias y felicitaciones.',
              file_url: '/downloads/manual-procedimientos-defensoria.docx',
              metadata: {
                date: '2024-06-15',
                fileType: 'Word',
                size: '892 KB',
                description: 'Procedimientos internos para la gestión de solicitudes ciudadanas.'
              }
            }
          ])
        }
      } else {
        throw new Error('Failed to fetch reports')
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      setError('Error al cargar los informes')
      
      // Set fallback data on error
      setReports([
        {
          id: 'default',
          title: 'Informes de Defensoría de Audiencia',
          content: 'Los informes y documentos oficiales estarán disponibles aquí cuando se publiquen.',
          metadata: {
            date: new Date().toISOString().split('T')[0],
            fileType: 'Sistema'
          }
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getFileTypeColor = (fileType: string) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'word':
      case 'docx':
      case 'doc':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'excel':
      case 'xlsx':
      case 'xls':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />
      case 'word':
      case 'docx':
      case 'doc':
        return <File className="w-5 h-5 text-blue-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const handleDownload = (report: Report) => {
    if (report.file_url) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a')
      link.href = report.file_url
      link.download = report.title
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Informes y <span className="text-purple-600">Documentos</span>
            </h2>
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error && reports.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Informes y <span className="text-purple-600">Documentos</span>
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Informes y <span className="text-purple-600">Documentos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Accede a nuestros informes oficiales, códigos éticos y documentos normativos de la Defensoría de Audiencia.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card
                key={report.id}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 hover:border-purple-300 bg-white overflow-hidden"
              >
                <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {report.metadata?.fileType && getFileTypeIcon(report.metadata.fileType)}
                      <CardTitle className="text-lg font-semibold text-gray-800 leading-tight group-hover:text-purple-700 transition-colors">
                        {report.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* File Type and Size */}
                    <div className="flex flex-wrap gap-2">
                      {report.metadata?.fileType && (
                        <Badge className={`${getFileTypeColor(report.metadata.fileType)} font-medium`}>
                          {report.metadata.fileType}
                        </Badge>
                      )}
                      {report.metadata?.size && (
                        <Badge variant="secondary" className="font-medium">
                          {report.metadata.size}
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    {report.content && (
                      <p className="text-gray-700 leading-relaxed">
                        {report.content}
                      </p>
                    )}

                    {/* Metadata Description */}
                    {report.metadata?.description && (
                      <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500">
                        <p className="text-sm text-purple-700 font-medium">
                          {report.metadata.description}
                        </p>
                      </div>
                    )}

                    {/* Date */}
                    {report.metadata?.date && (
                      <div className="flex items-center text-sm text-gray-500 pt-2 border-t">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Publicado el {new Date(report.metadata.date).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}

                    {/* Download Button */}
                    {report.file_url && (
                      <div className="pt-4">
                        <Button
                          onClick={() => handleDownload(report)}
                          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Descargar {report.metadata?.fileType || 'Archivo'}
                        </Button>
                      </div>
                    )}

                    {/* External Link Alternative */}
                    {!report.file_url && report.content && report.id !== 'default' && (
                      <div className="pt-4">
                        <Button
                          variant="outline"
                          className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
                          disabled
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Próximamente Disponible
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {reports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hay informes disponibles
              </h3>
              <p className="text-gray-500">
                Los informes y documentos aparecerán aquí cuando estén disponibles.
              </p>
            </div>
          )}

          {/* Information Notice */}
          <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-100">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Transparencia y Acceso a la Información
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Todos nuestros informes y documentos están disponibles en cumplimiento con la Ley General de Transparencia 
                  y Acceso a la Información Pública. Si necesita algún documento específico que no se encuentre aquí disponible, 
                  puede solicitarlo a través de nuestros canales de contacto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}