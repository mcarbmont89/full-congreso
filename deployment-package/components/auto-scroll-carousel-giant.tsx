"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import type { LiveStream } from "@/lib/api"

interface AutoScrollCarouselProps {
  items: LiveStream[]
}

export default function AutoScrollCarouselGiant({ items }: AutoScrollCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Auto scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [items.length])

  // Function to handle manual scrolling
  const scroll = (direction: "left" | "right") => {
    if (direction === "left") {
      setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
    } else {
      setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
    }
  }

  // Custom Play icon at 10x size
  const GiantPlayIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="160"
      height="160"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  )

  // Filter only live streams
  const liveStreams = items.filter(stream => stream.isLive === true)

  // If no live streams, show a message
  if (liveStreams.length === 0) {
    return <div className="text-center py-80 text-white text-8xl">No hay transmisiones en vivo en este momento.</div>
  }

  return (
    <div className="relative w-[3000px] mx-auto px-40">
      {/* Channel indicators - 10X SIZE */}
      <div className="flex justify-end space-x-80 mb-80">
        <div className="flex items-center">
          <div className="bg-[#6b7280] text-white rounded-[50px] px-60 py-20 flex items-center text-7xl">
            <span className="mr-20">CANAL</span>
            <span className="font-bold">45.1</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="bg-[#ef4444] text-white rounded-[50px] px-60 py-20 flex items-center text-7xl">
            <span className="mr-20">CANAL</span>
            <span className="font-bold">45.2</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="bg-[#22c55e] text-white rounded-[50px] px-60 py-20 flex items-center text-7xl">
            <span className="mr-20">CANAL</span>
            <span className="font-bold">45.3</span>
          </div>
        </div>
      </div>

      {/* EN VIVO AHORA title - 10X SIZE */}
      <h2 className="text-[200px] font-bold mb-120 text-center flex items-center justify-center text-white">
        <span className="bg-red-600 w-60 h-60 rounded-full mr-40 animate-pulse"></span>
        EN VIVO AHORA
      </h2>

      {/* Video thumbnails - 10X SIZE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-80 py-80">
        {liveStreams.slice(0, 4).map((stream, index) => (
          <div key={stream.id} className="relative group cursor-pointer">
            <div className="relative h-[960px] w-full rounded-[50px] overflow-hidden">
              <Image
                src={stream.thumbnailUrl || "/placeholder.svg?height=960&width=1280"}
                alt={stream.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white bg-opacity-20 rounded-full p-60 group-hover:bg-opacity-40 transition-all">
                  <GiantPlayIcon />
                </div>
              </div>
            </div>
            <div className="mt-40 text-center">
              <p className="text-6xl text-white">{stream.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows - 10X SIZE */}
      <div className="flex justify-center mt-80 space-x-80">
        <button onClick={() => scroll("left")} className="focus:outline-none" aria-label="Anterior">
          <svg width="240" height="240" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="white" />
            <path d="M15 6L9 12L15 18" stroke="#3b0764" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button onClick={() => scroll("right")} className="focus:outline-none" aria-label="Siguiente">
          <svg width="240" height="240" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="white" />
            <path d="M9 18L15 12L9 6" stroke="#3b0764" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}