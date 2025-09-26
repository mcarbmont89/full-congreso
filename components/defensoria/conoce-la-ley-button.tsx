"use client"

import { useState, useEffect } from 'react'

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

export default function ConoceLaLeyButton() {
  const [buttonData, setButtonData] = useState<DefensoriaContent | null>(null)

  useEffect(() => {
    const fetchButtonData = async () => {
      try {
        const response = await fetch('/api/defensoria-audiencia?section=conoce_ley')
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            setButtonData(data[0])
          }
        }
      } catch (error) {
        console.error('Error fetching button data:', error)
      }
    }

    fetchButtonData()
  }, [])

  const handleDownload = () => {
    if (buttonData?.file_url) {
      const link = document.createElement('a')
      link.href = buttonData.file_url
      link.download = buttonData.title || 'ConoceTuLey.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // Fallback to default file
      const link = document.createElement('a')
      link.href = '/files/ConoceTuLey.pdf'
      link.download = 'ConoceTuLey.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <button
      onClick={handleDownload}
      className="inline-flex h-16 items-center px-10 rounded-full 
                 bg-[#7746d6] hover:bg-[#6a38cf] 
                 text-white text-[26px] font-bold transition shadow-lg"
    >
      Conoce la Ley
    </button>
  )
}
