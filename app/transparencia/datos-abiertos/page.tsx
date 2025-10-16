
"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TransparencySubmenu from "@/components/transparency/submenu"
import { Download, FileText, Calendar } from "lucide-react"

interface Dataset {
  id: string
  title: string
  description: string
  category: string
  update_frequency: string
  last_updated: string
  formats: string
  file_url: string
  file_name: string
  file_size: number
  file_type: string
}

interface TransparencySection {
  sectionKey: string
  sectionTitle: string
  cardsData: Array<{
    title: string
    description: string
    linkUrl: string
    hasButton: boolean
  }>
}

export default function DatosAbiertosPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [sectionData, setSectionData] = useState<TransparencySection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDatasets()
    loadSectionData()
  }, [])

  const loadDatasets = async () => {
    try {
      const response = await fetch('/api/datasets')
      if (response.ok) {
        const data = await response.json()
        setDatasets(data)
      }
    } catch (error) {
      console.error('Error loading datasets:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSectionData = async () => {
    try {
      const response = await fetch('/api/transparency-sections/datos-abiertos')
      if (response.ok) {
        const data = await response.json()
        setSectionData(data)
      }
    } catch (error) {
      console.error('Error loading section data:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    const iconClass = "h-8 w-8"
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return <FileText className={`${iconClass} text-red-600`} />
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileText className={`${iconClass} text-green-600`} />
      case 'doc':
      case 'docx':
        return <FileText className={`${iconClass} text-blue-600`} />
      default:
        return <FileText className={`${iconClass} text-gray-600`} />
    }
  }

  return (
    <>
      <Navbar />
      <TransparencySubmenu />
      <main className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">
          {sectionData?.sectionTitle || 'Datos Abiertos'}
        </h1>

        {sectionData?.cardsData && sectionData.cardsData.length > 0 && (
          <div className="prose max-w-none mb-8">
            {sectionData.cardsData.map((card, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-lg text-gray-700">{card.description}</p>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando datasets...</p>
          </div>
        ) : datasets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay datasets disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {datasets.map((dataset) => (
              <div key={dataset.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    {getFileIcon(dataset.file_type)}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{dataset.title}</h3>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {dataset.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Actualizado: {new Date(dataset.last_updated).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Frecuencia: {dataset.update_frequency}
                    </p>
                    <p className="text-sm text-gray-600">
                      Formatos: {dataset.formats}
                    </p>
                    <p className="text-sm text-gray-500">
                      Tamaño: {formatFileSize(dataset.file_size)}
                    </p>
                  </div>

                  {dataset.description && (
                    <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                      {dataset.description}
                    </p>
                  )}

                  <div className="flex space-x-3">
                    <a
                      href={dataset.file_url}
                      download={dataset.file_name}
                      className="flex-1 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </a>
                    <a
                      href={dataset.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded text-sm transition-colors"
                    >
                      Ver
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
