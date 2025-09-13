
"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Upload, Save, Eye } from 'lucide-react'
import Image from 'next/image'

interface FeaturedProgram {
  id: string
  title: string
  description: string
  schedule: string
  imageUrl: string
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export default function FeaturedProgramsAdmin() {
  const [programs, setPrograms] = useState<FeaturedProgram[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<FeaturedProgram | null>(null)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    schedule: '',
    imageUrl: '',
    isActive: true,
    displayOrder: 0
  })

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/featured-programs')
      if (response.ok) {
        const data = await response.json()
        setPrograms(data)
      } else {
        setMessage('Error al cargar los programas destacados')
      }
    } catch (error) {
      setMessage('Error al cargar los programas destacados')
      console.error('Error fetching programs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingProgram 
        ? `/api/featured-programs/${editingProgram.id}`
        : '/api/featured-programs'
      
      const method = editingProgram ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setMessage(editingProgram ? 'Programa actualizado exitosamente' : 'Programa creado exitosamente')
        setIsDialogOpen(false)
        resetForm()
        fetchPrograms()
      } else {
        const error = await response.json()
        setMessage(error.error || 'Error al guardar el programa')
      }
    } catch (error) {
      setMessage('Error al guardar el programa')
      console.error('Error saving program:', error)
    }
  }

  const handleEdit = (program: FeaturedProgram) => {
    setEditingProgram(program)
    setFormData({
      title: program.title,
      description: program.description,
      schedule: program.schedule,
      imageUrl: program.imageUrl,
      isActive: program.isActive,
      displayOrder: program.displayOrder
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este programa destacado?')) {
      return
    }

    try {
      const response = await fetch(`/api/featured-programs/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessage('Programa eliminado exitosamente')
        fetchPrograms()
      } else {
        setMessage('Error al eliminar el programa')
      }
    } catch (error) {
      setMessage('Error al eliminar el programa')
      console.error('Error deleting program:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      schedule: '',
      imageUrl: '',
      isActive: true,
      displayOrder: 0
    })
    setEditingProgram(null)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'featured-programs')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, imageUrl: data.url }))
        setMessage('Imagen subida exitosamente')
      } else {
        setMessage('Error al subir la imagen')
      }
    } catch (error) {
      setMessage('Error al subir la imagen')
      console.error('Error uploading image:', error)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Eye className="h-8 w-8 text-purple-600" />
          Programas Destacados
        </h1>
        <p className="text-gray-600 mt-1">Gestiona los programas que aparecen en la sección destacada de la página de programación</p>
      </div>

      {message && (
        <Alert className="mb-6">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Programas Destacados</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Programa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? 'Editar Programa Destacado' : 'Nuevo Programa Destacado'}
              </DialogTitle>
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
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="schedule">Horario</Label>
                <Input
                  id="schedule"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  placeholder="ej: Lunes a Viernes 6:00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="displayOrder">Orden de Visualización</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  min="0"
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="image">Imagen del Programa</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-2"
                />
                {formData.imageUrl && (
                  <div className="relative h-32 w-32 border rounded">
                    <Image
                      src={formData.imageUrl}
                      alt="Vista previa"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <Label htmlFor="isActive">Programa Activo</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingProgram ? 'Actualizar' : 'Crear'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando programas...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Orden</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>
                      {program.imageUrl ? (
                        <div className="relative h-16 w-16">
                          <Image
                            src={program.imageUrl}
                            alt={program.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                          <Upload className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{program.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{program.description}</TableCell>
                    <TableCell>{program.schedule}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        program.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {program.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell>{program.displayOrder}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
