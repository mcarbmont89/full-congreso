
"use client"

import { useState, useEffect } from 'react'
import Image from "next/image"

interface DefensoraProfile {
  id: string
  title: string
  content: string
  image_url?: string
}

export default function DefensoraProfileSection() {
  const [profile, setProfile] = useState<DefensoraProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/defensoria-audiencia?section=defensora_profile')
      
      if (response.ok) {
        const data = await response.json()
        if (data && data.length > 0) {
          setProfile(data[0]) // Get the first active profile
        }
      }
    } catch (error) {
      console.error('Error fetching defensora profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="relative py-12 md:py-16 text-white" style={{ backgroundImage: "url('/images/defensora-background.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </section>
    )
  }

  // Default content if no CMS data
  const defaultProfile = {
    title: "Mtra. María Gabriela Ortiz Portilla",
    content: `Es Licenciada en Relaciones Internacionales por la Universidad Iberoamericana donde realizó un Diplomado en Derecho Internacional en la Université Jean Moulin Lyon en Francia, además, cuenta con una maestría en Derecho por la Universidad Anáhuac y un Máster en Comunicación Política y Gobernanza por The George Washington University, donde realizó un trabajo de investigación sobre perspectiva de género y su utilidad en las instituciones de gobierno.

El 26 de abril de 2022 fue designada como Defensora de la Audiencia del Canal del Congreso por el H. Comité de Información del Canal de Televisión del Congreso General de los Estados Unidos Mexicanos.

Desde la Defensoría de Audiencia del Canal del Congreso ha trabajado por la igualdad de género, en octubre 2023, organizó y moderó un foro virtual de mujeres especialistas en violencia de género y violencia mediática. Durante este enriquecedor proyecto, trabajó directamente con lideresas de espacios sociales de gran relevancia social y de actualidad de igualdad de género se sean reflejados en la programación del Canal del Congreso.`,
    image_url: "/images/defensora-photo.jpg"
  }

  const displayProfile = profile || defaultProfile

  return (
    <section className="relative py-12 md:py-16 text-white" style={{ backgroundImage: "url('/images/defensora-background.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase mb-8 md:mb-12">
          CONOCE A TU DEFENSORA<br />DE AUDIENCIA
        </h2>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:basis-1/4 md:shrink-0">
            <div className="relative h-[300px] md:h-[420px] rounded-lg overflow-hidden shadow-xl bg-purple-300 flex items-center justify-center">
              <div className="text-center text-purple-800 font-bold">
                <div className="text-6xl mb-2">👤</div>
                <div>Defensora Photo</div>
              </div>
              <Image
                src={displayProfile.image_url || "/images/defensora-photo.jpg"}
                alt="Defensora de Audiencia"
                fill
                className="object-cover z-10"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/defensora-photo.jpg'
                }}
              />
            </div>
          </div>

          <div className="md:basis-3/4 md:min-w-0 space-y-4">
            <h3 className="text-xl md:text-2xl font-extrabold text-white mb-4">
              {displayProfile.title}
            </h3>
            <div className="space-y-4 text-sm md:text-[15px] leading-6 text-white/95">
              {displayProfile.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
