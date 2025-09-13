
"use client"

import Image from "next/image"
import { useState } from "react"

interface SafeImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  unoptimized?: boolean
  width?: number
  height?: number
  priority?: boolean
}

export default function SafeImage({ src, alt, fill, className, unoptimized, width, height, priority }: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true)
      setImageSrc("/placeholder.svg")
    }
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      unoptimized={unoptimized}
      priority={priority}
      onError={handleImageError}
    />
  )
}
