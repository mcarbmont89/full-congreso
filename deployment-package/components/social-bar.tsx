"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SocialBar() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Prevent hydration mismatch by not rendering on server
  if (!isHydrated) {
    return null
  }

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-transform duration-300 group">
      <div className="flex flex-col bg-purple-900 rounded-l-md shadow-lg">
        {/* WhatsApp */}
        <Link
          href="https://whatsapp.com/channel/0029Vb55Zgo5EjxvIySofH1J"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-green-600 transition-colors"
          aria-label="WhatsApp"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m.01 1.67c4.62 0 8.33 3.71 8.33 8.33 0 4.62-3.71 8.33-8.33 8.33-1.35 0-2.62-.33-3.75-.91l-.24-.13-2.4.63.64-2.32-.16-.25c-.68-1.16-1.04-2.5-1.04-3.86 0-4.62 3.71-8.33 8.33-8.33M8.5 7.14c-.18 0-.37.06-.5.15-.49.29-.8.73-.8 1.18 0 .23.09.43.25.59.17.17.39.19.59.19.91 0 1.77-.74 1.77-1.74 0-.18-.02-.43-.16-.56-.11-.11-.3-.18-.5-.18-.22 0-.42.05-.57.18-.13.11-.21.32-.21.56 0 .78.63 1.4 1.4 1.4.18 0 .36-.03.53-.08l.06-.02c.05-.02.1-.03.14-.05.12-.05.23-.12.31-.22.05-.07.08-.15.08-.24 0-.17-.05-.33-.15-.46-.24-.3-.66-.46-1.06-.46-.4 0-.82.16-1.06.46z"/>
          </svg>
        </Link>

        {/* Facebook */}
        <Link
          href="https://www.facebook.com/share/1AEEAeTbkQ/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-blue-600 transition-colors"
          aria-label="Facebook"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </Link>

        {/* Twitter/X */}
        <Link
          href="https://x.com/canalcongreso"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-800 transition-colors"
          aria-label="X (Twitter)"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </Link>

        {/* YouTube */}
        <Link
          href="https://www.youtube.com/channel/UC0qf7R7Vq3H8JSNYfIs3uKg"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-red-600 transition-colors"
          aria-label="YouTube"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </Link>

        {/* Spotify */}
        <Link
          href="https://open.spotify.com/show/17bt21pyYPzCKdHOrgdY3B?si=28wx_d3QTZyEk9M8ABKhWA"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-green-500 transition-colors"
          aria-label="Spotify"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.568 17.328c-.24 0-.48-.096-.72-.24-2.16-1.2-4.896-1.44-7.68-.72-.24.072-.48-.024-.576-.24-.072-.24.024-.48.24-.576 3.024-.768 6.024-.528 8.4.816.216.144.288.432.144.648-.096.144-.288.312-.552.312zm.96-2.52c-.24 0-.48-.096-.72-.24-2.52-1.44-6.24-1.8-9.36-.96-.288.072-.576-.072-.648-.36-.072-.288.072-.576.36-.648 3.6-.96 7.68-.552 10.56 1.152.24.144.36.48.216.72-.144.24-.288.336-.408.336zm.096-2.64c-.24 0-.48-.096-.72-.24-3.12-1.68-8.16-1.8-11.04-.96-.36.096-.72-.12-.816-.48-.096-.36.12-.72.48-.816 3.36-.96 8.88-.816 12.48 1.152.288.144.432.48.288.768-.144.216-.36.336-.648.336z"/>
          </svg>
        </Link>

        {/* TikTok */}
        <Link
          href="https://www.tiktok.com/@canaldelcongresomx?_t=ZS-8yDjQ5NJpX5&_r=1"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-black transition-colors"
          aria-label="TikTok"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        </Link>

        {/* Instagram */}
        <Link
          href="https://www.instagram.com/canalcongresomx?igsh=MW5qNjJjNHU5aWZsdA=="
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-colors"
          aria-label="Instagram"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}