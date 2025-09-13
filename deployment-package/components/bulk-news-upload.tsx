"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, Plus, Calendar } from "lucide-react"
import RichTextEditor from "@/components/rich-text-editor"

interface BulkNewsData {
  title: string
  summary: string
  content: string
  category: string
  publishedAt: string
  image: File | null
}

interface BulkNewsUploadProps {
  onComplete: () => void
}

export default function BulkNewsUpload({ onComplete }: BulkNewsUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newsItems, setNewsItems] = useState<BulkNewsData[]>([
    { title: '', summary: '', content: '', category: '', publishedAt: '', image: null }
  ])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const categories = [
    'Trabajo en comisiones',
    'Trabajo en pleno',
    'Relaciones Exteriores',
    'Temas de actualidad',
    'Reformas aprobadas',
    'Foros y seminarios',
    'Reformas en DOF'
  ]

  const addNewsItem = () => {
    if (newsItems.length < 20) {
      setNewsItems([...newsItems, {
        title: '',
        summary: '',
        content: '',
        category: categories[0],
        publishedAt: new Date().toISOString().slice(0, 16), // datetime-local format
        image: null
      }])
    }
  }

  const removeNewsItem = (index: number) => {
    if (newsItems.length > 1) {
      setNewsItems(newsItems.filter((_, i) => i !== index))
    }
  }

  const updateNewsItem = (index: number, field: keyof BulkNewsData, value: string) => {
    const updated = [...newsItems]
    updated[index] = { ...updated[index], [field]: value }
    setNewsItems(updated)
  }

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const updated = [...newsItems]
      updated[index] = { ...updated[index], image: file }
      setNewsItems(updated)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'news')

    console.log('Uploading bulk news image:', file.name)
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Upload failed:', errorData)
      throw new Error(errorData.error || 'Error uploading image')
    }

    const result = await response.json()
    console.log('Bulk news image uploaded successfully:', result.imageUrl)
    return result.imageUrl
  }

  const handleBulkUpload = async () => {
    try {
      setIsUploading(true)

      // Validate all items
      const invalidItems = newsItems.filter(item => 
        !item.title.trim() || !item.summary.trim() || !item.content.trim() || 
        !item.category || !item.publishedAt || !item.image
      )

      if (invalidItems.length > 0) {
        toast({
          title: "Error de validación",
          description: "Todos los campos son obligatorios incluyendo la imagen",
          variant: "destructive"
        })
        return
      }

      // Upload all news items
      const uploadPromises = newsItems.map(async (item) => {
        let imageUrl = ''
        if (item.image) {
          imageUrl = await uploadImage(item.image)
        }

        const publishDate = new Date(item.publishedAt)
        const now = new Date()
        const status = publishDate <= now ? 'published' : 'scheduled'

        return fetch('/api/news', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: item.title,
            summary: item.summary,
            content: item.content,
            category: item.category,
            imageUrl,
            publishedAt: publishDate,
            status
          }),
        })
      })

      const results = await Promise.all(uploadPromises)
      const successful = results.filter(r => r.ok).length

      toast({
        title: "Carga masiva completada",
        description: `Se cargaron ${successful} de ${newsItems.length} noticias exitosamente`,
      })

      // Reset form
      setNewsItems([{ title: '', summary: '', content: '', category: '', publishedAt: '', image: null }])
      setIsOpen(false)
      onComplete()

    } catch (error) {
      console.error('Error in bulk upload:', error)
      toast({
        title: "Error",
        description: "Error al cargar las noticias masivamente",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Carga Masiva
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Carga Masiva de Noticias</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {newsItems.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Noticia {index + 1}</h3>
                {newsItems.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNewsItem(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateNewsItem(index, 'title', e.target.value)}
                    placeholder="Título de la noticia"
                  />
                </div>

                <div>
                  <Label>Categoría</Label>
                  <Select value={item.category} onValueChange={(value) => updateNewsItem(index, 'category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Fecha de Publicación</Label>
                  <Input
                    type="datetime-local"
                    value={item.publishedAt}
                    onChange={(e) => updateNewsItem(index, 'publishedAt', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Imagen</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e)}
                  />
                  {item.image && (
                    <p className="text-sm text-green-600 mt-1">
                      Imagen seleccionada: {item.image.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Resumen</Label>
                <Textarea
                  value={item.summary}
                  onChange={(e) => updateNewsItem(index, 'summary', e.target.value)}
                  placeholder="Resumen de la noticia"
                  rows={3}
                />
              </div>

              <div>
                <Label>Contenido</Label>
                <RichTextEditor
                  value={item.content}
                  onChange={(value) => updateNewsItem(index, 'content', value)}
                  placeholder="Contenido completo de la noticia con formato rico"
                  height={300}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={addNewsItem}
              disabled={newsItems.length >= 20}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Noticia ({newsItems.length}/20)
            </Button>

            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleBulkUpload} disabled={isUploading}>
                {isUploading ? 'Cargando...' : 'Cargar Noticias'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}