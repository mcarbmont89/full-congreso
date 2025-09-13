"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import type { LiveStream } from "@/lib/api"

interface ChannelConfig {
  id: string
  name: string
  number: string
  logo: string
  backgroundColor: string
  textColor: string
  transmisionesLink: string
  isActive: boolean
  order: number
}

function ChannelIndicators() {
  const [channels, setChannels] = useState<ChannelConfig[]>([])
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([])

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch('/api/channels')
        if (response.ok) {
          const channelData = await response.json()
          setChannels(channelData.filter((ch: ChannelConfig) => ch.isActive).sort((a: ChannelConfig, b: ChannelConfig) => a.order - b.order))
        }
      } catch (error) {
        console.error('Error fetching channels:', error)
      }
    }

    const fetchLiveStreams = async () => {
      try {
        const response = await fetch('/api/live-streams/all')
        if (response.ok) {
          const streamsData = await response.json()
          setLiveStreams(streamsData)
        }
      } catch (error) {
        console.error('Error fetching live streams:', error)
      }
    }

    fetchChannels()
    fetchLiveStreams()
  }, [])

  const getStreamLinkForChannel = (channelNumber: string) => {
    // Find matching stream by channel
    const matchingStream = liveStreams.find(stream => {
      const streamChannelNumber = stream.channel === 'C+' ? '45.1' :
                                  stream.channel === 'S+' ? '45.2' :
                                  stream.channel === 'D+' ? '45.3' :
                                  stream.channel === 'ST+' ? '45.4' : ''
      return streamChannelNumber === channelNumber
    })
    
    return matchingStream ? `/transmisiones?stream=${matchingStream.id}` : '/transmisiones'
  }

  return (
    <div className="flex justify-end space-x-2 sm:space-x-4 md:space-x-8 mb-4 sm:mb-6 md:mb-8">
      {channels.map((channel) => (
        <a key={channel.id} href={getStreamLinkForChannel(channel.number)} className="flex items-center hover:opacity-80 transition-opacity">
          <div 
            className="text-white rounded-full px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 flex items-center text-sm sm:text-lg md:text-xl"
            style={{ backgroundColor: channel.backgroundColor, color: channel.textColor }}
          >
            <span className="mr-1 sm:mr-1.5 md:mr-2">CANAL</span>
            <span className="font-bold">{channel.number}</span>
          </div>
        </a>
      ))}
    </div>
  )
}

interface AutoScrollCarouselProps {
  items: LiveStream[]
}

export default function AutoScrollCarouselLarge({ items }: AutoScrollCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Auto scroll functionality
  useEffect(() => {
    const liveStreams = items.filter(stream => stream.isLive === true)
    if (liveStreams.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev === liveStreams.length - 1 ? 0 : prev + 1))
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [items])

  // Function to handle manual scrolling
  const scroll = (direction: "left" | "right") => {
    const liveStreams = items.filter(stream => stream.isLive === true)
    if (direction === "left") {
      setActiveIndex((prev) => (prev === 0 ? liveStreams.length - 1 : prev - 1))
    } else {
      setActiveIndex((prev) => (prev === liveStreams.length - 1 ? 0 : prev + 1))
    }
  }

  // Filter only live streams
  const liveStreams = items.filter(stream => stream.isLive === true)

  // If no live streams, show a message
  if (liveStreams.length === 0) {
    return <div className="text-center py-8 text-white text-2xl">No hay transmisiones en vivo en este momento.</div>
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4">
      {/* Channel indicators - RESPONSIVE SIZE */}
      <ChannelIndicators />

      {/* EN VIVO AHORA title - DOUBLED SIZE */}
      <h2 className="text-6xl font-bold mb-12 text-center flex items-center justify-center text-white">
        <span className="bg-red-600 w-6 h-6 rounded-full mr-4 animate-pulse"></span>
        EN VIVO AHORA
      </h2>

      {/* Video thumbnails - DOUBLED SIZE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
        {liveStreams.slice(0, 4).map((stream, index) => (
          <div key={stream.id} className="relative group cursor-pointer">
            <div className="relative h-96 w-full rounded-xl overflow-hidden">
              <Image
                src={stream.thumbnailUrl || "/placeholder.svg?height=384&width=512"}
                alt={stream.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white bg-opacity-20 rounded-full p-6 group-hover:bg-opacity-40 transition-all">
                  <Play className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg text-white">{stream.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows - DOUBLED SIZE */}
      <div className="flex justify-center mt-8 space-x-8">
        <button onClick={() => scroll("left")} className="focus:outline-none" aria-label="Anterior">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="white" />
            <path d="M15 6L9 12L15 18" stroke="#3b0764" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button onClick={() => scroll("right")} className="focus:outline-none" aria-label="Siguiente">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="white" />
            <path d="M9 18L15 12L9 6" stroke="#3b0764" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}