
"use client"

import Image from "next/image"
import { useState } from "react"

interface PlaceholderImageProps {
  src?: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  fallbackText?: string
  priority?: boolean
}

export default function PlaceholderImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  fill = false,
  fallbackText,
  priority = false
}: PlaceholderImageProps) {
  const [imageSrc, setImageSrc] = useState(src || '/placeholder.svg')
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      // Generate a placeholder SVG with proper dimensions and text
      const placeholderSvg = `data:image/svg+xml,${encodeURIComponent(`
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">
            ${fallbackText || 'Imagen no disponible'}
          </text>
        </svg>
      `)}`
      setImageSrc(placeholderSvg)
    }
  }

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        onError={handleError}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={priority}
    />
  )
}
