
"use client"

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

interface RadioProgram {
  id: string
  title: string
  description: string
  category: string
  programLink: string
}

interface RadioSearchProps {
  programs: RadioProgram[]
  onClose?: () => void
}

export default function RadioSearch({ programs, onClose }: RadioSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPrograms, setFilteredPrograms] = useState<RadioProgram[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPrograms([])
      return
    }

    const filtered = programs.filter(program =>
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPrograms(filtered)
  }, [searchTerm, programs])

  const handleClose = () => {
    setIsOpen(false)
    setSearchTerm('')
    onClose?.()
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar programas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="bg-gray-800 text-white text-sm px-3 py-1 rounded-md w-40 md:w-48 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {isOpen && (
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {filteredPrograms.length > 0 ? (
            <div className="py-2">
              {filteredPrograms.map((program) => (
                <Link
                  key={program.id}
                  href={program.programLink}
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-900"
                  onClick={handleClose}
                >
                  <div className="font-medium">{program.title}</div>
                  <div className="text-sm text-gray-600 truncate">
                    {program.description}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    {program.category}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              No se encontraron programas
            </div>
          )}
        </div>
      )}
    </div>
  )
}
