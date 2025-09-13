"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Upload } from "lucide-react"
import Image from "next/image"

interface RadioProgram {
  id: string
  title: string
  description: string
  imageUrl: string
  latestEpisode: {
    title: string
    date: string
    duration: string
    description: string
  }
  programLink: string
  episodesLink: string
  category?: string
  displayOrder?: number
  featured?: boolean
}

export default function RadioProgramsAdmin() {
  const [programs, setPrograms] = useState<RadioProgram[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<RadioProgram | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    episodeTitle: '',
    episodeDate: '',
    episodeDuration: '',
    episodeDescription: '',
    
    category: '',
    displayOrder: 0,
    featured: false
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    try {
      const response = await fetch('/api/radio/programs')
      if (!response.ok) throw new Error('Failed to fetch programs')
      const data = await response.json()
      setPrograms(data)
    } catch (error) {
      console.error('Error loading programs:', error)
      setPrograms([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      let imageUrl = formData.imageUrl

      // If there's a selected file, upload it first
      if (selectedFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedFile)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || 'Failed to upload image')
        }

        const uploadResult = await uploadResponse.json()
        imageUrl = uploadResult.imageUrl
      }

      const programData = {
        title: formData.title,
        description: formData.description,
        imageUrl,
        latestEpisode: {
          title: formData.episodeTitle,
          date: formData.episodeDate,
          duration: formData.episodeDuration,
          description: formData.episodeDescription
        },
        
        category: formData.category,
        displayOrder: formData.displayOrder,
        featured: formData.featured
      }

      const method = editingProgram ? 'PUT' : 'POST'
      const url = editingProgram ? `/api/radio/programs/${editingProgram.id}` : '/api/radio/programs'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(programData)
      })

      if (!response.ok) {
        throw new Error('Failed to save program')
      }

      setIsDialogOpen(false)
      resetForm()
      loadPrograms()
    } catch (error) {
      console.error('Error saving program:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error al guardar el programa: ${errorMessage}`)
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      episodeTitle: '',
      episodeDate: '',
      episodeDuration: '',
      episodeDescription: '',
      
      category: '',
      displayOrder: 0,
      featured: false
    })
    setSelectedFile(null)
    setEditingProgram(null)
  }

  const handleEdit = (program: RadioProgram) => {
    setEditingProgram(program)
    setFormData({
      title: program.title,
      description: program.description,
      imageUrl: program.imageUrl,
      episodeTitle: program.latestEpisode.title,
      episodeDate: program.latestEpisode.date,
      episodeDuration: program.latestEpisode.duration,
      episodeDescription: program.latestEpisode.description,
      
      category: program.category || '',
      displayOrder: program.displayOrder || 0,
      featured: program.featured || false
    })
    setSelectedFile(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este programa de radio?')) {
      try {
        const response = await fetch(`/api/radio/programs/${id}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to delete program')
        }

        loadPrograms()
      } catch (error) {
        console.error('Error deleting program:', error)
        alert('Error al eliminar el programa')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setFormData({ ...formData, imageUrl: previewUrl })
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Programas de Radio</h1>
          <p className="text-gray-600">Gestiona los programas de Radio Congreso</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Programa
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? 'Editar Programa' : 'Nuevo Programa'}
              </DialogTitle>
              <DialogDescription>
                Completa la información del programa de radio.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título del Programa</Label>
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
                <Label htmlFor="imageFile">Imagen del Programa</Label>
                <div className="space-y-2">
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!editingProgram && !formData.imageUrl}
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

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Último Episodio</h4>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="episodeTitle">Título del Episodio</Label>
                    <Input
                      id="episodeTitle"
                      value={formData.episodeTitle}
                      onChange={(e) => setFormData({ ...formData, episodeTitle: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="episodeDate">Fecha</Label>
                      <Input
                        id="episodeDate"
                        value={formData.episodeDate}
                        onChange={(e) => setFormData({ ...formData, episodeDate: e.target.value })}
                        placeholder="ej: martes, 25 de marzo de 2025"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="episodeDuration">Duración</Label>
                      <Input
                        id="episodeDuration"
                        value={formData.episodeDuration}
                        onChange={(e) => setFormData({ ...formData, episodeDuration: e.target.value })}
                        placeholder="ej: 60MIN"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="episodeDescription">Descripción del Episodio</Label>
                    <Textarea
                      id="episodeDescription"
                      value={formData.episodeDescription}
                      onChange={(e) => setFormData({ ...formData, episodeDescription: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Configuración del Programa</h4>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="featured" className="text-sm font-medium">
                      Programa Destacado
                    </Label>
                    <span className="text-xs text-gray-500 ml-2">
                      (Aparecerá en la sección "Programas Destacados")
                    </span>
                  </div>

                  
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    editingProgram ? 'Actualizar' : 'Crear'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Programas de Radio</CardTitle>
          <CardDescription>
            {programs.length} programas configurados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>Programa</TableHead>
                <TableHead>Último Episodio</TableHead>
                <TableHead>Destacado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell>
                    <Image
                      src={program.imageUrl}
                      alt={program.title}
                      width={60}
                      height={40}
                      className="rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{program.title}</p>
                      <p className="text-sm text-gray-600">{program.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{program.latestEpisode.title}</p>
                      <p className="text-xs text-gray-500">{program.latestEpisode.date}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={program.featured || false}
                        onChange={async (e) => {
                          try {
                            const response = await fetch(`/api/radio/programs/${program.id}`, {
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                featured: e.target.checked
                              }),
                            })
                            if (response.ok) {
                              // Update the local state instead of reloading
                              setPrograms(prevPrograms => 
                                prevPrograms.map(p => 
                                  p.id === program.id 
                                    ? { ...p, featured: e.target.checked }
                                    : p
                                )
                              )
                            } else {
                              throw new Error('Failed to update featured status')
                            }
                          } catch (error) {
                            console.error('Error updating featured status:', error)
                            alert('Error al actualizar el estado destacado')
                            // Revert the checkbox state
                            e.target.checked = !e.target.checked
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">
                        {program.featured ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(program)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(program.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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