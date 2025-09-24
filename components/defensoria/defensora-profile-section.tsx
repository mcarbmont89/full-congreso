
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

export default function DefensoraProfileSection() {
  const [profileData, setProfileData] = useState<DefensoriaContent | null>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('/api/defensoria-audiencia?section=defensora_profile')
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            setProfileData(data[0])
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
      }
    }

    fetchProfileData()
  }, [])

  const defensoraName = profileData?.title || "Mtra. Sandra Luz Hernández Bernal"
  const defensoraBio = profileData?.content || `La Mtra. Sandra Luz Hernández Bernal es la actual Defensora de Audiencia del Canal del Congreso, 
    cargo que desempeña con dedicación y compromiso desde su nombramiento. Con una sólida formación académica y 
    amplia experiencia en el ámbito de la comunicación y los medios públicos, la Mtra. Hernández se ha destacado 
    por su labor en la protección y promoción de los derechos de las audiencias.`
  const defensoraImage = profileData?.image_url || "/images/defensora-photo.jpg"

  return (
    <section className="py-12 md:py-14 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-center font-black text-white tracking-tight uppercase leading-tight text-[26px] sm:text-[30px] md:text-[36px] mb-8 md:mb-10 drop-shadow-lg">
          CONOCE A TU DEFENSORA
        </h2>

        <div className="mx-auto max-w-5xl">
          <div className="bg-transparent rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.07)] border border-white/20 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Imagen */}
              <div className="relative h-[300px] lg:h-[400px]">
                <Image
                  src={defensoraImage}
                  alt={defensoraName}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Contenido */}
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <h3 className="text-[20px] md:text-[24px] font-black text-[#7746d6] mb-4">
                  {defensoraName}
                </h3>
                <p className="text-[15px] md:text-[16px] text-[#4a5568] leading-relaxed">
                  {defensoraBio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
