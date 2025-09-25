
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Calendar } from 'lucide-react'

interface ReportItem {
  year: string
  description: string
  pdfUrl?: string
  wordUrl?: string
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
    pdfUrl?: string
    wordUrl?: string
  }
}

export default function AnnualReportsSection() {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/defensoria-audiencia?section=annual_reports')
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            const reportItems = data.map((item: DefensoriaContent) => {
              const metadata = item.metadata || {}
              return {
                year: metadata.year || item.title || '',
                description: metadata.description || item.content || '',
                pdfUrl: metadata.pdfUrl || (metadata.fileType === 'pdf' ? item.file_url : ''),
                wordUrl: metadata.wordUrl || (metadata.fileType === 'word' ? item.file_url : '')
              }
            }).sort((a: ReportItem, b: ReportItem) => parseInt(b.year) - parseInt(a.year))
            setReports(reportItems)
          } else {
            // Fallback data
            setReports([
              {
                year: "2024",
                description: "INFORME ANUAL PLAN DE TRABAJO",
                pdfUrl: "/files/informe-2024.pdf",
                wordUrl: "/files/informe-2024.docx"
              },
              {
                year: "2023", 
                description: "INFORME ANUAL PLAN DE TRABAJO",
                pdfUrl: "/files/informe-2023.pdf",
                wordUrl: "/files/informe-2023.docx"
              },
              {
                year: "2022",
                description: "INFORME ANUAL PLAN DE TRABAJO", 
                pdfUrl: "/files/informe-2022.pdf",
                wordUrl: "/files/informe-2022.docx"
              },
              {
                year: "2021",
                description: "INFORME ANUAL PLAN DE TRABAJO",
                pdfUrl: "/files/informe-2021.pdf",
                wordUrl: "/files/informe-2021.docx"
              }
            ])
          }
        }
      } catch (error) {
        console.error('Error fetching annual reports:', error)
        // Set fallback data on error
        setReports([
          {
            year: "2024",
            description: "INFORME ANUAL PLAN DE TRABAJO",
            pdfUrl: "/files/informe-2024.pdf",
            wordUrl: "/files/informe-2024.docx"
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  const handleDownload = (fileUrl: string, year: string, fileType: string) => {
    if (fileUrl) {
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = `informe-${year}.${fileType === 'pdf' ? 'pdf' : 'docx'}`
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
          <h2 className="text-center font-black text-[#1f1f1f] tracking-tight uppercase leading-tight text-[26px] sm:text-[30px] md:text-[36px] mb-8 md:mb-10">
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
        <h2 className="text-center font-black text-[#1f1f1f] tracking-tight uppercase leading-tight text-[26px] sm:text-[30px] md:text-[36px] mb-8 md:mb-10">
          INFORMES Y REPORTES
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {reports.map((report, index) => (
            <Card key={index} className="bg-white rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.07)] border border-[#7d4bcd] overflow-hidden hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition-all duration-300">
              <CardContent className="p-6 text-center">
                {/* Año destacado */}
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mb-3">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-purple-600 mb-2">
                    {report.year}
                  </h3>
                </div>

                {/* Descripción */}
                <p className="text-sm font-medium text-gray-700 mb-6 leading-relaxed">
                  {report.description}
                </p>

                {/* Botones de descarga */}
                <div className="space-y-3">
                  {report.pdfUrl && (
                    <Button
                      onClick={() => handleDownload(report.pdfUrl!, report.year, 'pdf')}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>PDF</span>
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {report.wordUrl && (
                    <Button
                      onClick={() => handleDownload(report.wordUrl!, report.year, 'word')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Word</span>
                      <Download className="w-4 h-4" />
                    </Button>
                  )}

                  {!report.pdfUrl && !report.wordUrl && (
                    <Button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 font-medium py-2.5 px-4 rounded-lg cursor-not-allowed"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Próximamente
                    </Button>
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
              Los informes aparecerán aquí cuando estén disponibles.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
