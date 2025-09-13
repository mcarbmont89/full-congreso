"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Play, Clock, Calendar, Download } from 'lucide-react'

import Footer from '@/components/footer'

interface Episode {
  id: string
  title: string
  description: string
  audio_url: string
  audioUrl?: string
  published_date: string
  duration?: string
  season?: number
  episode_number?: number
  transcript?: string
  image_url?: string
}

interface Program {
  id: string
  name: string
  slug: string
  description: string
  image_url?: string
  category: string
}

export default function EpisodiosPage() {
  const params = useParams()
  const router = useRouter()
  const [program, setProgram] = useState<Program | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch program data
        const programResponse = await fetch(`/api/radio/programs?slug=${params.programSlug}`)
        if (!programResponse.ok) {
          throw new Error('Program not found')
        }
        const programData = await programResponse.json()
        setProgram(programData)

        // Fetch episodes for this program
        if (programData && programData.id) {
          const episodesResponse = await fetch(`/api/radio/episodes?programId=${programData.id}`)
          if (!episodesResponse.ok) {
            throw new Error('Failed to fetch episodes')
          }
          const episodesData = await episodesResponse.json()
          setEpisodes(episodesData)
        } else {
          setEpisodes([])
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (params.programSlug) {
      fetchData()
    }
  }, [params.programSlug])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDuration = (duration?: string) => {
    if (!duration) return 'Duración no disponible'

    // If duration is in seconds, convert to mm:ss format
    if (duration.includes(':')) {
      return duration
    }

    const seconds = parseInt(duration)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 py-8">
            <div className="container mx-auto px-4">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando episodios...</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
    )
  }

  if (error || !program) {
    return (
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 py-8">
            <div className="container mx-auto px-4">
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  {error || 'Programa no encontrado'}
                </h1>
                <Link 
                  href="/radio"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Radio
                </Link>
              </div>
            </div>
          </main>
          <Footer />
        </div>
    )
  }

  return (
      <div className="flex flex-col min-h-screen">

        <main className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50">
          {/* Program Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center mb-4">
                <Link 
                  href="/radio"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors mr-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Radio
                </Link>
                <span className="text-gray-400">/</span>
                <span className="ml-2 text-gray-600">{program.name}</span>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                    {program.name}
                  </h1>
                  <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                    {program.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {program.category}
                    </span>
                    <span className="text-gray-500">
                      {episodes.length} episodio{episodes.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Episodes List */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Episodios
              </h2>
              {episodes.length > 0 && (
                <p className="text-gray-600">
                  {episodes.length} episodio{episodes.length !== 1 ? 's' : ''} disponible{episodes.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {episodes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Play className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No hay episodios disponibles
                </h3>
                <p className="text-gray-600">
                  Este programa aún no tiene episodios publicados.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {episodes.map((episode) => (
                  <div key={episode.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Episode Image */}
                        <div className="flex-shrink-0">
                          <div className="w-64 h-32 md:w-80 md:h-40 relative rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={(episode.image_url && episode.image_url.trim() !== '') ? episode.image_url : (program.image_url || '/images/carousel/programas.png')}
                              alt={`Imagen del episodio: ${episode.title}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>

                        {/* Episode Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                              {episode.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500 flex-shrink-0">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(episode.published_date)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatDuration(episode.duration)}
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {episode.description}
                          </p>

                          {/* Episode Controls */}
                          <div className="flex items-center w-full">
                            {(episode.audioUrl || episode.audio_url) ? (
                              <div className="w-full">
                                <audio 
                                  controls 
                                  preload="metadata"
                                  className="w-full h-12"
                                  style={{ backgroundColor: '#f3f4f6' }}
                                >
                                  <source src={`/api/files${episode.audioUrl || episode.audio_url}`} type="audio/mpeg" />
                                  <source src={`/api/files${episode.audioUrl || episode.audio_url}`} type="audio/mp3" />
                                  Tu navegador no soporta el elemento de audio.
                                </audio>
                              </div>
                            ) : (
                              <div className="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg w-full text-center">
                                <p className="text-sm">Audio no disponible para este episodio</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
  )
}