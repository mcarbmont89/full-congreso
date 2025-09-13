"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Play, Pencil, Trash2, Plus, Upload } from "lucide-react"
import Image from "next/image"
import BulkEpisodeUpload from "@/components/bulk-episode-upload"

interface RadioEpisode {
  id: string
  title: string
  description: string
  audioUrl: string
  duration: string
  publishDate: string
  imageUrl: string
  programId: string
  programTitle?: string
  programImageUrl?: string
  createdAt: Date
  published: boolean
}

interface RadioProgram {
  id: string
  title: string
}

export default function RadioEpisodesPage() {
  const [episodes, setEpisodes] = useState<RadioEpisode[]>([])
  const [programs, setPrograms] = useState<RadioProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEpisode, setEditingEpisode] = useState<RadioEpisode | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audioUrl: '',
    duration: '',
    publishDate: '',
    imageUrl: '',
    programId: '',
    published: true
  })
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchEpisodes()
    fetchPrograms()
  }, [])

  const fetchEpisodes = async () => {
    try {
      const response = await fetch('/api/radio/episodes')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched episodes:', data)
        setEpisodes(data)
      }
    } catch (error) {
      console.error('Error fetching episodes:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los episodios",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/radio/programs')
      if (response.ok) {
        const data = await response.json()
        setPrograms(data)
      }
    } catch (error) {
      console.error('Error fetching programs:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los programas",
        variant: "destructive"
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.programId) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      })
      return
    }

    try {
      console.log('Submitting episode data:', formData)

      const url = editingEpisode ? `/api/radio/episodes/${editingEpisode.id}` : '/api/radio/episodes'
      const method = editingEpisode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          published: true
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Episode saved successfully:', result)

        toast({
          title: "Éxito",
          description: `Episodio ${editingEpisode ? 'actualizado' : 'creado'} correctamente`
        })
        setFormData({
          title: '',
          description: '',
          audioUrl: '',
          duration: '',
          publishDate: '',
          imageUrl: '',
          programId: '',
          published: true
        })
        setEditingEpisode(null)
        setDialogOpen(false)
        fetchEpisodes()
      } else {
        const error = await response.text()
        console.error('Error response:', error)
        throw new Error(error || 'Error al procesar la solicitud')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Hubo un problema al procesar la solicitud",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (episode: RadioEpisode) => {
    setEditingEpisode(episode)

    // Format the publish date for the datetime-local input field
    let formattedDate = ''
    if (episode.publishDate) {
      const date = new Date(episode.publishDate)
      if (!isNaN(date.getTime())) {
        // Format for datetime-local input (YYYY-MM-DDTHH:MM)
        formattedDate = date.toISOString().slice(0, 16)
      }
    }

    setFormData({
      title: episode.title,
      description: episode.description,
      audioUrl: episode.audioUrl,
      duration: episode.duration,
      publishDate: formattedDate,
      imageUrl: episode.imageUrl,
      programId: episode.programId,
      published: episode.published !== false
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este episodio?')) {
      return
    }

    try {
      const response = await fetch(`/api/radio/episodes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Episodio eliminado correctamente"
        })
        setEpisodes(prevEpisodes => prevEpisodes.filter(episode => episode.id !== id))
        fetchEpisodes()
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al eliminar el episodio')
      }
    } catch (error) {
      console.error('Error deleting episode:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el episodio",
        variant: "destructive"
      })
    }
  }

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // More flexible validation for MP3 files
    const isValidAudio = file.type.startsWith('audio/') || 
                        file.name.toLowerCase().endsWith('.mp3') ||
                        file.type === 'audio/mpeg' ||
                        file.type === 'audio/mp3'

    if (!isValidAudio) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos de audio MP3",
        variant: "destructive"
      })
      return
    }

    // Check file size (max 200MB)
    if (file.size > 200 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "El archivo es demasiado grande. Máximo 200MB.",
        variant: "destructive"
      })
      return
    }

    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('type', 'audio')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Audio upload response:', data)

        // Try multiple possible URL fields from the response
        const audioUrl = data.audioUrl || data.url || data.fileUrl

        if (audioUrl) {
          setFormData(prev => ({ ...prev, audioUrl: audioUrl }))
          toast({
            title: "Éxito",
            description: `Audio subido correctamente: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`
          })

          // Clear the file input
          event.target.value = ''
        } else {
          console.error('Upload response missing URL:', data)
          throw new Error('No se recibió URL del audio en la respuesta del servidor')
        }
      } else {
        const errorText = await response.text()
        const errorData = (() => {
          try {
            return JSON.parse(errorText)
          } catch {
            return { error: errorText || 'Error desconocido' }
          }
        })()

        console.error('Upload error response:', response.status, errorData)
        throw new Error(errorData.error || `Error del servidor: ${response.status}`)
      }
    } catch (error) {
      console.error('Error uploading audio:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo subir el audio",
        variant: "destructive"
      })
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('type', 'radio')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }))
        toast({
          title: "Éxito",
          description: "Imagen subida correctamente"
        })
      } else {
        throw new Error('Error al subir la imagen')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Error",
        description: "No se pudo subir la imagen",
        variant: "destructive"
      })
    }
  }

  const handlePublishScheduled = async () => {
    try {
      const response = await fetch('/api/radio/episodes/publish-scheduled', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Éxito",
          description: `Se publicaron ${data.publishedCount} episodios programados`,
        })
        fetchEpisodes() // Refresh the list
      } else {
        throw new Error('Error al publicar episodios programados')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al publicar episodios programados",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Episodios de Radio</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePublishScheduled}
            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
          >
            Publicar Programados
          </Button>
          <BulkEpisodeUpload onComplete={fetchEpisodes} />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingEpisode(null)
                setFormData({
                  title: '',
                  description: '',
                  audioUrl: '',
                  duration: '',
                  publishDate: '',
                  imageUrl: '',
                  programId: '',
                  published: true
                })
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Episodio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingEpisode ? 'Editar Episodio' : 'Nuevo Episodio'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="programId">Programa</Label>
                  <Select
                    value={formData.programId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, programId: value }))}
                    required
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Seleccionar programa..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id.toString()}>
                          {program.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="published">Estado</Label>
                  <Select
                    value={formData.published ? 'published' : 'scheduled'}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, published: value === 'published' }))}
                    required
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="scheduled">Programado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="audioFile">Audio (MP3)</Label>
                  <p className="text-xs text-gray-500 mb-2">Tamaño máximo: 200MB</p>
                  <div className="flex gap-2">
                    <Input
                      id="audioFile"
                      type="file"
                      accept="audio/mp3,audio/mpeg"
                      onChange={handleAudioUpload}
                    />
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.audioUrl && (
                    <p className="text-sm text-green-600 mt-1">Audio cargado: {formData.audioUrl}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duración</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="ej: 45MIN"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="publishDate">Fecha y Hora de Publicación</Label>
                    <Input
                      id="publishDate"
                      type="datetime-local"
                      value={formData.publishDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="imageFile">Imagen del Episodio</Label>
                  <div className="space-y-2">
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                        <Image
                          src={formData.imageUrl}
                          alt="Vista previa"
                          width={100}
                          height={60}
                          className="rounded object-cover border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingEpisode ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Episodios</CardTitle>
          <CardDescription>
            {episodes.length} episodios configurados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Programa</TableHead>
                <TableHead>Audio</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Fecha de Publicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {episodes.map((episode) => (
                <TableRow key={episode.id}>
                  <TableCell>
                    <Image
                      src={(episode.imageUrl && episode.imageUrl.trim() !== '') ? episode.imageUrl : (episode.programImageUrl || '/images/placeholder-logo.png')}
                      alt={episode.title}
                      width={60}
                      height={40}
                      className="rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{episode.title}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{episode.description}</p>
                      {episode.audioUrl && (
                        <p className="text-xs text-blue-600 mt-1">
                          Audio: {episode.audioUrl.split('/').pop()}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      {episode.programTitle || 'Sin programa'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {episode.audioUrl ? (
                      <div className="text-xs">
                        <span className="text-green-600">✓ Audio</span>
                        <br />
                        <span className="text-gray-500 truncate max-w-20 block">
                          {episode.audioUrl.split('/').pop()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-red-500 text-xs">Sin audio</span>
                    )}
                  </TableCell>
                  <TableCell>{episode.duration}</TableCell>
                  <TableCell>
                    {episode.publishDate ? new Date(episode.publishDate).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : ''}
                  </TableCell>
                  <TableCell>{episode.published ? 'Publicado' : 'Programado'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(episode)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(episode.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Eliminar episodio"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {episode.audioUrl && (
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              // Stop any currently playing audio
                              if (audioElement) {
                                audioElement.pause()
                                audioElement.currentTime = 0
                              }

                              if (currentlyPlaying === episode.id) {
                                // Stop current audio
                                setCurrentlyPlaying(null)
                                setAudioElement(null)
                              } else {
                                // Start new audio
                                console.log('Playing audio from:', episode.audioUrl)
                                const audio = new Audio(episode.audioUrl)

                                audio.addEventListener('ended', () => {
                                  setCurrentlyPlaying(null)
                                  setAudioElement(null)
                                })

                                audio.addEventListener('error', (err) => {
                                  console.error('Error playing audio:', err)
                                  let errorMessage = "No se pudo reproducir el audio"

                                  if (audio.error) {
                                    switch (audio.error.code) {
                                      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                                        errorMessage = "Archivo de audio no encontrado o formato no soportado"
                                        break
                                      case MediaError.MEDIA_ERR_NETWORK:
                                        errorMessage = "Error de red al cargar el audio"
                                        break
                                      case MediaError.MEDIA_ERR_DECODE:
                                        errorMessage = "Error al decodificar el archivo de audio"
                                        break
                                      case MediaError.MEDIA_ERR_ABORTED:
                                        errorMessage = "Carga de audio interrumpida"
                                        break
                                      default:
                                        errorMessage = "Error desconocido al reproducir audio"
                                    }
                                  }

                                  toast({
                                    title: "Error de Audio",
                                    description: errorMessage,
                                    variant: "destructive"
                                  })
                                  setCurrentlyPlaying(null)
                                  setAudioElement(null)
                                })

                                audio.play().then(() => {
                                  setCurrentlyPlaying(episode.id)
                                  setAudioElement(audio)
                                  toast({
                                    title: "Reproduciendo",
                                    description: `${episode.title}`,
                                  })
                                }).catch(err => {
                                  console.error('Error playing audio:', err)
                                  toast({
                                    title: "Error de Reproducción",
                                    description: "El archivo de audio no existe o no se puede reproducir. Verifique que el archivo esté correctamente subido.",
                                    variant: "destructive"
                                  })
                                  setCurrentlyPlaying(null)
                                  setAudioElement(null)
                                })
                              }
                            }}
                            title={currentlyPlaying === episode.id ? "Detener audio" : "Reproducir audio"}
                            className={currentlyPlaying === episode.id ? "bg-green-100 text-green-700" : ""}
                          >
                            {currentlyPlaying === episode.id ? (
                              <div className="h-4 w-4 border-2 border-current" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}