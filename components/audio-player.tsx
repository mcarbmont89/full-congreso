"use client"

import React, { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react"

interface AudioPlayerProps {
  audioSrc?: string
  title?: string
}

export default function AudioPlayer({ audioSrc, title = "Audio" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioSrc) return

    // This component is specifically for MP3 files, not HLS streams
    if (audioSrc.includes('.m3u8')) {
      setError("HLS streams not supported in this player. Use the live radio player instead.")
      return
    }

    // Ensure absolute URLs for production and route through our file API
    let resolvedAudioSrc = audioSrc
    if (audioSrc.startsWith('/uploads/')) {
      // Route through our file serving API for uploaded files
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
      resolvedAudioSrc = `${baseUrl}/api/files${audioSrc}`
    } else if (audioSrc.startsWith('/')) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
      resolvedAudioSrc = `${baseUrl}${audioSrc}`
    }

    console.log("Audio source:", resolvedAudioSrc)

    // Set the audio source
    audio.src = resolvedAudioSrc
    audio.volume = volume

    const setAudioData = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration)
      }
      setError(null)
      setIsLoading(false)
    }

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime)
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

    const handleEnded = () => {
      setIsPlaying(false)
    }

    // Add event listeners
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("timeupdate", setAudioTime)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)
    audio.addEventListener("waiting", handleWaiting)
    audio.addEventListener("playing", handlePlaying)

    return () => {
      // Cleanup
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("timeupdate", setAudioTime)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("waiting", handleWaiting)
      audio.removeEventListener("playing", handlePlaying)
    }
  }, [audioSrc, volume])

  // Handle play/pause
  const togglePlay = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        setIsLoading(true)
        const audio = audioRef.current
        
        // Mobile-specific audio handling
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          console.log("Mobile device detected - preparing audio")
          
          // Ensure audio is loaded
          if (audio.readyState === 0) {
            audio.load()
          }
          
          // Set volume for mobile
          audio.volume = volume
        }

        await audioRef.current.play()
        setIsPlaying(true)
        setError(null)
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Error toggling play:", err)
      
      // Better mobile error messages
      if ((err as any).name === "NotAllowedError") {
        setError("Toca el botón de reproducir (requerido en dispositivos móviles)")
      } else if ((err as any).name === "NotSupportedError") {
        setError("Formato de audio no compatible con este dispositivo")
      } else {
        setError("No se puede reproducir el audio en este momento")
      }
      
      setIsPlaying(false)
      setIsLoading(false)
    }
  }

  // Handle volume
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

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return

    const progressRect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - progressRect.left) / progressRect.width
    audioRef.current.currentTime = percent * duration
  }

  // Format time
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  if (!audioSrc) {
    return (
      <div className="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg w-full text-center">
        <p className="text-sm">Audio no disponible para este episodio</p>
      </div>
    )
  }

  return (
    <div className="bg-black text-white py-3 px-4 rounded-lg w-full">
      <audio 
        ref={audioRef} 
        preload="none"
        playsInline
        controls={false}
        webkit-playsinline="true"
        muted={false}
        autoPlay={false}
        style={{ display: 'none' }}
      >
        Your browser does not support the audio element.
      </audio>

      {/* Progress Bar */}
      <div className="w-full flex items-center mb-3">
        <div className="text-xs mr-2 min-w-[36px] text-center">
          {formatTime(currentTime)}
        </div>
        <div
          ref={progressRef}
          className="h-2 bg-gray-700 flex-grow relative cursor-pointer rounded-full mx-1"
          onClick={handleProgressClick}
        >
          <div
            className="absolute h-2 bg-[#e11d48] rounded-full"
            style={{
              width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
            }}
          ></div>
        </div>
        <div className="text-xs ml-2 min-w-[36px] text-center">
          {formatTime(duration)}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Left side - Volume */}
        <div className="flex items-center space-x-2 flex-1">
          <button 
            className="text-white p-2 hover:bg-gray-700 rounded transition-colors" 
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div className="text-xs text-gray-300 truncate max-w-[120px]">
            {title}
          </div>
        </div>

        {/* Center - Play Button */}
        <div className="flex items-center space-x-2">
          <button
            className="text-white bg-[#e11d48] rounded-full p-3 flex items-center justify-center hover:bg-[#be185d] active:bg-[#9f1239] transition-colors touch-manipulation"
            onClick={togglePlay}
            onTouchStart={(e) => e.stopPropagation()}
            disabled={isLoading}
            aria-label={isPlaying ? "Pause" : "Play"}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={20} fill="white" />
            ) : (
              <Play size={20} fill="white" />
            )}
          </button>
        </div>

        {/* Right side - Spacer */}
        <div className="flex-1"></div>
      </div>

      {error && (
        <div className="bg-red-500 border border-red-600 text-white px-3 py-2 rounded mt-3">
          <span className="text-sm">{error}</span>
        </div>
      )}

      {isLoading && !error && (
        <div className="text-gray-400 text-xs text-center mt-2">
          Cargando audio...
        </div>
      )}
    </div>
  )
}