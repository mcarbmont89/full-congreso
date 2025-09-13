"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

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

export default function ChannelBar() {
  const [channels, setChannels] = useState<ChannelConfig[]>([])

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

    fetchChannels()
  }, [])

  return (
    <div className="bg-[#2e1a47] py-3">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-4">
        {/* Noticias Congreso Logo */}
        <div className="flex items-center">
          <span>
            <img src="/images/noticias-congreso-logo.png" className="h-10" alt="Noticias Congreso" />
          </span>
        </div>

        {/* Channel Buttons - Dynamic from CMS */}
        <div className="flex items-center space-x-3">
          {channels.map((channel) => (
            <a 
              key={channel.id}
              href={channel.transmisionesLink} 
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <span>
                <Image 
                  src={channel.logo || '/images/placeholder-logo.png'} 
                  alt={`Logo ${channel.name}`}
                  width={32}
                  height={32}
                  className="h-8 w-8" 
                />
              </span>
              <div 
                className="text-white rounded px-2 py-1 text-xs font-medium ml-1 hidden md:inline"
                style={{ backgroundColor: channel.backgroundColor, color: channel.textColor }}
              >
                CANAL <span className="font-bold">{channel.number}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
