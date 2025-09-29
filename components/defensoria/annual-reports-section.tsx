
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, File } from 'lucide-react'

interface ReportType {
  type: string
  description: string
  pdfUrl?: string
  wordUrl?: string
}

interface YearGroup {
  year: string
  reports: ReportType[]
}

interface DefensoriaContent {
  id: string
  title: string
  content: string
  file_url?: string
  metadata?: {
    year?: string
    description?: string
    fileType?: string
    reportType?: string
    pdfUrl?: string
    wordUrl?: string
  }
}

export default function AnnualReportsSection() {
  const [yearGroups, setYearGroups] = useState<YearGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/defensoria-audiencia?section=annual_reports')
        if (response.ok) {
          const data = await response.json()
          console.log('Loaded content:', data)
          if (data && data.length > 0) {
            // Group reports by year
            const groupedByYear: { [year: string]: ReportType[] } = {}
            
            data.forEach((item: DefensoriaContent) => {
              const metadata = item.metadata || {}
              const year = metadata.year || item.title || ''
              const reportType = metadata.reportType || 'INFORME ANUAL'
              
              if (!groupedByYear[year]) {
                groupedByYear[year] = []
              }
              
              groupedByYear[year].push({
                type: reportType,
                description: metadata.description || item.content || reportType,
                pdfUrl: metadata.pdfUrl,
                wordUrl: metadata.wordUrl
              })
            })
            
            // Convert to array and sort by year descending
            const yearGroupsArray = Object.entries(groupedByYear)
              .map(([year, reports]) => ({
                year,
                reports
              }))
              .sort((a, b) => parseInt(b.year) - parseInt(a.year))
            
            setYearGroups(yearGroupsArray)
          } else {
            // Fallback data grouped by year
            setYearGroups([
              {
                year: "2024",
                reports: [
                  {
                    type: "INFORME ANUAL",
                    description: "INFORME ANUAL",
                    pdfUrl: "/files/informe-anual-2024.pdf",
                    wordUrl: "/files/informe-anual-2024.docx"
                  },
                  {
                    type: "PLAN DE TRABAJO",
                    description: "PLAN DE TRABAJO",
                    pdfUrl: "/files/plan-trabajo-2024.pdf",
                    wordUrl: "/files/plan-trabajo-2024.docx"
                  }
                ]
              },
              {
                year: "2023", 
                reports: [
                  {
                    type: "INFORME ANUAL",
                    description: "INFORME ANUAL",
                    pdfUrl: "/files/informe-anual-2023.pdf",
                    wordUrl: "/files/informe-anual-2023.docx"
                  },
                  {
                    type: "PLAN DE TRABAJO",
                    description: "PLAN DE TRABAJO",
                    pdfUrl: "/files/plan-trabajo-2023.pdf",
                    wordUrl: "/files/plan-trabajo-2023.docx"
                  }
                ]
              },
              {
                year: "2022",
                reports: [
                  {
                    type: "INFORME ANUAL",
                    description: "INFORME ANUAL",
                    pdfUrl: "/files/informe-anual-2022.pdf",
                    wordUrl: "/files/informe-anual-2022.docx"
                  },
                  {
                    type: "PLAN DE TRABAJO", 
                    description: "PLAN DE TRABAJO",
                    pdfUrl: "/files/plan-trabajo-2022.pdf",
                    wordUrl: "/files/plan-trabajo-2022.docx"
                  }
                ]
              }
            ])
          }
        }
      } catch (error) {
        console.error('Error fetching annual reports:', error)
        // Set fallback data on error
        setYearGroups([
          {
            year: "2024",
            reports: [
              {
                type: "INFORME ANUAL",
                description: "INFORME ANUAL",
                pdfUrl: "/files/informe-anual-2024.pdf",
                wordUrl: "/files/informe-anual-2024.docx"
              },
              {
                type: "PLAN DE TRABAJO",
                description: "PLAN DE TRABAJO",
                pdfUrl: "/files/plan-trabajo-2024.pdf",
                wordUrl: "/files/plan-trabajo-2024.docx"
              }
            ]
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  const handleDownload = (fileUrl: string, year: string, reportType: string, fileType: string) => {
    if (fileUrl) {
      const link = document.createElement('a')
      link.href = fileUrl
      const fileName = `${reportType.toLowerCase().replace(/\s+/g, '-')}-${year}.${fileType === 'pdf' ? 'pdf' : 'docx'}`
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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
          <h2 className="text-center font-black text-[#4f148c] tracking-tight uppercase leading-tight text-[26px] sm:text-[30px] md:text-[36px] mb-8 md:mb-10">
            INFORMES Y REPORTES
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    )
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
        <h2 className="text-center font-black text-[#4f148c] tracking-tight uppercase leading-tight text-[26px] sm:text-[30px] md:text-[36px] mb-8 md:mb-10">
          INFORMES Y REPORTES
        </h2>

        {/* 3x2 Grid Layout - One card per year */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {yearGroups.slice(0, 6).map((yearGroup, index) => (
            <div key={index} className="bg-gray-200 rounded-lg overflow-hidden shadow-md">
              {/* Gray header with year */}
              <div className="bg-gray-300 px-6 py-8 text-center">
                <h3 className="text-5xl font-black text-gray-700">
                  {yearGroup.year}
                </h3>
              </div>

              {/* Purple sections for each report type */}
              {yearGroup.reports.map((report, reportIndex) => (
                <div key={reportIndex} className="mb-2 last:mb-0">
                  <div className="bg-[#8b5cdf] px-6 py-3 text-center">
                    <p className="text-white text-sm font-bold uppercase leading-tight">
                      {report.type}
                    </p>
                  </div>
                  
                  {/* Download buttons for this report */}
                  <div className="p-3 bg-gray-200 border-b border-gray-300 last:border-b-0">
                    <div className="flex justify-center space-x-3">
                      {report.pdfUrl && (
                        <button
                          onClick={() => handleDownload(report.pdfUrl!, yearGroup.year, report.type, 'pdf')}
                          className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors duration-200"
                          title={`Descargar PDF - ${report.type}`}
                        >
                          <File className="w-4 h-4 text-white" />
                        </button>
                      )}
                      
                      {report.wordUrl && (
                        <button
                          onClick={() => handleDownload(report.wordUrl!, yearGroup.year, report.type, 'word')}
                          className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200"
                          title={`Descargar Word - ${report.type}`}
                        >
                          <FileText className="w-4 h-4 text-white" />
                        </button>
                      )}

                      {!report.pdfUrl && !report.wordUrl && (
                        <div className="flex space-x-3">
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                            <File className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-gray-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {yearGroups.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay informes disponibles
            </h3>
            <p className="text-gray-500">
              Los informes aparecerán aquí cuando estén disponibles.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
