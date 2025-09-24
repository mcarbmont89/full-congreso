"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, ArrowLeft, Search, FileText, Save, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface DefensoriaContent {
  id: string
  section: string
  title: string
  content?: string
  image_url?: string
  file_url?: string
  metadata?: any
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

const SECTION_LABELS = {
  defensora_info: 'Información de la Defensora',
  recent_requests: 'Solicitudes Recientes',
  reports: 'Informes y Documentos',
  site_files: 'Archivos del Sitio (Botón "Conoce tu Ley")'
}

const SECTION_OPTIONS = Object.entries(SECTION_LABELS).map(([value, label]) => ({
  value,
  label
}))

export default function DefensoriaAdmin() {
  const [content, setContent] = useState<DefensoriaContent[]>([])
  const [filteredContent, setFilteredContent] = useState<DefensoriaContent[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingContent, setEditingContent] = useState<DefensoriaContent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSection, setSelectedSection] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [formData, setFormData] = useState({
    section: '',
    title: '',
    content: '',
    image_url: '',
    file_url: '',
    metadata: null as any,
    display_order: 0,
    is_active: true
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    loadContent()
  }, [])

  // Filter and search functionality
  useEffect(() => {
    let filtered = content

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.section.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Section filter
    if (selectedSection !== 'all') {
      filtered = filtered.filter(item => item.section === selectedSection)
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => 
        selectedStatus === 'active' ? item.is_active : !item.is_active
      )
    }

    setFilteredContent(filtered)
  }, [content, searchTerm, selectedSection, selectedStatus])

  const loadContent = async () => {
    setIsLoading(true)
    try {
      // Include admin=true parameter to get all content including inactive
      const response = await fetch('/api/defensoria-audiencia?admin=true')

      if (response.status === 401) {
        toast({
          title: "Sesión expirada",
          description: "Por favor, inicie sesión nuevamente",
          variant: "destructive"
        })
        // Redirect to login
        window.location.href = '/login'
        return
      }

      if (response.status === 403) {
        toast({
          title: "Acceso denegado",
          description: "No tiene permisos de administrador",
          variant: "destructive"
        })
        return
      }

      if (response.ok) {
        const data = await response.json()
        setContent(data)
      } else {
        toast({
          title: "Error",
          description: "Error al cargar el contenido",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error loading content:', error)
      toast({
        title: "Error",
        description: "Error de conexión al cargar el contenido",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        return result.url
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let finalFormData = { ...formData }

      // Upload file if selected
      if (selectedFile) {
        const uploadedUrl = await uploadFile(selectedFile)
        if (uploadedUrl) {
          if (selectedFile.type.startsWith('image/')) {
            finalFormData.image_url = uploadedUrl
          } else {
            finalFormData.file_url = uploadedUrl
          }
        }
      }

      const url = '/api/defensoria-audiencia'
      const method = editingContent ? 'PUT' : 'POST'

      const requestData = editingContent 
        ? { ...finalFormData, id: editingContent.id }
        : finalFormData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (response.status === 401) {
        toast({
          title: "Sesión expirada",
          description: "Por favor, inicie sesión nuevamente",
          variant: "destructive"
        })
        window.location.href = '/login'
        return
      }

      if (response.status === 403) {
        toast({
          title: "Acceso denegado",
          description: "No tiene permisos de administrador",
          variant: "destructive"
        })
        return
      }

      if (response.ok) {
        toast({
          title: "Éxito",
          description: editingContent ? "Contenido actualizado" : "Contenido creado"
        })

        resetForm()
        loadContent()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Error al guardar el contenido",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (item: DefensoriaContent) => {
    setEditingContent(item)
    setFormData({
      section: item.section,
      title: item.title,
      content: item.content || '',
      image_url: item.image_url || '',
      file_url: item.file_url || '',
      metadata: item.metadata,
      display_order: item.display_order,
      is_active: item.is_active
    })
    setImagePreview(item.image_url || '')
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este contenido?')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/defensoria-audiencia?id=${id}`, {
        method: 'DELETE'
      })

      if (response.status === 401) {
        toast({
          title: "Sesión expirada",
          description: "Por favor, inicie sesión nuevamente",
          variant: "destructive"
        })
        window.location.href = '/login'
        return
      }

      if (response.status === 403) {
        toast({
          title: "Acceso denegado",
          description: "No tiene permisos de administrador",
          variant: "destructive"
        })
        return
      }

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Contenido eliminado"
        })
        loadContent()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Error al eliminar el contenido",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      section: '',
      title: '',
      content: '',
      image_url: '',
      file_url: '',
      metadata: null,
      display_order: 0,
      is_active: true
    })
    setEditingContent(null)
    setSelectedFile(null)
    setImagePreview('')
    setShowForm(false)
  }

  const getSectionBadge = (section: string) => {
    const colors = {
      defensora_info: 'bg-purple-100 text-purple-800',
      recent_requests: 'bg-blue-100 text-blue-800',
      reports: 'bg-green-100 text-green-800'
    }

    return (
      <Badge className={colors[section as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {SECTION_LABELS[section as keyof typeof SECTION_LABELS] || section}
      </Badge>
    )
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={resetForm}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">
            {editingContent ? 'Editar Contenido' : 'Nuevo Contenido'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Contenido</CardTitle>
            <CardDescription>
              Complete los campos para {editingContent ? 'actualizar' : 'crear'} el contenido de la Defensoría
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="section">Sección</Label>
                  <Select value={formData.section} onValueChange={(value) => handleInputChange('section', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una sección" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTION_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="display_order">Orden de Visualización</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                    placeholder="Orden (0 = primero)"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Título del contenido"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Contenido</Label>
                {formData.section === 'defensora_info' ? (
                  <div className="border rounded-lg">
                    <div className="p-3 border-b bg-gray-50">
                      <p className="text-sm text-gray-600">
                        Editor de texto enriquecido para información de la defensora
                      </p>
                    </div>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Información biografica, trayectoria profesional, etc."
                      rows={10}
                      className="border-0 rounded-none"
                    />
                  </div>
                ) : (
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder={
                      formData.section === 'site_files' 
                        ? 'Descripción del archivo (opcional)' 
                        : formData.section === 'recent_requests'
                        ? 'Descripción detallada de la solicitud atendida'
                        : formData.section === 'reports'
                        ? 'Resumen ejecutivo del informe'
                        : 'Contenido HTML permitido'
                    }
                    rows={6}
                  />
                )}

                {formData.section === 'site_files' && (
                  <p className="text-sm text-gray-500 mt-1">
                    Para archivos del botón "Conoce tu Ley". Solo debe haber un archivo activo por vez.
                  </p>
                )}

                {formData.section === 'recent_requests' && (
                  <p className="text-sm text-blue-600 mt-1">
                    Tip: Incluya fecha, tipo de solicitud, y resultado obtenido.
                  </p>
                )}

                {formData.section === 'reports' && (
                  <p className="text-sm text-green-600 mt-1">
                    Tip: Agregue un resumen ejecutivo que motive la descarga del documento completo.
                  </p>
                )}
              </div>

              {/* Content Preview */}
              {formData.content && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-sm font-medium text-gray-700">Vista Previa:</Label>
                  <div 
                    className="mt-2 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: formData.content.slice(0, 200) + '...' }}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="file">Archivo (Imagen o Documento)</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="max-w-xs h-32 object-cover rounded" />
                  </div>
                )}
                {selectedFile && !selectedFile.type.startsWith('image/') && (
                  <div className="mt-2 text-sm text-gray-600">
                    Archivo seleccionado: {selectedFile.name}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="image_url">URL de Imagen (alternativo)</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  placeholder="URL de imagen"
                />
              </div>

              <div>
                <Label htmlFor="file_url">URL de Archivo (alternativo)</Label>
                <Input
                  id="file_url"
                  value={formData.file_url}
                  onChange={(e) => handleInputChange('file_url', e.target.value)}
                  placeholder="URL de archivo descargable"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Contenido activo</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Guardando...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingContent ? 'Actualizar' : 'Crear'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Defensoría de Audiencia</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Contenido
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar contenido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por sección" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las secciones</SelectItem>
                {SECTION_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contenido de Defensoría</CardTitle>
          <CardDescription>
            Gestione el contenido de la página de Defensoría de Audiencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No hay contenido</h3>
              <p>No se encontró contenido que coincida con los filtros seleccionados.</p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear primer contenido
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Sección</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Orden</TableHead>
                    <TableHead>Última Actualización</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{item.title}</p>
                          {item.content && (
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {item.content.replace(/<[^>]*>/g, '').slice(0, 60)}...
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getSectionBadge(item.section)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.is_active ? "default" : "secondary"}>
                          {item.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.display_order}</TableCell>
                      <TableCell>
                        {new Date(item.updated_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}