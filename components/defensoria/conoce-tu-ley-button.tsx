"use client"

import { useState, useEffect } from 'react'
import Link from "next/link"

interface SiteFile {
  id: string
  title: string
  content?: string
  file_url?: string
  is_active: boolean
}

interface ConoceTuLeyButtonProps {
  variant?: 'primary' | 'secondary'
  className?: string
  defaultText?: string
  showIcon?: boolean
}

export default function ConoceTuLeyButton({ 
  variant = 'primary', 
  className = '',
  defaultText = 'Conoce la Ley',
  showIcon = false
}: ConoceTuLeyButtonProps) {
  const [siteFile, setSiteFile] = useState<SiteFile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSiteFile()
  }, [])

  const fetchSiteFile = async () => {
    try {
      const response = await fetch('/api/defensoria-audiencia?section=site_files')
      
      if (response.ok) {
        const data = await response.json()
        
        // Find the first active file for "Conoce tu Ley"
        const activeFile = data.find((file: SiteFile) => file.is_active)
        setSiteFile(activeFile || null)
      }
    } catch (error) {
      console.error('Error fetching site file:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Determine the download URL: CMS first, then fallback to hardcoded
  const getDownloadUrl = () => {
    if (siteFile?.file_url) {
      return siteFile.file_url
    }
    // Fallback to hardcoded file
    return '/downloads/conoce-tu-ley.pdf'
  }

  // Determine the button text: CMS first, then fallback
  const getButtonText = () => {
    if (siteFile?.title) {
      return variant === 'secondary' && showIcon ? 'Descargar PDF' : siteFile.title
    }
    // Fallback to default text
    return defaultText
  }

  const baseClasses = variant === 'primary' 
    ? "inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 text-lg"
    : "inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"

  return (
    <Link
      href={getDownloadUrl()}
      download
      className={`${baseClasses} ${className}`}
      title={siteFile?.content || 'Descargar archivo informativo'}
    >
      {showIcon && (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
      {getButtonText()}
      {siteFile && (
        <span className="text-xs text-purple-200 ml-2" title="Contenido gestionado desde el CMS">
          ✓ CMS
        </span>
      )}
    </Link>
  )
}