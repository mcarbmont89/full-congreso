
"use client"

import Image from "next/image"
import { useState } from "react"

interface OrganImageProps {
  imageUrl: string
  title: string
}

export default function OrganImage({ imageUrl, title }: OrganImageProps) {
  const [imageSrc, setImageSrc] = useState(imageUrl || "/placeholder.svg")
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
      alt={title} 
      fill 
      className="object-cover"
      unoptimized={true}
      onError={handleImageError}
    />
  )
}
