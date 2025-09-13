"use client"

// Extend window object for HLS.js
declare global {
  interface Window {
    Hls: any
  }
}

import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { X, Play, Pause, Volume2, VolumeX, Loader2, Radio } from 'lucide-react'

interface FloatingPlayerContextType {
  showPlayer: (audioSrc: string, title?: string) => void
  hidePlayer: () => void
  isVisible: boolean
  isPlaying: boolean
  title: string
  togglePlay: () => void
}

const FloatingPlayerContext = createContext<FloatingPlayerContextType | undefined>(undefined)

export function useFloatingPlayer() {
  const context = useContext(FloatingPlayerContext)
  if (!context) {
    throw new Error('useFloatingPlayer must be used within a FloatingPlayerProvider')
  }
  return context
}

export function FloatingPlayerProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('Radio en vivo')
  const [audioSrc, setAudioSrc] = useState('')
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [streamInfo, setStreamInfo] = useState({ isLive: false, listeners: 0, currentProgram: "" })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hlsRef = useRef<any>(null)
  const pathname = usePathname()

  // Fetch live radio configuration
  useEffect(() => {
    if (!isVisible || !audioSrc) return

    const fetchLiveConfig = async () => {
      try {
        const response = await fetch('/api/radio/live-config')
        if (response.ok) {
          const config = await response.json()
          setStreamInfo(prev => ({
            ...prev,
            isLive: config.isLive,
            listeners: config.listeners,
            currentProgram: config.currentProgram
          }))
        }
      } catch (error) {
        console.error('Error fetching live config:', error)
      }
    }

    fetchLiveConfig()
    const interval = setInterval(fetchLiveConfig, 30000)
    return () => clearInterval(interval)
  }, [isVisible, audioSrc])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioSrc) return

    const isHLS = audioSrc.includes(".m3u8")

    const setupHLS = async () => {
      if (isHLS) {
        try {
          // Check if browser supports HLS natively first (common on Safari/iOS)
          if (audio.canPlayType("application/vnd.apple.mpegurl")) {
            console.log("Using native HLS support (likely Safari/iOS)")
            audio.src = audioSrc
            audio.preload = "metadata" // Better for mobile
            return
          }

          // Try to load HLS.js with multiple fallback strategies
          let Hls: any = null

          // Strategy 1: Try dynamic import
          try {
            const hlsModule = await import("hls.js")
            Hls = hlsModule.default
            console.log("Loaded HLS.js via dynamic import")
          } catch (importError) {
            console.warn("Dynamic import failed:", importError)

            // Strategy 2: Try loading from CDN as fallback
            try {
              if (!window.Hls) {
                await new Promise((resolve, reject) => {
                  const script = document.createElement('script')
                  script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.6.5/dist/hls.min.js'
                  script.onload = resolve
                  script.onerror = reject
                  document.head.appendChild(script)
                })
              }
              Hls = window.Hls
              console.log("Loaded HLS.js from CDN")
            } catch (cdnError) {
              console.error("CDN fallback failed:", cdnError)
              throw new Error("Could not load HLS.js library")
            }
          }

          if (Hls && Hls.isSupported()) {
            console.log("Setting up HLS.js player for mobile")
            const hls = new Hls({
              enableWorker: false, // Disable worker for better mobile compatibility
              lowLatencyMode: false, // Disable for mobile stability
              backBufferLength: 30, // Smaller buffer for mobile
              maxBufferLength: 15, // Smaller buffer for mobile
              maxMaxBufferLength: 30, // Smaller buffer for mobile
              startLevel: -1, // Auto-select quality
              capLevelToPlayerSize: true, // Optimize for mobile
              debug: false,
            })

            hlsRef.current = hls
            hls.loadSource(audioSrc)
            hls.attachMedia(audio)

              hls.on(Hls.Events.MANIFEST_PARSED, () => {
              console.log("HLS manifest parsed successfully")
              setError(null)
            })

            hls.on(Hls.Events.ERROR, (event: any, data: any) => {
              console.error("HLS error:", data)
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    setError("Network error - check your connection")
                    break
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    setError("Media error - stream format issue")
                    break
                  default:
                    setError(`Stream error: ${data.type}`)
                    break
                }
                setIsPlaying(false)
                setIsLoading(false)
              }
            })
          } else {
            // Final fallback: try to play directly
            console.warn("HLS.js not supported, trying direct playback")
            audio.src = audioSrc
          }
        } catch (err) {
          console.error("Error setting up HLS:", err)
          setError("Failed to load streaming library. Trying direct playback...")
          // Last resort: try direct playback
          audio.src = audioSrc
        }
      } else {
        audio.src = audioSrc
      }
    }

    const handleLoadStart = () => {
      setIsLoading(true)
      setError(null)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
      setError(null)
    }

    const handleError = (e: Event) => {
      console.error("Audio error:", e)
      const audioElement = e.target as HTMLAudioElement
      let errorMessage = "Error loading audio"

      if (audioElement.error) {
        switch (audioElement.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "Audio loading was aborted"
            break
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "Network error occurred"
            break
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "Audio decoding error"
            break
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Audio format not supported"
            break
        }
      }

      setError(errorMessage)
      setIsPlaying(false)
      setIsLoading(false)
    }

    const handleWaiting = () => {
      setIsLoading(true)
    }

    const handlePlaying = () => {
      setIsLoading(false)
    }

    setupHLS()

    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("ended", () => setIsPlaying(false))
    audio.addEventListener("error", handleError)
    audio.addEventListener("waiting", handleWaiting)
    audio.addEventListener("playing", handlePlaying)

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("ended", () => setIsPlaying(false))
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("waiting", handleWaiting)
      audio.removeEventListener("playing", handlePlaying)

      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [audioSrc])

  const showPlayer = (src: string, playerTitle?: string) => {
    setAudioSrc(src)
    setTitle(playerTitle || 'Radio en vivo')
    setIsVisible(true)
    setError(null)
  }

  const hidePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setIsVisible(false)
    setIsPlaying(false)
    setAudioSrc('')
    setError(null)

    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }
  }

  const togglePlay = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        setIsLoading(true)
        setError(null)
        
        const audio = audioRef.current
        
        // For mobile devices, ensure we have fresh audio context
        if (audioSrc && audio.readyState === 0) {
          console.log("Loading audio for mobile playback")
          audio.load()
        }

        // Add mobile-specific handling
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          console.log("Mobile device detected, ensuring audio can play")
          
          // Set volume explicitly for mobile
          audio.volume = isMuted ? 0 : volume
          
          // Try to trigger audio context on mobile
          if (audio.paused) {
            const playPromise = audio.play()
            if (playPromise) {
              await playPromise
              setIsPlaying(true)
              setIsLoading(false)
            }
          }
        } else {
          // Desktop handling
          const playPromise = audio.play()
          if (playPromise !== undefined) {
            await playPromise
            setIsPlaying(true)
            setIsLoading(false)
          } else {
            setIsPlaying(true)
            setIsLoading(false)
          }
        }
      }
    } catch (err: any) {
      console.error("Error toggling play:", err)
      
      // Enhanced error handling for mobile
      if (err?.name === "NotAllowedError") {
        setError("Toca el botón para reproducir (requerido en móviles)")
      } else if (err?.name === "NotSupportedError") {
        setError("Formato de audio no soportado en este dispositivo")
      } else if (err?.name === "AbortError") {
        setError("Reproducción interrumpida - intenta de nuevo")
      } else {
        setError(`Error de reproducción: ${err?.message || 'Desconocido'}`)
      }
      
      setIsPlaying(false)
      setIsLoading(false)
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return

    if (isMuted) {
      audioRef.current.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  // Check if current page should show floating player
  const shouldShowFloatingPlayer = !pathname.startsWith('/transmisiones') && !pathname.includes('/episodios')

  // Pause player when navigating to episode pages
  useEffect(() => {
    if (pathname.includes('/episodios') && isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [pathname, isPlaying])

  // Check if user is on mobile device
  const isMobileDevice = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  return (
    <FloatingPlayerContext.Provider
      value={{
        showPlayer,
        hidePlayer,
        isVisible,
        isPlaying,
        title,
        togglePlay,
      }}
    >
      {children}

      {/* Player - Only show on allowed pages */}
      {isVisible && shouldShowFloatingPlayer && (
        <>
          {isMobileDevice ? (
            /* Simple HTML Audio Player for Mobile */
            <div className="fixed bottom-4 left-4 right-4 bg-black text-white rounded-lg shadow-2xl z-50 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Radio size={16} className="text-red-500" />
                  <span className="text-sm font-medium truncate">{title}</span>
                </div>
                <button
                  onClick={hidePlayer}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close player"
                >
                  <X size={16} />
                </button>
              </div>
              
              {/* Simple HTML5 Audio Controls for Mobile */}
              <audio 
                ref={audioRef}
                src={audioSrc}
                controls
                playsInline
                crossOrigin="anonymous"
                webkit-playsinline="true"
                preload="none"
                className="w-full h-8"
                style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '4px'
                }}
              />
              
              {streamInfo.isLive && (
                <div className="flex items-center justify-center mt-2 text-xs">
                  <div className="flex items-center space-x-1 text-green-400">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span>EN VIVO</span>
                  </div>
                  {streamInfo.listeners > 0 && (
                    <span className="text-gray-300 ml-2">({streamInfo.listeners} oyentes)</span>
                  )}
                </div>
              )}

              {error && (
                <div className="text-red-400 text-xs text-center mt-2">
                  {error}
                </div>
              )}
            </div>
          ) : (
            /* Advanced Floating Player for Desktop */
            <div className="fixed bottom-4 right-4 bg-black text-white rounded-lg shadow-2xl z-50 w-80 max-w-sm">
              <audio 
                ref={audioRef} 
                preload="none"
                crossOrigin="anonymous"
                playsInline
                controls={false}
                muted={false}
                autoPlay={false}
                webkit-playsinline="true"
              />

              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Radio size={16} className="text-red-500" />
                    <span className="text-sm font-medium truncate">{title}</span>
                  </div>
                  <button
                    onClick={hidePlayer}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Close player"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Stream Info */}
                {streamInfo.isLive && (
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>LIVE</span>
                      </div>
                      {streamInfo.listeners > 0 && (
                        <span className="text-gray-300">({streamInfo.listeners} oyentes)</span>
                      )}
                    </div>
                    {streamInfo.currentProgram && (
                      <div className="text-gray-300 truncate max-w-32">
                        {streamInfo.currentProgram}
                      </div>
                    )}
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-300 transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>

                  <button
                    onClick={togglePlay}
                    className="text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-full p-3 flex items-center justify-center transition-colors"
                    disabled={isLoading}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : isPlaying ? (
                      <Pause size={20} />
                    ) : (
                      <Play size={20} fill="white" />
                    )}
                  </button>

                  <div className="text-xs text-gray-400">
                    {streamInfo.isLive ? "EN VIVO" : "RADIO"}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-red-400 text-xs text-center mt-2 px-2">
                    {error}
                    {error.includes("interacción") && (
                      <div className="text-gray-400 text-xs mt-1">
                        Los navegadores móviles requieren interacción del usuario
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </FloatingPlayerContext.Provider>
  )
}