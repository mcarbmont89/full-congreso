"use client";

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useFloatingPlayer } from "@/components/floating-player-context";
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
    <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3 md:gap-4">
      {channels.map((channel) => (
        <a 
          key={channel.id} 
          href={getStreamLinkForChannel(channel.number)} 
          className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex-shrink-0">
            <img 
              src={channel.logo || '/images/placeholder-logo.png'} 
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain" 
              alt={`${channel.name} logo`}
            />
          </div>
          <div 
            className="text-white rounded-full px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 flex items-center text-xs sm:text-sm md:text-base whitespace-nowrap"
            style={{ backgroundColor: channel.backgroundColor, color: channel.textColor }}
          >
            <span className="mr-1 sm:mr-1.5">CANAL</span>
            <span className="font-bold">{channel.number}</span>
          </div>
        </a>
      ))}
    </div>
  )
}


import { useRef } from "react";
import Link from "next/link";
import type { LiveStream } from "@/lib/api";
import { useMobile } from "@/hooks/use-mobile";

interface AutoScrollCarouselProps {
  items: LiveStream[];
  showLiveIndicator?: boolean;
  liveIndicatorText?: string;
}

export default function AutoScrollCarousel({ items, showLiveIndicator = false, liveIndicatorText = "EN VIVO AHORA" }: AutoScrollCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentItems, setCurrentItems] = useState<LiveStream[]>(items);
  const isMobile = useMobile();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch handling for swipe gestures
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Refresh items when props change and add periodic refresh
  useEffect(() => {
    setCurrentItems(items);
  }, [items]);

  // Remove excessive refresh - data will be updated when parent component refreshes

  // Auto scroll functionality
  useEffect(() => {
    const liveStreams = currentItems.filter((stream) => 
      stream.isLive === true || stream.status === 'recess'
    );

    // Only auto-scroll if there are enough items to scroll
    const shouldAutoScroll = isMobile ? liveStreams.length > 1 : liveStreams.length > 4;

    if (shouldAutoScroll) {
      const maxIndex = isMobile 
        ? Math.max(0, liveStreams.length - 1)
        : Math.max(0, liveStreams.length - 4);

      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [currentItems, isMobile]);

  // Touch swipe handling
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      scroll("right"); // Swipe left = go to next
    } else if (isRightSwipe) {
      scroll("left"); // Swipe right = go to previous
    }
  };

  // Function to handle manual scrolling
  const scroll = (direction: "left" | "right") => {
    const liveStreams = currentItems.filter((stream) => 
      stream.isLive === true || stream.status === 'recess'
    );

    if (isMobile) {
      // Mobile: Show 1 item at a time
      const maxIndex = Math.max(0, liveStreams.length - 1);
      if (direction === "left") {
        setActiveIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
        setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      } else {
        setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }
    } else {
      // Desktop: Show 4 items at a time for 5+ streams, scroll by 1
      const maxIndex = Math.max(0, liveStreams.length - 4);
      if (direction === "left") {
        setActiveIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
        setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      } else {
        setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }
    }
  };

  // Handle card click with better error handling
  const handleCardClick = (stream: LiveStream) => {
    console.log("Carousel: Clicking stream card:", {
      id: stream.id,
      title: stream.title,
      url: stream.streamUrl,
    });

    if (stream.streamUrl) {
      try {
        window.open(stream.streamUrl, "_blank", "noopener,noreferrer");
      } catch (error) {
        console.error("Carousel: Error opening URL:", error);
        // Fallback: try direct navigation
        window.location.href = stream.streamUrl;
      }
    } else {
      console.warn("Carousel: No stream URL available for:", stream.title);
    }
  };

  // Filter live and recess streams, include ST+ channel
  const liveStreams = currentItems.filter((stream) => 
    (stream.isLive === true || stream.status === 'recess' || stream.status === 'signal_open')
  );

  // If no live streams, show a message
  if (liveStreams.length === 0) {
    return (
      <div className="text-center py-8 text-white">
        No hay transmisiones en vivo en este momento.
      </div>
    );
  }

  // Function to get channel logo based on channel field
  const getChannelLogo = (channel: string) => {
    switch (channel) {
      case "C+":
        return "/images/channel-c-logo.png";
      case "D+":
        return "/images/channel-d-logo.png";
      case "S+":
        return "/images/channel-g-logo.png";
      case "ST+":
        return "/images/45.4.png";
      default:
        return "/images/logo-canal-congreso.png";
    }
  };

  // Streaming Player Button Component (for HLS streams)
  function StreamingPlayerButton({ streamUrl }: { streamUrl: string }) {
    const { showPlayer } = useFloatingPlayer();
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
      setIsHydrated(true);
      setIsMobileDevice(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    }, []);

    const handleStreamClick = () => {
      // Show floating player only for desktop
      showPlayer(streamUrl, "Radio Congreso - EN VIVO");
    };

    const handleMobileClick = () => {
      // Navigate to radio page on mobile
      window.location.href = '/radio';
    };

    return (
      <div className="text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-center">
          {!isHydrated ? (
            // Show button during SSR and initial hydration
            <button
              onClick={handleStreamClick}
              className="bg-[#e11d48] hover:bg-[#be185d] text-white rounded-full p-3 flex items-center space-x-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span className="font-medium">Radio en Vivo</span>
            </button>
          ) : isMobileDevice ? (
            // Navigate to Radio Page for Mobile
            <button
              onClick={handleMobileClick}
              className="bg-[#e11d48] hover:bg-[#be185d] text-white rounded-full px-4 py-2 flex items-center gap-2 transition-colors text-sm font-medium whitespace-nowrap shadow-lg"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Radio en Vivo</span>
            </button>
          ) : (
            // Button for Desktop (shows floating player)
            <button
              onClick={handleStreamClick}
              className="bg-[#e11d48] hover:bg-[#be185d] text-white rounded-full px-4 py-2 sm:p-3 flex items-center gap-2 transition-colors text-sm font-medium whitespace-nowrap shadow-lg"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Radio en Vivo</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header section with radio and channels - responsive layout */}
      <div className="mb-4 px-2 sm:px-4">
        {/* Mobile layout - stacked */}
        <div className="flex flex-col gap-4 sm:hidden">
          {/* Channel indicators - full width on mobile */}
          <div className="w-full flex justify-center">
            <ChannelIndicators/>
          </div>

          {/* Radio section - separate row on mobile */}
          <div className="flex items-center justify-center">
            <div className="min-w-0">
              <StreamingPlayerButton streamUrl="https://ccstreaming.packet.mx/LiveApp/streams/Radio_kd5oiNTTWO0gEOFc23dr762145.m3u8" />
            </div>
          </div>
        </div>

        {/* Desktop layout - same row */}
        <div className="hidden sm:flex items-center justify-between">
          {/* Radio section on the left */}
          <div className="flex items-center">
            <Image
              src="/images/radio-icon.png"
              alt="Radio Congreso Icon"
              width={32}
              height={32}
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0"
            />
            <div className="min-w-0 -ml-2">
              <StreamingPlayerButton streamUrl="https://ccstreaming.packet.mx/LiveApp/streams/Radio_kd5oiNTTWO0gEOFc23dr762145.m3u8" />
            </div>
          </div>

          {/* Channel indicators on the right */}
          <div className="flex justify-end">
            <ChannelIndicators/>
          </div>
        </div>
      </div>

      {/* EN VIVO AHORA title - conditionally rendered */}
      {showLiveIndicator && (
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center flex items-center justify-center text-white">
          <span className="bg-red-600 w-3 h-3 rounded-full mr-2 animate-pulse"></span>
          {liveIndicatorText}
        </h2>
      )}

      {/* Video thumbnails */}
      <div className={`py-4 ${isMobile ? 'px-2' : 'px-1'}`}>
        {isMobile ? (
          // Mobile: Show only one card with better visibility
          <div 
            className="flex justify-center px-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {liveStreams
              .slice(activeIndex, activeIndex + 1)
              .map((stream, index) => (
                <Link
                  href={`/transmisiones?stream=${stream.id}`}
                  key={`${stream.id}-${stream.streamUrl}`}
                  className="relative group cursor-pointer hover:scale-105 transition-transform duration-300 block w-full max-w-md"
                >
                  <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-2xl border-2 border-white/20">
                    <Image
                      src={
                        stream.thumbnailUrl ||
                        "/placeholder.svg?height=384&width=512"
                      }
                      alt={stream.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority
                    />

                    {/* Strong overlay with gradient background for text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>

                    {/* Live indicator */}
                    {(showLiveIndicator && (stream.isLive || stream.status === 'signal_open')) && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            {stream.status === 'signal_open' ? 'SEÑAL ABIERTA' : liveIndicatorText}
                          </span>
                        </div>
                      )}

                    {/* Text overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-start gap-2">
                        <Image
                          src={getChannelLogo(stream.channel || "")}
                          alt="Channel Logo"
                          width={24}
                          height={24}
                          className="object-contain flex-shrink-0 mt-1 bg-white/10 rounded-lg p-1"
                        />
                        <p className="text-xs text-white text-left flex-1 leading-tight font-medium drop-shadow-lg">{stream.title}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        ) : (
          // Desktop: Responsive grid layout with better spacing and card management
          <div 
            className="flex justify-center px-2"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-full max-w-[1400px] mx-auto">
              {liveStreams.length <= 4 ? (
                // Show all streams if 4 or fewer (no pagination needed)
                <div className="flex justify-center gap-3"
                >
                  {liveStreams.map((stream, index) => (
                    <div key={`${stream.id}-${stream.streamUrl}`} className="flex-1 min-w-0 max-w-none">
                      <Link
                        href={`/transmisiones?stream=${stream.id}`}
                        className="relative group cursor-pointer hover:scale-105 transition-all duration-300 block"
                      >
                        <div className="relative h-56 w-full rounded-xl overflow-hidden shadow-xl border border-white/20 group-hover:shadow-2xl transition-shadow">
                          <Image
                            src={
                              stream.thumbnailUrl ||
                              "/placeholder.svg?height=384&width=512"
                            }
                            alt={stream.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            priority={index < 2}
                          />

                          {/* Enhanced overlay with better gradients */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 transition-all duration-300"></div>

                          {/* Status tag with pulsing animation */}
                          <div className="absolute top-3 left-3 z-10">
                            {stream.isLive ? (
                              <div className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                EN VIVO
                              </div>
                            ) : stream.status === 'signal_open' ? (
                              <div className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                SEÑAL ABIERTA
                              </div>
                            ) : (
                              <div className="bg-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                EN RECESO
                              </div>
                            )}
                          </div>



                          {/* Hover play button effect */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.68L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Logo and title below card for desktop */}
                      <div className="mt-4 flex items-start gap-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 flex-shrink-0">
                          <Image
                            src={getChannelLogo(stream.channel || "")}
                            alt="Channel Logo"
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm lg:text-base font-medium leading-tight">
                            {stream.title}
                          </p>
                          <p className="text-white/80 text-xs mt-1">
                            {stream.channel === 'C+' ? 'Canal 45.1' : stream.channel === 'S+' ? 'Canal 45.2' : stream.channel === 'D+' ? 'Canal 45.3' : stream.channel === 'ST+' ? 'Streaming' : `Canal ${stream.channel}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Paginated view for 5+ streams (show 4 at a time)
                <div className="flex justify-center gap-3">
                  {liveStreams.slice(activeIndex, activeIndex + 4).map((stream, index) => (
                    <div key={`${stream.id}-${stream.streamUrl}`} className="flex-1 min-w-0 max-w-none">
                      <Link
                        href={`/transmisiones?stream=${stream.id}`}
                        className="relative group cursor-pointer hover:scale-105 transition-all duration-300 block"
                      >
                        <div className="relative h-56 w-full rounded-xl overflow-hidden shadow-xl border border-white/20 group-hover:shadow-2xl transition-shadow">
                          <Image
                            src={
                              stream.thumbnailUrl ||
                              "/placeholder.svg?height=384&width=512"
                            }
                            alt={stream.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            priority={index < 2}
                          />

                          {/* Enhanced overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 transition-all duration-300"></div>

                          {/* Status tag */}
                          <div className="absolute top-3 left-3 z-10">
                            {stream.isLive ? (
                              <div className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                EN VIVO
                              </div>
                            ) : stream.status === 'signal_open' ? (
                              <div className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                SEÑAL ABIERTA
                              </div>
                            ) : (
                              <div className="bg-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                EN RECESO
                              </div>
                            )}
                          </div>



                          {/* Hover play button effect */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.68L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Logo and title below card for desktop */}
                      <div className="mt-4 flex items-start gap-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 flex-shrink-0">
                          <Image
                            src={getChannelLogo(stream.channel || "")}
                            alt="Channel Logo"
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm lg:text-base font-medium leading-tight">
                            {stream.title}
                          </p>
                          <p className="text-white/80 text-xs mt-1">
                            {stream.channel === 'C+' ? 'Canal 45.1' : stream.channel === 'S+' ? 'Canal 45.2' : stream.channel === 'D+' ? 'Canal 45.3' : stream.channel === 'ST+' ? 'Streaming' : `Canal ${stream.channel}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation arrows - Only show when there are 5+ streams in desktop, or 2+ in mobile */}
      {((liveStreams.length > 4 && !isMobile) || (liveStreams.length > 1 && isMobile)) && (
        <div className={`flex justify-center items-center space-x-8 ${isMobile ? 'mt-8' : 'mt-8'}`}>
          <button
            onClick={() => scroll("left")}
            className="focus:outline-none p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="focus:outline-none p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}