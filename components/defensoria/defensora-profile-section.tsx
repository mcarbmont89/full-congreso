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
    <section 
      className="py-12 md:py-14 relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/defensoria-gradient-background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-center font-black text-white tracking-tight uppercase leading-tight text-[26px] sm:text-[30px] md:text-[36px] mb-8 md:mb-10 drop-shadow-lg">
          CONOCE A TU DEFENSORA
        </h2>

        <div className="mx-auto max-w-7xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-0 min-h-[500px]">
              {/* Imagen - Left side */}
              <div className="relative bg-white flex items-center justify-center p-4">
                <div className="relative w-full h-full max-w-[400px] max-h-[500px] aspect-[3/4]">
                  <Image
                    src={defensoraImage}
                    alt={defensoraName}
                    fill
                    className="object-cover object-center rounded-lg"
                  />
                </div>
              </div>

              {/* Contenido - Right side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center text-white" style={{ backgroundColor: '#4f148c' }}>
                <h3 className="text-[22px] md:text-[26px] font-bold text-white mb-6">
                  {defensoraName}
                </h3>
                <div className="text-[15px] md:text-[16px] text-white leading-relaxed space-y-4">
                  {defensoraBio.split('\n\n').map((paragraph, index) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}