"use client"

import { useState, useEffect } from 'react'
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DefensoraData {
  id: string
  title: string
  content: string
  image_url?: string
}

export default function DefensoraProfile() {
  const [defensoraData, setDefensoraData] = useState<DefensoraData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDefensoraData()
  }, [])

  const fetchDefensoraData = async () => {
    try {
      const response = await fetch('/api/defensoria-audiencia?section=defensora_info')
      
      if (response.ok) {
        const data = await response.json()
        console.log('Defensora profile data:', data)
        
        if (data && data.length > 0) {
          setDefensoraData(data[0]) // Get the first (and likely only) profile
        } else {
          // Set default content when no data is found
          setDefensoraData({
            id: 'default',
            title: 'Conoce a tu Defensora de Audiencia',
            content: `
              <p>La Defensoría de Audiencia del Canal del Congreso es un órgano independiente encargado de recibir, investigar y dar seguimiento a las quejas, sugerencias y felicitaciones de la audiencia.</p>
              
              <p>Nuestro compromiso es garantizar que los contenidos del Canal del Congreso cumplan con los más altos estándares de calidad, objetividad e imparcialidad, sirviendo siempre al interés público y al derecho a la información de la ciudadanía.</p>
              
              <h3>Funciones principales:</h3>
              <ul>
                <li>Recibir y analizar quejas sobre la programación</li>
                <li>Mediar entre la audiencia y el Canal del Congreso</li>
                <li>Promover la participación ciudadana</li>
                <li>Velar por el cumplimiento de los códigos éticos</li>
              </ul>
            `,
            image_url: '/images/defensoria-audiencia.png'
          })
        }
      } else {
        throw new Error('Failed to fetch defensora data')
      }
    } catch (error) {
      console.error('Error fetching defensora data:', error)
      setError('Error al cargar la información de la Defensora de Audiencia')
      
      // Set fallback data on error
      setDefensoraData({
        id: 'default',
        title: 'Conoce a tu Defensora de Audiencia',
        content: `
          <p>La Defensoría de Audiencia del Canal del Congreso es un órgano independiente encargado de recibir, investigar y dar seguimiento a las quejas, sugerencias y felicitaciones de la audiencia.</p>
          
          <p>Nuestro compromiso es garantizar que los contenidos del Canal del Congreso cumplan con los más altos estándares de calidad, objetividad e imparcialidad.</p>
        `,
        image_url: '/images/defensoria-audiencia.png'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error && !defensoraData) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    )
  }

  if (!defensoraData) {
    return null
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <CardTitle className="text-3xl font-bold text-center">
                {defensoraData.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Image Section */}
                <div className="flex justify-center lg:justify-start">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative w-64 h-64 lg:w-80 lg:h-80 bg-white rounded-full p-4 shadow-2xl">
                      <Image
                        src={defensoraData.image_url || '/images/defensoria-audiencia.png'}
                        alt="Defensora de Audiencia"
                        fill
                        className="object-contain p-8 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/defensoria-audiencia.png'
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="space-y-6">
                  <div 
                    className="prose prose-lg prose-purple max-w-none"
                    dangerouslySetInnerHTML={{ __html: defensoraData.content }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}