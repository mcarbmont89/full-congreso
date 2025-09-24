
"use client"

import { useState, useEffect } from 'react'
import { FileText, Download, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AnnualReport {
  id: string
  title: string
  content?: string
  file_url?: string
  metadata?: {
    year?: number
    reportType?: string
    period?: string
  }
}

export default function AnnualReportsSection() {
  const [reports, setReports] = useState<AnnualReport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/defensoria-audiencia?section=annual_reports')
      
      if (response.ok) {
        const data = await response.json()
        if (data && data.length > 0) {
          // Sort by year (newest first)
          const sortedReports = data.sort((a: AnnualReport, b: AnnualReport) => {
            const yearA = a.metadata?.year || 0
            const yearB = b.metadata?.year || 0
            return yearB - yearA
          })
          setReports(sortedReports)
        } else {
          // Default data if no CMS content
          setReports([
            {
              id: '1',
              title: 'Informe Anual de Defensoría de Audiencia',
              content: 'Informe completo de las actividades, estadísticas y resultados de la Defensoría de Audiencia.',
              file_url: '/downloads/informe-defensoria-2024.pdf',
              metadata: { year: 2024, reportType: 'Informe Anual', period: 'Enero - Diciembre 2024' }
            },
            {
              id: '2',
              title: 'Plan de Trabajo de Defensoría',
              content: 'Plan estratégico y objetivos para el período establecido.',
              file_url: '/downloads/plan-trabajo-2023.pdf',
              metadata: { year: 2023, reportType: 'Plan de Trabajo', period: 'Año 2023' }
            },
            {
              id: '3',
              title: 'Informe Anual de Defensoría de Audiencia',
              content: 'Resumen de actividades y logros alcanzados durante el año.',
              file_url: '/downloads/informe-defensoria-2022.pdf',
              metadata: { year: 2022, reportType: 'Informe Anual', period: 'Enero - Diciembre 2022' }
            }
          ])
        }
      }
    } catch (error) {
      console.error('Error fetching annual reports:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (report: AnnualReport) => {
    if (report.file_url) {
      const link = document.createElement('a')
      link.href = report.file_url
      link.download = `${report.title}_${report.metadata?.year || ''}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getYearColor = (year: number) => {
    const colors = [
      'bg-purple-600 text-white',
      'bg-indigo-600 text-white', 
      'bg-blue-600 text-white',
      'bg-cyan-600 text-white',
      'bg-teal-600 text-white',
      'bg-green-600 text-white'
    ]
    return colors[(year - 2019) % colors.length] || 'bg-gray-600 text-white'
  }

  // Group reports by year for the grid layout
  const reportsByYear = reports.reduce((acc, report) => {
    const year = report.metadata?.year || new Date().getFullYear()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(report)
    return acc
  }, {} as Record<number, AnnualReport[]>)

  const years = Object.keys(reportsByYear).map(Number).sort((a, b) => b - a)

  return (
    <section className="py-12 md:py-16 bg-gray-50" style={{ backgroundImage: "url('/images/defensoria-micrositio-fondo-new.png')" }}>
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <h2 className="text-center font-black uppercase text-[22px] md:text-[28px] mb-8 text-gray-800">
          INFORMES DE DEFENSORÍA DE AUDIENCIAS
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : years.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {years.map((year) => {
              const yearReports = reportsByYear[year]
              const mainReport = yearReports[0] // Take the first report for each year
              
              return (
                <div key={year} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Year Header */}
                  <div className={`${getYearColor(year)} p-6 text-center`}>
                    <h3 className="text-3xl font-black mb-2">{year}</h3>
                    <div className="text-sm font-semibold opacity-90">
                      {mainReport.metadata?.reportType || 'INFORME ANUAL'}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {mainReport.metadata?.period || 'PLAN DE TRABAJO'}
                    </div>
                  </div>

                  {/* Report Content */}
                  <div className="p-6">
                    <h4 className="font-bold text-lg mb-3 text-gray-800 leading-tight">
                      {mainReport.title}
                    </h4>
                    
                    {mainReport.content && (
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {mainReport.content.slice(0, 120)}...
                      </p>
                    )}

                    {/* Multiple reports for same year */}
                    {yearReports.length > 1 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">
                          {yearReports.length} documentos disponibles
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {yearReports.slice(1).map((report, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {report.metadata?.reportType || 'Documento'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Download Buttons */}
                    <div className="space-y-2">
                      {yearReports.map((report, index) => (
                        <button
                          key={report.id}
                          onClick={() => handleDownload(report)}
                          disabled={!report.file_url}
                          className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            index === 0 
                              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          } ${!report.file_url ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Download className="w-4 h-4" />
                          <span>
                            {index === 0 ? 'Descargar PDF' : report.metadata?.reportType || 'Documento'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer Icons */}
                  <div className="bg-gray-50 px-6 py-3 flex justify-center space-x-4">
                    <div className="flex items-center text-gray-500">
                      <FileText className="w-4 h-4 mr-1" />
                      <span className="text-xs">PDF</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-xs">{year}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No hay informes disponibles</h3>
            <p>Los informes anuales aparecerán aquí cuando estén disponibles.</p>
          </div>
        )}
      </div>
    </section>
  )
}
