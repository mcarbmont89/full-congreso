"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Upload, ArrowUp, ArrowDown } from "lucide-react"
import { fetchPrograms, createProgram, updateProgram, deleteProgram, reorderProgram, type Program } from "@/lib/api-client"
import Image from "next/image"

export default function ProgramsAdmin() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    url: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    try {
      const data = await fetchPrograms()
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
        url: formData.url || ''
      }

      if (editingProgram) {
        await updateProgram(editingProgram.id, programData)
      } else {
        await createProgram(programData)
      }

      setIsDialogOpen(false)
      setFormData({ title: '', description: '', imageUrl: '', url: '' })
      setSelectedFile(null)
      loadPrograms()
    } catch (error) {
      console.error('Error saving program:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error al guardar el programa: ${errorMessage}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (program: Program) => {
    setEditingProgram(program)
    setFormData({
      title: program.title,
      description: program.description,
      imageUrl: program.imageUrl,
      url: program.url || ''
    })
    setSelectedFile(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este programa?')) {
      try {
        await deleteProgram(id)
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

  const handleReorder = async (programId: string, direction: 'up' | 'down') => {
    try {
      await reorderProgram(programId, direction)
      loadPrograms() // Reload to show new order
    } catch (error) {
      console.error('Error reordering program:', error)
      alert('Error al reordenar el programa')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Programación</h1>
          <p className="text-gray-600">Gestiona los programas de televisión</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProgram(null)
              setFormData({ title: '', description: '', imageUrl: '', url: '' })
              setSelectedFile(null)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Programa
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? 'Editar Programa' : 'Nuevo Programa'}
              </DialogTitle>
              <DialogDescription>
                Completa la información del programa.
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

              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Subiendo...
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
          <CardTitle>Lista de Programas</CardTitle>
          <CardDescription>
            {programs.length} programas configurados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Imagen</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((program, index) => (
                <TableRow key={program.id}>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(program.id, 'up')}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(program.id, 'down')}
                        disabled={index === programs.length - 1}
                        className="h-8 w-8 p-0"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Image
                      src={program.imageUrl}
                      alt={program.title}
                      width={60}
                      height={40}
                      className="rounded object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{program.title}</TableCell>
                  <TableCell>{program.description}</TableCell>
                  <TableCell>{program.url}</TableCell>
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