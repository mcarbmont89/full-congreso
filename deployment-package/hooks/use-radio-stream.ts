
'use client'

import { useState, useEffect } from 'react'

interface RadioStreamInfo {
  isLive: boolean
  currentProgram?: string
  listeners?: number
  quality?: 'low' | 'medium' | 'high'
}

export function useRadioStream(streamUrl: string) {
  const [streamInfo, setStreamInfo] = useState<RadioStreamInfo>({
    isLive: false
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate checking stream status
    const checkStreamStatus = async () => {
      try {
        // In a real implementation, you'd check the stream status
        // For now, we'll simulate a live stream
        setStreamInfo({
          isLive: true,
          currentProgram: "Transmisión en vivo",
          listeners: Math.floor(Math.random() * 1000) + 100,
          quality: 'high'
        })
        setError(null)
      } catch (err) {
        console.error('Error checking stream status:', err)
        setError('Unable to connect to stream')
        setStreamInfo({ isLive: false })
      }
    }

    checkStreamStatus()
    const interval = setInterval(checkStreamStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [streamUrl])

  return { streamInfo, error }
}
