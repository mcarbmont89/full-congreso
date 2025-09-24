
"use client"

import { useState, useEffect } from 'react'
import Image from "next/image"

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

interface ReportItem {
  year: string
  description: string
  fileUrl: string
}

export default function AnnualReportsSection() {
  const [reports, setReports] = useState<ReportItem[]>([])

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
                fileUrl: item.file_url || ''
              }
            }).sort((a: ReportItem, b: ReportItem) => parseInt(b.year) - parseInt(a.year))
            setReports(reportItems)
          } else {
            // Fallback data
            setReports([
              {
                year: "2024",
                description: "INFORME ANUAL PLAN DE TRABAJO",
                fileUrl: "/files/informe-2024.pdf"
              },
              {
                year: "2023", 
                description: "INFORME ANUAL PLAN DE TRABAJO",
                fileUrl: "/files/informe-2023.pdf"
              },
              {
                year: "2022",
                description: "INFORME ANUAL PLAN DE TRABAJO", 
                fileUrl: "/files/informe-2022.pdf"
              },
              {
                year: "2021",
                description: "INFORME ANUAL PLAN DE TRABAJO",
                fileUrl: "/files/informe-2021.pdf"
              },
              {
                year: "2020",
                description: "INFORME ANUAL PLAN DE TRABAJO",
                fileUrl: "/files/informe-2020.pdf"
              },
              {
                year: "2019",
                description: "INFORME ANUAL PLAN DE TRABAJO",
                fileUrl: "/files/informe-2019.pdf"
              }
            ])
          }
        }
      } catch (error) {
        console.error('Error fetching reports:', error)
        // Set fallback data on error
        setReports([
          {
            year: "2024",
            description: "INFORME ANUAL PLAN DE TRABAJO",
            fileUrl: "/files/informe-2024.pdf"
          }
        ])
      }
    }

    fetchReports()
  }, [])

  const handleDownload = (fileUrl: string, year: string) => {
    if (fileUrl) {
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = `informe-${year}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
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

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.07)] border border-[#7d4bcd]/20 p-6 text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer"
                onClick={() => handleDownload(report.fileUrl, report.year)}
              >
                {/* Year */}
                <div className="mb-4">
                  <h3 className="text-[36px] md:text-[42px] font-black text-[#7746d6] leading-none">
                    {report.year}
                  </h3>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-[12px] md:text-[13px] font-bold text-white bg-[#7746d6] rounded-full px-4 py-2">
                    {report.description}
                  </p>
                </div>

                {/* Icons */}
                <div className="flex justify-center items-center gap-3">
                  {/* PDF Icon */}
                  <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  {/* Download Icon */}
                  <div className="w-8 h-8 bg-[#7746d6] rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
