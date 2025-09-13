"use client"

import { useState, useEffect } from 'react'
import { Accessibility } from 'lucide-react'

export default function AccessibilityButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const increaseFontSize = () => {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    document.documentElement.style.fontSize = `${Math.min(currentSize + 2, 24)}px`
  }

  const decreaseFontSize = () => {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    document.documentElement.style.fontSize = `${Math.max(currentSize - 2, 12)}px`
  }

  const toggleHighContrast = () => {
    document.documentElement.classList.toggle('high-contrast')
  }

  // Don't render anything until hydration is complete
  if (!isClient) {
    return null
  }

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-3 rounded-r-md shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Opciones de accesibilidad"
      >
        <Accessibility size={20} />
      </button>

      {isOpen && (
        <div className="absolute left-full ml-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-64">
          <h3 className="font-semibold text-gray-800 mb-3">Opciones de Accesibilidad</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño de texto
              </label>
              <div className="flex gap-2">
                <button
                  onClick={decreaseFontSize}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  A-
                </button>
                <button
                  onClick={increaseFontSize}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  A+
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={toggleHighContrast}
                className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-left"
              >
                Alto contraste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}