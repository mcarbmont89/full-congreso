
"use client"

import { useState, useEffect } from 'react'

interface ConoceLeyFile {
  id: string
  title: string
  content?: string
  file_url?: string
  is_active: boolean
}

interface ConoceTuLeyButtonProps {
  className?: string
  defaultText?: string
}

export default function ConoceTuLeyButton({ 
  className = '',
  defaultText = 'Conoce la Ley'
}: ConoceTuLeyButtonProps) {
  const [conoceLeyFile, setConoceLeyFile] = useState<ConoceLeyFile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchConoceLeyFile()
  }, [])

  const fetchConoceLeyFile = async () => {
    try {
      const response = await fetch('/api/defensoria-audiencia?section=conoce_ley')
      
      if (response.ok) {
        const data = await response.json()
        const activeFile = data.find((file: ConoceLeyFile) => file.is_active)
        setConoceLeyFile(activeFile || null)
      }
    } catch (error) {
      console.error('Error fetching conoce ley file:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDownloadUrl = () => {
    if (conoceLeyFile?.file_url) {
      return conoceLeyFile.file_url
    }
    return '/files/ConoceTuLey.pdf'
  }

  const getButtonText = () => {
    if (conoceLeyFile?.title) {
      return conoceLeyFile.title
    }
    return defaultText
  }

  const handleDownload = () => {
    const url = getDownloadUrl()
    const link = document.createElement('a')
    link.href = url
    link.download = getButtonText()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const baseClasses = "inline-flex h-8 items-center px-5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-[13px] font-semibold transition shadow-md"

  return (
    <button
      onClick={handleDownload}
      className={`${baseClasses} ${className}`}
      title={conoceLeyFile?.content || 'Descargar documento informativo'}
      disabled={isLoading}
    >
      {isLoading ? 'Cargando...' : getButtonText()}
      {conoceLeyFile && (
        <span className="text-xs text-purple-200 ml-2" title="Contenido gestionado desde el CMS">
          ✓
        </span>
      )}
    </button>
  )
}
