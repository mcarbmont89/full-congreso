"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, Plus } from "lucide-react"

interface BulkEpisodeData {
  publishDate: string
  title: string
  description: string
  file: File | null
  image: File | null
  programId: string
}

interface BulkEpisodeUploadProps {
  onComplete: () => void
}

export default function BulkEpisodeUpload({ onComplete }: BulkEpisodeUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [episodes, setEpisodes] = useState<BulkEpisodeData[]>([
    { publishDate: '', title: '', description: '', file: null, image: null, programId: '' }
  ])
  const [isUploading, setIsUploading] = useState(false)
  const [programs, setPrograms] = useState<any[]>([])
  const { toast } = useToast()

  // Fetch programs when dialog opens
  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/radio/programs')
      if (response.ok) {
        const programsData = await response.json()
        setPrograms(programsData)
      }
    } catch (error) {
      console.error('Error fetching programs:', error)
    }
  }

  const addEpisode = () => {
    if (episodes.length < 10) {
      setEpisodes([...episodes, { publishDate: '', title: '', description: '', file: null, image: null, programId: '' }])
    }
  }

  const removeEpisode = (index: number) => {
    if (episodes.length > 1) {
      const newEpisodes = episodes.filter((_, i) => i !== index)
      setEpisodes(newEpisodes)
    }
  }

  const updateEpisode = (index: number, field: keyof BulkEpisodeData, value: any) => {
    const newEpisodes = [...episodes]
    newEpisodes[index] = { ...newEpisodes[index], [field]: value }
    setEpisodes(newEpisodes)
  }

  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      updateEpisode(index, 'file', file)
    } else {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de audio válido",
        variant: "destructive"
      })
    }
  }

  const handleImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      updateEpisode(index, 'image', file)
    } else {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido",
        variant: "destructive"
      })
    }
  }

  const uploadFile = async (file: File, type: string): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Error al subir el archivo')
    }

    const data = await response.json()
    return data.url
  }

  const handleBulkUpload = async () => {
    // Validate all episodes
    const validEpisodes = episodes.filter(ep => 
      ep.publishDate && ep.title && ep.file && ep.programId
    )

    if (validEpisodes.length === 0) {
      toast({
        title: "Error",
        description: "Debe completar al menos un episodio",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)

    try {
      const results = []

      for (const episode of validEpisodes) {
        // Upload audio file
        const audioUrl = await uploadFile(episode.file!, 'audio')

        // Upload image file if provided
        let imageUrl = ''
        if (episode.image) {
          imageUrl = await uploadFile(episode.image, 'general')
        }

        // Get program info
        const selectedProgram = programs.find(p => p.id === episode.programId)

        // Create episode
        const episodeData = {
          title: episode.title,
          description: episode.description || `Episodio de ${selectedProgram?.title || 'Programa'}`,
          audioUrl: audioUrl,
          duration: '30MIN', // Default duration
          publishDate: episode.publishDate,
          imageUrl: imageUrl || selectedProgram?.imageUrl || '/images/carousel/programas.png',
          programId: episode.programId
        }

        const response = await fetch('/api/radio/episodes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(episodeData),
        })

        if (response.ok) {
          results.push(await response.json())
        } else {
          throw new Error(`Error al crear episodio: ${episode.title}`)
        }
      }

      toast({
        title: "Éxito",
        description: `Se crearon ${results.length} episodios correctamente`
      })

      // Reset form
      setEpisodes([{ publishDate: '', title: '', description: '', file: null, image: null, programId: '' }])
      setIsOpen(false)
      onComplete()

    } catch (error) {
      console.error('Error in bulk upload:', error)
      toast({
        title: "Error",
        description: "Error al subir los episodios",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (open) {
        fetchPrograms()
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Subida Masiva
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subida Masiva de Episodios</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {episodes.map((episode, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Episodio {index + 1}</h4>
                {episodes.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEpisode(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha y Hora de Publicación</Label>
                  <Input
                    type="datetime-local"
                    value={episode.publishDate}
                    onChange={(e) => updateEpisode(index, 'publishDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Programa</Label>
                  <Select
                    value={episode.programId}
                    onValueChange={(value) => updateEpisode(index, 'programId', value)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Seleccionar programa..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Título</Label>
                <Input
                  value={episode.title}
                  onChange={(e) => updateEpisode(index, 'title', e.target.value)}
                  placeholder="Título del episodio"
                />
              </div>

              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={episode.description}
                  onChange={(e) => updateEpisode(index, 'description', e.target.value)}
                  placeholder="Descripción del episodio (opcional)"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si no se especifica, se generará automáticamente
                </p>
              </div>

              <div>
                <Label>Archivo MP3</Label>
                <p className="text-xs text-gray-500">Tamaño máximo: 200MB</p>
                <Input
                  type="file"
                  accept="audio/mp3,audio/mpeg"
                  onChange={(e) => handleFileChange(index, e)}
                />
                {episode.file && (
                  <p className="text-sm text-green-600 mt-1">
                    Archivo seleccionado: {episode.file.name}
                  </p>
                )}
              </div>

              <div>
                <Label>Imagen del Episodio (Opcional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e)}
                />
                {episode.image && (
                  <p className="text-sm text-green-600 mt-1">
                    Imagen seleccionada: {episode.image.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Si no se selecciona imagen, se usará la imagen del programa
                </p>
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={addEpisode}
              disabled={episodes.length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Episodio ({episodes.length}/10)
            </Button>

            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleBulkUpload} disabled={isUploading}>
                {isUploading ? 'Subiendo...' : 'Subir Episodios'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}