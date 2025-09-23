"use client"

import Image from 'next/image'
import { useState } from 'react'

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  unoptimized?: boolean
  onError?: () => void
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  unoptimized = true,
  onError
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src || '/placeholder.jpg')
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError && imageSrc !== '/placeholder.jpg') {
      setHasError(true)

      // Try different extensions for the same filename
      const baseName = src?.split('.').slice(0, -1).join('.')
      if (baseName && src?.includes('.jpeg')) {
        setImageSrc(baseName + '.jpg')
        return
      } else if (baseName && src?.includes('.jpg')) {
        setImageSrc(baseName + '.png')
        return
      }

      setImageSrc('/placeholder.jpg')
      onError?.()
    } else if (imageSrc !== '/placeholder.jpg') {
      setImageSrc('/placeholder.jpg')
    }
  }

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        unoptimized={unoptimized}
        onError={handleError}
      />
    )
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      unoptimized={unoptimized}
      onError={handleError}
    />
  )
}