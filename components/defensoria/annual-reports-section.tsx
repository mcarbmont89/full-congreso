
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, File } from 'lucide-react'

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
            // Show empty state when no reports from CMS
            setReports([])
          }
        }
      } catch (error) {
        console.error('Error fetching annual reports:', error)
        // Show empty state on error
        setReports([])
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

        {/* 3x2 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reports.slice(0, 6).map((report, index) => (
            <div key={index} className="bg-gray-200 rounded-lg overflow-hidden shadow-md">
              {/* Gray header with year */}
              <div className="bg-gray-300 px-6 py-8 text-center">
                <h3 className="text-5xl font-black text-gray-700">
                  {report.year}
                </h3>
              </div>

              {/* Purple section with description */}
              <div className="bg-[#8b5cdf] px-6 py-4 text-center">
                <p className="text-white text-sm font-bold uppercase leading-tight">
                  {report.description}
                </p>
              </div>

              {/* Download buttons */}
              <div className="p-4 bg-gray-200">
                <div className="flex justify-center space-x-3">
                  {report.pdfUrl && (
                    <button
                      onClick={() => handleDownload(report.pdfUrl!, report.year, 'pdf')}
                      className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors duration-200"
                      title="Descargar PDF"
                    >
                      <File className="w-5 h-5 text-white" />
                    </button>
                  )}
                  
                  {report.wordUrl && (
                    <button
                      onClick={() => handleDownload(report.wordUrl!, report.year, 'word')}
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200"
                      title="Descargar Word"
                    >
                      <FileText className="w-5 h-5 text-white" />
                    </button>
                  )}

                  {!report.pdfUrl && !report.wordUrl && (
                    <div className="flex space-x-3">
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                        <File className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
