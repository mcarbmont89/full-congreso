
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Upload, Download, Trash2, FileText, Edit, Eye } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"

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
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function DatasetsAdmin() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDataset, setEditingDataset] = useState<Dataset | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'legislativo',
    updateFrequency: 'Mensual',
    formats: 'CSV, JSON, XLSX',
    displayOrder: 0,
    isActive: true
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadDatasets()
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
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      
      if (!allowedTypes.includes(fileExtension)) {
        setMessage('Solo se permiten archivos PDF, DOC, DOCX, XLS, XLSX, CSV')
        return
      }

      if (file.size > 50 * 1024 * 1024) {
        setMessage('El archivo no puede ser mayor a 50MB')
        return
      }

      setSelectedFile(file)
      setMessage('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingDataset && !selectedFile) {
      setMessage('Por favor selecciona un archivo')
      return
    }

    setIsUploading(true)
    try {
      let fileUrl = editingDataset?.file_url || ''
      let fileName = editingDataset?.file_name || ''
      let fileSize = editingDataset?.file_size || 0
      let fileType = editingDataset?.file_type || ''

      if (selectedFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedFile)
        uploadFormData.append('type', 'documents')

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })

        if (!uploadResponse.ok) {
          throw new Error('Error uploading file')
        }

        const uploadResult = await uploadResponse.json()
        fileUrl = uploadResult.url
        fileName = selectedFile.name
        fileSize = selectedFile.size
        fileType = selectedFile.name.split('.').pop()?.toLowerCase() || ''
      }

      const datasetData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        updateFrequency: formData.updateFrequency,
        lastUpdated: new Date().toISOString(),
        formats: formData.formats,
        fileUrl,
        fileName,
        fileSize,
        fileType,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive
      }

      const url = editingDataset ? `/api/datasets/${editingDataset.id}` : '/api/datasets'
      const method = editingDataset ? 'PUT' : 'POST'

      const saveResponse = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datasetData)
      })

      if (saveResponse.ok) {
        setMessage(editingDataset ? 'Dataset actualizado exitosamente' : 'Dataset creado exitosamente')
        setIsDialogOpen(false)
        resetForm()
        loadDatasets()
      } else {
        throw new Error('Error saving dataset')
      }
    } catch (error) {
      setMessage('Error al guardar el dataset: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (dataset: Dataset) => {
    setEditingDataset(dataset)
    setFormData({
      title: dataset.title,
      description: dataset.description,
      category: dataset.category,
      updateFrequency: dataset.update_frequency,
      formats: dataset.formats,
      displayOrder: dataset.display_order,
      isActive: dataset.is_active
    })
    setSelectedFile(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este dataset?')) return

    try {
      const response = await fetch(`/api/datasets/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessage('Dataset eliminado exitosamente')
        loadDatasets()
      }
    } catch (error) {
      setMessage('Error al eliminar el dataset')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'legislativo',
      updateFrequency: 'Mensual',
      formats: 'CSV, JSON, XLSX',
      displayOrder: 0,
      isActive: true
    })
    setSelectedFile(null)
    setEditingDataset(null)
    setMessage('')
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Datos Abiertos</h1>
          <p className="text-gray-600">Administra los datasets disponibles para descarga pública</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Dataset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingDataset ? 'Editar Dataset' : 'Nuevo Dataset'}</DialogTitle>
              <DialogDescription>
                Sube archivos Excel, Word, PDF o CSV para datos abiertos
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título del Dataset</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Ej: Asistencias de Legisladores"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Describe el contenido y propósito de este dataset"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="legislativo">Legislativo</option>
                      <option value="parlamentario">Parlamentario</option>
                      <option value="presupuesto">Presupuesto</option>
                      <option value="transparencia">Transparencia</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="updateFrequency">Frecuencia de Actualización</Label>
                    <select
                      id="updateFrequency"
                      value={formData.updateFrequency}
                      onChange={(e) => setFormData({ ...formData, updateFrequency: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="Diario">Diario</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Quincenal">Quincenal</option>
                      <option value="Mensual">Mensual</option>
                      <option value="Trimestral">Trimestral</option>
                      <option value="Anual">Anual</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="formats">Formatos Disponibles</Label>
                    <Input
                      id="formats"
                      value={formData.formats}
                      onChange={(e) => setFormData({ ...formData, formats: e.target.value })}
                      placeholder="CSV, JSON, XLSX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="displayOrder">Orden de Visualización</Label>
                    <Input
                      id="displayOrder"
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Activo (visible en el sitio público)</Label>
                </div>
                <div>
                  <Label htmlFor="file">Archivo del Dataset</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      Archivo: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                  {editingDataset && !selectedFile && (
                    <p className="text-sm text-green-600 mt-1">
                      Archivo actual: {editingDataset.file_name}
                    </p>
                  )}
                </div>
              </div>
              {message && (
                <Alert className="mt-4">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isUploading}>
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? 'Guardando...' : editingDataset ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <Alert className="mb-4">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Datasets</CardTitle>
          <CardDescription>
            Lista de todos los datasets disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Archivo</TableHead>
                <TableHead>Actualización</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets.map((dataset) => (
                <TableRow key={dataset.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{dataset.title}</div>
                      {dataset.description && (
                        <div className="text-sm text-gray-600 line-clamp-2">{dataset.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {dataset.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-600" />
                      <div className="text-sm">
                        <div>{dataset.file_name}</div>
                        <div className="text-gray-500">{formatFileSize(dataset.file_size)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{dataset.update_frequency}</div>
                      <div className="text-gray-500">
                        {new Date(dataset.last_updated).toLocaleDateString('es-MX')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      dataset.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {dataset.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(dataset)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(dataset.file_url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = dataset.file_url
                          link.download = dataset.file_name
                          link.click()
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(dataset.id)}
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
