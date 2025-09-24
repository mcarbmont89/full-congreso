
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
import { Plus, Edit, Trash2, ArrowLeft, Search, FileText, Save, Upload, Download, Image, User, MessageSquare, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

const SECTION_CONFIG = {
  conoce_ley: {
    label: 'Conoce la Ley - Documento',
    icon: FileText,
    description: 'Gestiona el documento PDF del botón "Conoce la Ley"',
    fields: ['title', 'file']
  },
  defensora_profile: {
    label: 'Perfil de la Defensora',
    icon: User,
    description: 'Información, foto y biografía de la Defensora de Audiencia',
    fields: ['title', 'content', 'image']
  },
  recent_requests: {
    label: 'Solicitudes Recientes',
    icon: MessageSquare,
    description: 'Preguntas y respuestas del carrusel de solicitudes atendidas',
    fields: ['title', 'content', 'metadata']
  },
  annual_reports: {
    label: 'Informes Anuales',
    icon: Calendar,
    description: 'Informes organizados por año con documentos PDF',
    fields: ['title', 'content', 'file', 'metadata']
  }
}

export default function DefensoriaAdmin() {
  const [content, setContent] = useState<DefensoriaContent[]>([])
  const [filteredContent, setFilteredContent] = useState<DefensoriaContent[]>([])
  const [activeTab, setActiveTab] = useState('conoce_ley')
  const [showForm, setShowForm] = useState(false)
  const [editingContent, setEditingContent] = useState<DefensoriaContent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    section: '',
    title: '',
    content: '',
    image_url: '',
    file_url: '',
    metadata: {} as any,
    display_order: 0,
    is_active: true
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    loadContent()
  }, [])

  // Filter content by active tab
  useEffect(() => {
    let filtered = content.filter(item => item.section === activeTab)

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredContent(filtered)
  }, [content, activeTab, searchTerm])

  const loadContent = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/defensoria-audiencia?admin=true')

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

  const handleMetadataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)

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
      finalFormData.section = activeTab

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
      metadata: item.metadata || {},
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
      section: activeTab,
      title: '',
      content: '',
      image_url: '',
      file_url: '',
      metadata: {},
      display_order: 0,
      is_active: true
    })
    setEditingContent(null)
    setSelectedFile(null)
    setImagePreview('')
    setShowForm(false)
  }

  const renderFormFields = () => {
    const config = SECTION_CONFIG[activeTab as keyof typeof SECTION_CONFIG]
    
    return (
      <div className="space-y-6">
        {/* Title Field */}
        <div>
          <Label htmlFor="title">
            {activeTab === 'defensora_profile' ? 'Nombre de la Defensora' : 
             activeTab === 'conoce_ley' ? 'Nombre del Documento' :
             activeTab === 'recent_requests' ? 'Título de la Solicitud' :
             activeTab === 'annual_reports' ? 'Nombre del Informe' : 'Título'}
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder={
              activeTab === 'defensora_profile' ? 'Ej: Mtra. María Gabriela Ortiz Portilla' :
              activeTab === 'conoce_ley' ? 'Ej: Ley de Defensoría de Audiencia 2024' :
              activeTab === 'recent_requests' ? 'Ej: Mejora en la Calidad de Audio' :
              activeTab === 'annual_reports' ? 'Ej: Informe Anual 2024' : 'Título'
            }
            required
          />
        </div>

        {/* Content Field */}
        {config.fields.includes('content') && (
          <div>
            <Label htmlFor="content">
              {activeTab === 'defensora_profile' ? 'Biografía' :
               activeTab === 'recent_requests' ? 'Descripción de la Solicitud' :
               activeTab === 'annual_reports' ? 'Descripción del Informe' : 'Contenido'}
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder={
                activeTab === 'defensora_profile' ? 'Biografía profesional, educación, trayectoria...' :
                activeTab === 'recent_requests' ? 'Detalle de la solicitud y cómo se atendió...' :
                activeTab === 'annual_reports' ? 'Resumen ejecutivo del informe...' : 'Descripción'
              }
              rows={activeTab === 'defensora_profile' ? 8 : 4}
            />
          </div>
        )}

        {/* Metadata Fields for Recent Requests */}
        {activeTab === 'recent_requests' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="request_type">Tipo de Solicitud</Label>
                <Select 
                  value={formData.metadata?.type || ''} 
                  onValueChange={(value) => handleMetadataChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Queja">Queja</SelectItem>
                    <SelectItem value="Sugerencia">Sugerencia</SelectItem>
                    <SelectItem value="Felicitaciones">Felicitaciones</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="request_date">Fecha de Atención</Label>
                <Input
                  id="request_date"
                  type="date"
                  value={formData.metadata?.date || ''}
                  onChange={(e) => handleMetadataChange('date', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="request_status">Estado</Label>
              <Select 
                value={formData.metadata?.status || ''} 
                onValueChange={(value) => handleMetadataChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Resuelto">Resuelto</SelectItem>
                  <SelectItem value="En proceso">En proceso</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="request_description">Acción Tomada</Label>
              <Textarea
                id="request_description"
                value={formData.metadata?.description || ''}
                onChange={(e) => handleMetadataChange('description', e.target.value)}
                placeholder="Descripción de las acciones implementadas para resolver la solicitud..."
                rows={3}
              />
            </div>
          </>
        )}

        {/* Metadata Fields for Annual Reports */}
        {activeTab === 'annual_reports' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="report_year">Año del Informe</Label>
                <Input
                  id="report_year"
                  type="number"
                  min="2019"
                  max="2030"
                  value={formData.metadata?.year || new Date().getFullYear()}
                  onChange={(e) => handleMetadataChange('year', parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="report_type">Tipo de Informe</Label>
                <Select 
                  value={formData.metadata?.reportType || ''} 
                  onValueChange={(value) => handleMetadataChange('reportType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Informe Anual">Informe Anual</SelectItem>
                    <SelectItem value="Plan de Trabajo">Plan de Trabajo</SelectItem>
                    <SelectItem value="Informe Trimestral">Informe Trimestral</SelectItem>
                    <SelectItem value="Reporte Especial">Reporte Especial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="report_period">Período</Label>
              <Input
                id="report_period"
                value={formData.metadata?.period || ''}
                onChange={(e) => handleMetadataChange('period', e.target.value)}
                placeholder="Ej: Enero - Diciembre 2024"
              />
            </div>
          </>
        )}

        {/* File Upload */}
        {config.fields.includes('file') && (
          <div>
            <Label htmlFor="file">
              {activeTab === 'conoce_ley' ? 'Documento PDF' :
               activeTab === 'annual_reports' ? 'Archivo del Informe (PDF)' : 'Archivo'}
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileSelect}
              accept={activeTab === 'conoce_ley' || activeTab === 'annual_reports' ? '.pdf' : '*'}
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">
                Archivo seleccionado: {selectedFile.name}
              </p>
            )}
          </div>
        )}

        {/* Image Upload */}
        {config.fields.includes('image') && (
          <div>
            <Label htmlFor="image">Foto de la Defensora</Label>
            <Input
              id="image"
              type="file"
              onChange={handleFileSelect}
              accept="image/*"
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="max-w-xs h-32 object-cover rounded" />
              </div>
            )}
          </div>
        )}

        {/* Display Order */}
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

        {/* Active Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => handleInputChange('is_active', checked)}
          />
          <Label htmlFor="is_active">Contenido activo</Label>
        </div>
      </div>
    )
  }

  const getSectionBadge = (section: string) => {
    const colors = {
      conoce_ley: 'bg-blue-100 text-blue-800',
      defensora_profile: 'bg-purple-100 text-purple-800',
      recent_requests: 'bg-green-100 text-green-800',
      annual_reports: 'bg-orange-100 text-orange-800'
    }

    return (
      <Badge className={colors[section as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {SECTION_CONFIG[section as keyof typeof SECTION_CONFIG]?.label || section}
      </Badge>
    )
  }

  if (showForm) {
    const config = SECTION_CONFIG[activeTab as keyof typeof SECTION_CONFIG]
    const Icon = config.icon

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={resetForm}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Icon className="w-6 h-6 text-purple-600" />
          <h1 className="text-3xl font-bold">
            {editingContent ? 'Editar' : 'Nuevo'} - {config.label}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icon className="w-5 h-5" />
              <span>{config.label}</span>
            </CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {renderFormFields()}
              
              <div className="flex justify-end space-x-2 mt-6">
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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(SECTION_CONFIG).map(([key, config]) => {
            const Icon = config.icon
            return (
              <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{config.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {Object.entries(SECTION_CONFIG).map(([key, config]) => {
          const Icon = config.icon
          const sectionContent = filteredContent

          return (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-6 h-6 text-purple-600" />
                      <div>
                        <CardTitle>{config.label}</CardTitle>
                        <CardDescription>{config.description}</CardDescription>
                      </div>
                    </div>
                    <Button onClick={() => { setActiveTab(key); setShowForm(true) }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder={`Buscar en ${config.label.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : sectionContent.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Icon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">No hay contenido</h3>
                      <p>Agregue el primer elemento para {config.label.toLowerCase()}.</p>
                      <Button className="mt-4" onClick={() => setShowForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar {config.label}
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Estado</TableHead>
                            {key === 'annual_reports' && <TableHead>Año</TableHead>}
                            {key === 'recent_requests' && <TableHead>Tipo</TableHead>}
                            <TableHead>Última Actualización</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sectionContent.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">
                                <div>
                                  <p>{item.title}</p>
                                  {item.content && (
                                    <p className="text-sm text-gray-500 truncate max-w-xs">
                                      {item.content.replace(/<[^>]*>/g, '').slice(0, 60)}...
                                    </p>
                                  )}
                                  {item.file_url && (
                                    <div className="flex items-center mt-1">
                                      <FileText className="w-3 h-3 mr-1 text-blue-600" />
                                      <span className="text-xs text-blue-600">Archivo adjunto</span>
                                    </div>
                                  )}
                                  {item.image_url && (
                                    <div className="flex items-center mt-1">
                                      <Image className="w-3 h-3 mr-1 text-green-600" />
                                      <span className="text-xs text-green-600">Imagen adjunta</span>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={item.is_active ? "default" : "secondary"}>
                                  {item.is_active ? 'Activo' : 'Inactivo'}
                                </Badge>
                              </TableCell>
                              {key === 'annual_reports' && (
                                <TableCell>
                                  <Badge className="bg-orange-100 text-orange-800">
                                    {item.metadata?.year || 'N/A'}
                                  </Badge>
                                </TableCell>
                              )}
                              {key === 'recent_requests' && (
                                <TableCell>
                                  <Badge className="bg-blue-100 text-blue-800">
                                    {item.metadata?.type || 'N/A'}
                                  </Badge>
                                </TableCell>
                              )}
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
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
