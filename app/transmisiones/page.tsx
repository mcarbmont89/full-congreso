"use client"

import Link from "next/link"
import Image from "next/image"
import { Play, ExternalLink } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

// Importa los componentes
import Footer from "@/components/footer"
import { getLiveStreams, type LiveStream } from "@/lib/api"

function TransmisionesContent() {
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([])
  const [currentStream, setCurrentStream] = useState<LiveStream | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await fetch('/api/live-streams', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        if (response.ok) {
          const allStreams = await response.json()
          console.log('Fetched streams with status:', allStreams.map((s: LiveStream) => ({ id: s.id, status: s.status, channel: s.channel })))
          // Show streams that are live, in recess, or signal open, hide offline streams
          const onlineStreams = allStreams.filter((stream: LiveStream) => 
            stream.status === 'live' || stream.status === 'recess' || stream.status === 'signal_open'
          )
          setLiveStreams(onlineStreams)

          // Check if there's a stream ID in the URL
          const streamId = searchParams.get('stream')
          if (streamId) {
            const selectedStream = onlineStreams.find((stream: LiveStream) => stream.id === streamId)
            if (selectedStream) {
              setCurrentStream(selectedStream)
            } else {
              // If stream not found, default to first live or recess stream
              const availableStream = onlineStreams.find((stream: LiveStream) => 
                stream.status === 'live' || stream.status === 'recess'
              )
              if (availableStream) {
                setCurrentStream(availableStream)
              }
            }
          } else {
            // Set the first live, recess, or signal open stream as current
            const availableStream = onlineStreams.find((stream: LiveStream) => 
              stream.status === 'live' || stream.status === 'recess' || stream.status === 'signal_open'
            )
            if (availableStream) {
              setCurrentStream(availableStream)
            }
          }
        }
      } catch (error) {
        console.error('Failed to load live streams:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStreams()
    
    // Set up automatic refresh every 30 seconds to check for status updates
    const interval = setInterval(fetchStreams, 30000)
    
    return () => clearInterval(interval)
  }, [searchParams])

  const getStreamUrl = (stream: LiveStream | null) => {
    if (stream && stream.streamUrl) {
      return stream.streamUrl
    }
    // Fallback to default stream
    return 'https://ccstreaming.packet.mx/WebRTCAppEE/play.html?id=45.1_kd5oiNTTWO0gEOFc431277834&playOrder=hls'
  }

  const switchStream = (stream: LiveStream) => {
    console.log('Switching to stream:', stream)
    setCurrentStream(stream)
    // Update URL with stream parameter
    const url = new URL(window.location.href)
    url.searchParams.set('stream', stream.id)
    router.push(url.pathname + url.search, { scroll: false })
  }
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100">
        {/* Hero Section with Player */}
        <section className="bg-purple-900 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4 text-center">EN VIVO</h1>


            {/* Main Video Player */}
            <div className="relative aspect-video max-w-6xl mx-auto bg-black rounded-lg overflow-hidden mb-6">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Cargando transmisión...</p>
                  </div>
                </div>
              ) : currentStream ? (
                <iframe
                  key={currentStream.id}
                  className="absolute inset-0 w-full h-full"
                  src={getStreamUrl(currentStream)}
                  title={currentStream.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={getStreamUrl(null)}
                  title="Canal del Congreso en vivo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}

              {/* Live/Recess/Signal indicator */}
              {currentStream && (currentStream.status === 'live' || currentStream.status === 'recess' || currentStream.status === 'signal_open') && (
                <div className={`absolute top-4 left-4 text-white px-3 py-1 rounded-full text-sm font-bold ${
                  currentStream.status === 'live' ? 'bg-red-600' : 
                  currentStream.status === 'recess' ? 'bg-orange-600' : 
                  'bg-blue-600'
                }`}>
                  {currentStream.status === 'live' ? '● EN VIVO' : 
                   currentStream.status === 'recess' ? '● EN RECESO' : 
                   '● SEÑAL ABIERTA'}
                </div>
              )}

              
            </div>

            {/* Stream title below player */}
            <div className="text-center mt-4 mb-6">
              <h2 className="text-white mb-2">
                {currentStream?.title || "Canal del Congreso"}
              </h2>
              <div className="flex items-center justify-center">
                <Image
                  src={currentStream ? (() => {
                    switch (currentStream.channel) {
                      case 'C+':
                        return '/images/channel-c-logo.png'
                      case 'D+':
                        return '/images/channel-d-logo.png'
                      case 'S+':
                        return '/images/channel-g-logo.png'
                      case 'ST+':
                        return '/images/channel-st-logo.png'
                      default:
                        return '/images/logo-canal-congreso.png'
                    }
                  })() : '/images/logo-canal-congreso.png'}
                  alt="Channel Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Quick channel access - Dynamic from live streams */}
            <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
              {liveStreams.filter(stream => (stream.status === 'live' || stream.status === 'signal_open' || stream.status === 'recess')).sort((a, b) => {
                // Sort by channel to ensure consistent order: C+ (45.1), S+ (45.2), D+ (45.3), ST+ (45.4)
                const order = { 'C+': 1, 'S+': 2, 'D+': 3, 'ST+': 4 };
                return (order[a.channel as keyof typeof order] || 999) - (order[b.channel as keyof typeof order] || 999);
              }).map((stream) => {
                const getChannelColor = (channel: string) => {
                  switch (channel) {
                    case 'C+':
                      return 'bg-gray-500 hover:bg-gray-600'
                    case 'S+':
                      return 'bg-red-600 hover:bg-red-700'
                    case 'D+':
                      return 'bg-green-600 hover:bg-green-700'
                    case 'ST+':
                      return 'bg-blue-600 hover:bg-blue-700'
                    default:
                      return 'bg-gray-500 hover:bg-gray-600'
                  }
                }

                const getChannelNumber = (channel: string) => {
                  switch (channel) {
                    case 'C+':
                      return '45.1'
                    case 'S+':
                      return '45.2'
                    case 'D+':
                      return '45.3'
                    case 'ST+':
                      return 'Streaming'
                    default:
                      return channel || 'Canal'
                  }
                }

                const getChannelLogo = (channel: string) => {
                  switch (channel) {
                    case 'C+':
                      return '/images/channel-c-logo.png'
                    case 'D+':
                      return '/images/channel-d-logo.png'
                    case 'S+':
                      return '/images/channel-g-logo.png'
                    case 'ST+':
                      return '/images/channel-st-logo.png'
                    default:
                      return '/images/logo-canal-congreso.png'
                  }
                }

                return (
                  <button
                    key={stream.id}
                    onClick={() => switchStream(stream)}
                    className={`${getChannelColor(stream.channel || '')} text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${
                      currentStream?.id === stream.id ? 'ring-2 ring-white' : ''
                    }`}
                  >
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    <Image
                      src={getChannelLogo(stream.channel || '')}
                      alt={`${stream.channel} logo`}
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                    {stream.channel === 'ST+' ? 'Streaming' : `Canal ${getChannelNumber(stream.channel || '')}`}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Transmisiones Actuales */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center uppercase">Transmisiones Actuales</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveStreams.map((stream) => {
                // Function to get channel logo
                const getChannelLogo = (channel: string) => {
                  switch (channel) {
                    case 'C+':
                      return '/images/channel-c-logo.png'
                    case 'D+':
                      return '/images/channel-d-logo.png'
                    case 'S+':
                      return '/images/channel-g-logo.png'
                    case 'ST+':
                      return '/images/channel-st-logo.png'
                    default:
                      return '/images/logo-canal-congreso.png'
                  }
                }

                return (
                  <div key={stream.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image
                        src={stream.thumbnailUrl || '/placeholder.svg?height=192&width=384&text=Stream'}
                        alt={stream.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                      {(stream.status === 'live' || stream.status === 'recess' || stream.status === 'signal_open') && (
                        <div className={`absolute top-2 left-2 text-white px-2 py-1 rounded text-xs font-bold ${
                          stream.status === 'live' ? 'bg-red-600' : 
                          stream.status === 'recess' ? 'bg-orange-600' : 
                          'bg-blue-600'
                        }`}>
                          {stream.status === 'live' ? '● EN VIVO' : 
                           stream.status === 'recess' ? '● EN RECESO' : 
                           '● SEÑAL ABIERTA'}
                        </div>
                      )}
                      </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Image
                          src={getChannelLogo(stream.channel || '')}
                          alt="Channel Logo"
                          width={20}
                          height={20}
                          className="object-contain flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${
                              stream.channel === 'C+' ? 'bg-gray-500' :
                              stream.channel === 'S+' ? 'bg-red-600' :
                              stream.channel === 'D+' ? 'bg-green-600' :
                              stream.channel === 'ST+' ? 'bg-blue-600' :
                              'bg-gray-600'
                            }`}>
                              {stream.channel === 'C+' ? '45.1' :
                               stream.channel === 'S+' ? '45.2' :
                               stream.channel === 'D+' ? '45.3' :
                               stream.channel === 'ST+' ? 'Streaming' :
                               stream.channel || 'Canal'}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm">{stream.title}</h3>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-medium ${
                          stream.status === 'live' ? 'text-red-500' :
                          stream.status === 'recess' ? 'text-orange-500' :
                          stream.status === 'signal_open' ? 'text-blue-500' :
                          'text-gray-500'
                        }`}>
                          {stream.status === 'live' ? 'En vivo' :
                           stream.status === 'recess' ? 'En receso' :
                           stream.status === 'signal_open' ? 'Señal abierta' :
                           'Offline'}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => switchStream(stream)}
                            className="text-purple-900 text-sm font-medium hover:underline flex items-center transition-colors"
                          >
                            Ver ahora <ExternalLink className="h-3 w-3 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {liveStreams.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No hay transmisiones disponibles en este momento</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function TransmisionesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransmisionesContent />
    </Suspense>
  )
}