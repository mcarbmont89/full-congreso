"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, ArrowLeft, Play } from "lucide-react"

interface VideoNews {
  id: string
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  category?: string
  duration?: string
  publishedAt: Date
  status: string
  createdAt: Date
}

export default function VideoNewsAdmin() {
  const [videoNews, setVideoNews] = useState<VideoNews[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoNews | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: '',
    duration: '',
    publishedAt: new Date().toISOString().slice(0, 16),
  })
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')

  const categories = [
    'Trabajo en comisiones',
    'Trabajo en pleno', 
    'Relaciones Exteriores',
    'Temas de actualidad',
    'Reformas aprobadas',
    'Foros y seminarios',
    'Entrevistas',
    'Reportajes especiales'
  ]

  useEffect(() => {
    loadVideoNews()
  }, [])

  const loadVideoNews = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/video-news/all', {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setVideoNews(data)
      }
    } catch (error) {
      console.error('Error loading video news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedThumbnail(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadThumbnail = async (file: File): Promise<string> => {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('type', 'video-thumbnails')

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Upload error:', errorData)
      throw new Error(errorData.error || 'Error uploading thumbnail')
    }

    const result = await response.json()
    if (!result.success) {
      throw new Error(result.error || 'Error uploading thumbnail')
    }

    return result.imageUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      let thumbnailUrl = formData.thumbnailUrl

      if (selectedThumbnail) {
        thumbnailUrl = await uploadThumbnail(selectedThumbnail)
      }

      const videoData = {
        ...formData,
        thumbnailUrl,
        publishedAt: new Date(formData.publishedAt)
      }

      const url = editingVideo 
        ? `/api/video-news/${editingVideo.id}` 
        : '/api/video-news'

      const method = editingVideo ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoData),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingVideo(null)
        resetForm()
        loadVideoNews()
      }
    } catch (error) {
      console.error('Error saving video news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (video: VideoNews) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      description: video.description || '',
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || '',
      category: video.category || '',
      duration: video.duration || '',
      publishedAt: new Date(video.publishedAt).toISOString().slice(0, 16),
    })
    setSelectedThumbnail(null)
    setThumbnailPreview(video.thumbnailUrl || '')
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este video?')) {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/video-news/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          loadVideoNews()
        }
      } catch (error) {
        console.error('Error deleting video news:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      category: '',
      duration: '',
      publishedAt: new Date().toISOString().slice(0, 16),
    })
    setSelectedThumbnail(null)
    setThumbnailPreview('')
  }

  const handleNewVideo = () => {
    setEditingVideo(null)
    resetForm()
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingVideo(null)
    resetForm()
  }

  if (showForm) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {editingVideo ? 'Editar Video' : 'Nuevo Video'}
            </h1>
            <p className="text-gray-600">
              Completa la información del video noticia.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="videoUrl">URL de la Playlist de YouTube</Label>
                    <Input
                      id="videoUrl"
                      type="url"
                      placeholder="https://www.youtube.com/playlist?list=PLYourPlaylistID"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                      required
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Acepta cualquier URL de YouTube: playlists, videos individuales, transmisiones en vivo o URLs cortas (youtu.be).
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="publishedAt">Fecha y Hora de Publicación</Label>
                    <Input
                      id="publishedAt"
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Guardando...' : (editingVideo ? 'Actualizar' : 'Crear')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Video Noticias</h1>
          <p className="text-gray-600">Gestiona videos noticiosos del portal</p>
        </div>

        <Button onClick={handleNewVideo}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Video
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Videos</CardTitle>
          <CardDescription>
            {videoNews.length} videos publicados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Cargando videos...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videoNews.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        video.status === 'published' ? 'bg-green-100 text-green-800' :
                        video.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {video.status === 'published' ? 'Publicado' :
                         video.status === 'scheduled' ? 'Programado' :
                         'Borrador'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(video.publishedAt).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(video.videoUrl, '_blank')}
                          title="Ver playlist en YouTube"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(video)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(video.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {videoNews.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      No hay videos disponibles. Crea el primer video.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}