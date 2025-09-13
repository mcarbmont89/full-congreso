"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Edit3, Plus, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

interface Organ {
  id: string
  title: string
  description: string
  imageUrl: string
  url?: string
  createdAt: Date
  updatedAt: Date
}

export default function OrgansAdmin() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [organs, setOrgans] = useState<Organ[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [editingOrgan, setEditingOrgan] = useState<Organ | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    url: ''
  })
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchOrgans()
  }, [])

  const fetchOrgans = async () => {
    try {
      const response = await fetch('/api/organs')
      if (response.ok) {
        const data = await response.json()
        setOrgans(data)
      }
    } catch (error) {
      console.error('Error fetching organs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'organs')

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Error al subir la imagen')
    }

    const data = await response.json()
    return data.imageUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Título y descripción son requeridos')
      return
    }

    // Check if we have either an image URL or a file to upload
    if (!formData.imageUrl.trim() && !selectedFile) {
      setError('Debe proporcionar una imagen (URL o archivo)')
      return
    }

    setLoading(true)
    try {
      setIsUploading(true)

      let finalImageUrl = formData.imageUrl.trim()

      // If a file is selected, upload it first
      if (selectedFile) {
        finalImageUrl = await handleFileUpload(selectedFile)
      }

      const method = editingOrgan ? 'PUT' : 'POST'
      const url = editingOrgan ? `/api/organs/${editingOrgan.id}` : '/api/organs'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          imageUrl: finalImageUrl,
          url: formData.url.trim() || null,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error al ${editingOrgan ? 'actualizar' : 'crear'} el órgano`)
      }

      setFormData({ title: '', description: '', imageUrl: '', url: '' })
      setSelectedFile(null)
      setError('')
      setEditingOrgan(null)
      setIsDialogOpen(false)
      fetchOrgans()
    } catch (error) {
      setError(`Error al ${editingOrgan ? 'actualizar' : 'crear'} el órgano`)
    } finally {
      setLoading(false)
      setIsUploading(false)
    }
  }

  const handleEdit = (organ: Organ) => {
    setFormData({
      title: organ.title,
      description: organ.description,
      imageUrl: organ.imageUrl,
      url: organ.url || ''
    })
    setSelectedFile(null)
    setEditingOrgan(organ)
    setIsDialogOpen(true)
    setImagePreview(organ.imageUrl)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este órgano?')) {
      try {
        const response = await fetch(`/api/organs/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchOrgans()
        }
      } catch (error) {
        console.error('Error deleting organ:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      url: '',
    })
    setEditingOrgan(null)
    setSelectedFile(null)
    setImagePreview("")
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      // Clear URL field when file is selected
      setFormData(prev => ({ ...prev, imageUrl: "" }))
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('type', 'organs')

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData,
    })

    if (!response.ok) {
      throw new Error('Error uploading image')
    }

    const result = await response.json()
    return result.imageUrl
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg">Cargando órganos...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Órganos</h1>
          <p className="text-gray-600">Administrar órganos del Canal del Congreso</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Órgano
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingOrgan ? 'Editar Órgano' : 'Crear Nuevo Órgano'}
              </DialogTitle>
              <DialogDescription>
                {editingOrgan ? 'Modifica los datos del órgano' : 'Completa la información del nuevo órgano'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="url">URL (opcional)</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://ejemplo.com"
                />
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen
              </label>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Subir archivo:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-1">
                      Archivo seleccionado: {selectedFile.name}
                    </p>
                  )}
                </div>
                <div className="text-center text-gray-500 text-sm">— O —</div>
                <div>
                  <Label htmlFor="imageUrl">URL de imagen</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Opcional - URL de la imagen"
                  />
                </div>

                {/* Image Preview */}
                {(imagePreview || formData.imageUrl) && (
                  <div className="mt-3">
                    <label className="text-sm text-gray-600">Vista previa:</label>
                    <div className="mt-2 p-2 border border-gray-200 rounded-md">
                      <img
                        src={imagePreview || formData.imageUrl}
                        alt="Vista previa"
                        className="max-w-full h-32 object-contain rounded"
                        onError={() => {
                          console.log("Error loading preview image")
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleDialogClose} disabled={isUploading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Subiendo..." : (editingOrgan ? 'Actualizar' : 'Crear')} Órgano
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {organs.map((organ) => (
          <Card key={organ.id}>
            <CardHeader>
              <div className="relative aspect-video mb-4">
                <Image
                  src={organ.imageUrl || "/placeholder.svg"}
                  alt={organ.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <CardTitle className="text-lg">{organ.title}</CardTitle>
              <CardDescription>
                {organ.description.length > 100
                  ? `${organ.description.substring(0, 100)}...`
                  : organ.description
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Creado: {new Date(organ.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(organ)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(organ.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {organs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Eye className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay órganos</h3>
            <p className="text-gray-600 text-center mb-4">
              Aún no se han creado órganos. Crea el primer órgano para comenzar.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Órgano
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}