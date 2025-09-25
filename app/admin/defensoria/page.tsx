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
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DefensoriaContent {
  id: string | number; // Changed to string | number to accommodate potential API responses
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
  const [formData, setFormData] = useState<Omit<DefensoriaContent, 'id' | 'created_at' | 'updated_at'>>({
    section: 'conoce_ley',
    title: '',
    content: '',
    image_url: '',
    file_url: '',
    metadata: {},
    display_order: 0,
    is_active: true
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [editingId, setEditingId] = useState<string | number | null>(null)

  // New state for handling PDF and Word files specifically for Annual Reports
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null)
  const [selectedWordFile, setSelectedWordFile] = useState<File | null>(null)
  const [uploadMessage, setUploadMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)


  const getSectionPlaceholder = (section: string, field: string) => {
    const placeholders: Record<string, Record<string, string>> = {
      conoce_ley: {
        title: 'Conoce la Ley',
        content: 'Descripción del documento'
      },
      defensora_profile: {
        title: 'Mtra. Sandra Luz Hernández Bernal',
        content: 'Biografía de la defensora...'
      },
      recent_requests: {
        title: 'Pregunta frecuente',
        content: 'Use los campos específicos abajo'
      },
      annual_reports: {
        title: 'Informe 2024',
        content: 'Descripción del informe'
      }
    }
    return placeholders[section]?.[field] || ''
  }

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

  // New handler for Annual Report file selection
  const handleAnnualReportFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'pdf' | 'word') => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = fileType === 'pdf' 
        ? ['.pdf'] 
        : ['.doc', '.docx']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

      if (!allowedTypes.includes(fileExtension)) {
        setDialogMessage(`Solo se permiten archivos ${fileType === 'pdf' ? 'PDF' : 'Word (DOC, DOCX)'}`)
        return
      }

      if (file.size > 50 * 1024 * 1024) {
        setDialogMessage('El archivo no puede ser mayor a 50MB')
        return
      }

      if (fileType === 'pdf') {
        setSelectedPdfFile(file)
      } else {
        setSelectedWordFile(file)
      }
      setDialogMessage('')
    }
  }

  const uploadFile = async (file: File): Promise<string> => {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('type', 'documents') // Assuming 'documents' is the correct type for API

    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData
    })

    if (!uploadResponse.ok) {
      throw new Error(`Error uploading ${file.name}`)
    }

    const uploadResult = await uploadResponse.json()
    return uploadResult.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Specific validation for annual reports
    if (activeTab === 'annual_reports') {
      if (!formData.title || !formData.content) { // Title is now year, content is description
        setDialogMessage('Por favor completa el año y la descripción del informe')
        return
      }
      if (!selectedPdfFile && !selectedWordFile && !editingId) {
        // Allow submission if editing and no new files are selected, but require at least one file if creating
        setDialogMessage('Por favor, selecciona al menos un archivo PDF o Word para el informe')
        return
      }
    } else {
      // Generic validation for other sections
      if (!formData.title) {
        setDialogMessage('Por favor, introduce un título')
        return
      }
    }


    setIsUploading(true)
    try {
      let finalFileUrl = formData.file_url
      let finalImageUrl = formData.image_url
      let pdfUrl = ''
      let wordUrl = ''

      // Handle file uploads for annual reports
      if (activeTab === 'annual_reports') {
        if (selectedPdfFile) {
          pdfUrl = await uploadFile(selectedPdfFile)
        }
        if (selectedWordFile) {
          wordUrl = await uploadFile(selectedWordFile)
        }

        // Preserve existing URLs if no new files are uploaded for editing
        if (editingId) {
          const currentItem = content.find(item => item.id === editingId);
          pdfUrl = pdfUrl || currentItem?.metadata?.pdfUrl || ''
          wordUrl = wordUrl || currentItem?.metadata?.wordUrl || ''
        }

        // Update formData for annual reports section
        formData.metadata = {
          ...(formData.metadata || {}),
          year: formData.title, // Year is now in title field for annual reports
          description: formData.content, // Description is in content field
          period: formData.metadata?.period,
          reportType: formData.metadata?.reportType,
          pdfUrl: pdfUrl,
          wordUrl: wordUrl
        };
        // Clear selected files after successful upload
        setSelectedPdfFile(null)
        setSelectedWordFile(null)

      } else {
        // Handle file upload for other sections (like 'conoce_ley' or 'defensora_profile')
        if (selectedFile) {
          const uploadedUrl = await uploadFile(selectedFile)
          if (uploadedUrl) {
            if (selectedFile.type.startsWith('image/')) {
              finalImageUrl = uploadedUrl
            } else {
              finalFileUrl = uploadedUrl
            }
          }
        }
        // Update formData with potentially new image/file URLs
        formData.image_url = finalImageUrl
        formData.file_url = finalFileUrl
      }


      const url = editingId
        ? `/api/defensoria-audiencia/${editingId}` // Use dynamic ID for PUT
        : '/api/defensoria-audiencia'

      const method = editingId ? 'PUT' : 'POST'
      const payload = { ...formData, section: activeTab, file_url: finalFileUrl, image_url: finalImageUrl }

      // Adjust payload for annual reports to use metadata fields correctly
      if (activeTab === 'annual_reports') {
        payload.title = formData.metadata?.year || formData.title; // Ensure title is year
        payload.content = formData.metadata?.description || formData.content; // Ensure content is description
        payload.file_url = formData.metadata?.pdfUrl; // Use pdfUrl from metadata
        payload.image_url = formData.metadata?.wordUrl; // This mapping seems incorrect, assuming image_url is not used for word docs
        // If word docs should also have a specific URL field, it needs to be added to DefensoriaContent interface and handled here.
        // For now, let's assume wordUrl is also part of metadata and not directly mapped to image_url.
        // If wordUrl needs to be accessible, it should be added to the UI and handled separately.
        // Re-evaluating: The new structure uses metadata.pdfUrl and metadata.wordUrl.
        // The original `formData.file_url` and `formData.image_url` might be remnants or for other sections.
        // Let's ensure annual_reports uses the metadata correctly.

        payload.metadata = {
          year: formData.metadata?.year,
          description: formData.metadata?.description,
          period: formData.metadata?.period,
          reportType: formData.metadata?.reportType,
          pdfUrl: pdfUrl || formData.metadata?.pdfUrl, // Use newly uploaded or existing
          wordUrl: wordUrl || formData.metadata?.wordUrl // Use newly uploaded or existing
        };
        // Ensure title and content are set correctly for the table view if needed by backend schema
        payload.title = formData.metadata?.year || '';
        payload.content = formData.metadata?.description || '';
        payload.file_url = pdfUrl || formData.metadata?.pdfUrl; // Use PDF URL for file_url if available
        // The original code didn't explicitly handle a separate URL for Word docs in the main fields.
        // The new structure stores wordUrl in metadata.
      }


      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: editingId ? "Contenido actualizado" : "Contenido creado"
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
      setIsUploading(false)
      // Clear dialog message after submission attempt
      setDialogMessage('')
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
    setEditingId(null)
    // Reset annual report specific files and messages
    setSelectedPdfFile(null)
    setSelectedWordFile(null)
    setDialogMessage('')
    setIsDialogOpen(false)
  }

  const handleEdit = (item: DefensoriaContent) => {
    setEditingContent(item)
    setFormData({
      section: item.section,
      title: item.title || '',
      content: item.content || '',
      image_url: item.image_url || '',
      file_url: item.file_url || '',
      metadata: item.metadata || {},
      display_order: item.display_order,
      is_active: item.is_active
    })
    setImagePreview(item.image_url || '')
    setEditingId(item.id)

    // Pre-fill annual report form fields if editing
    if (item.section === 'annual_reports') {
      setFormData(prev => ({
        ...prev,
        title: item.metadata?.year || item.title || '', // Use year from metadata as title
        content: item.metadata?.description || item.content || '', // Use description from metadata as content
        metadata: {
          year: item.metadata?.year || '',
          description: item.metadata?.description || '',
          period: item.metadata?.period || '',
          reportType: item.metadata?.reportType || 'Plan de Trabajo',
          pdfUrl: item.metadata?.pdfUrl || '',
          wordUrl: item.metadata?.wordUrl || ''
        }
      }));
    }

    setShowForm(true)
  }

  const handleDelete = async (id: string | number) => {
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

  // Formatter for file size
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
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
             activeTab === 'annual_reports' ? 'Año del Informe' : 'Título'}
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => {
              handleInputChange('title', e.target.value);
              // If it's an annual report, update metadata year as well
              if (activeTab === 'annual_reports') {
                handleMetadataChange('year', e.target.value);
              }
            }}
            placeholder={
              activeTab === 'defensora_profile' ? 'Ej: Mtra. María Gabriela Ortiz Portilla' :
              activeTab === 'conoce_ley' ? 'Ej: Ley de Defensoría de Audiencia 2024' :
              activeTab === 'recent_requests' ? 'Ej: Mejora en la Calidad de Audio' :
              activeTab === 'annual_reports' ? 'Ej: 2024' : 'Título'
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
              onChange={(e) => {
                handleInputChange('content', e.target.value)
                // If it's an annual report, update metadata description as well
                if (activeTab === 'annual_reports') {
                  handleMetadataChange('description', e.target.value);
                }
              }}
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

        {/* Metadata Fields for Annual Reports - These fields are now handled in the Dialog */}
        {/* The original structure had these fields here, but the new implementation uses a separate dialog.
             We will keep this conditional rendering for completeness if other sections were to use similar metadata,
             but for annual_reports, the dialog's form will take precedence. */}
        {activeTab === 'annual_reports' && (
          <>
            {/* Year field is now handled by the 'title' input in the dialog */}
            {/* Type of Report is now a select in the dialog */}
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


        {/* File Upload - Generic handler for sections other than annual reports */}
        {config.fields.includes('file') && activeTab !== 'annual_reports' && (
          <div>
            <Label htmlFor="file">
              {activeTab === 'conoce_ley' ? 'Documento PDF' : 'Archivo'}
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileSelect}
              accept={activeTab === 'conoce_ley' ? '.pdf' : '*'}
            />
            {selectedFile && !selectedFile.type.startsWith('image/') && (
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

  // --- New logic for Annual Reports Dialog ---
  const handleAnnualReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content) { // Title is year, content is description
      setDialogMessage('Por favor completa el año y la descripción del informe')
      return
    }

    // Require at least one file if creating a new report, or if editing and no files exist
    const hasExistingFiles = editingContent?.metadata?.pdfUrl || editingContent?.metadata?.wordUrl;
    if ((!selectedPdfFile && !selectedWordFile) && !hasExistingFiles) {
        setDialogMessage('Por favor, selecciona al menos un archivo PDF o Word para el informe.');
        return;
    }

    setIsUploading(true)
    try {
      let pdfUrl = editingContent?.metadata?.pdfUrl || ''
      let wordUrl = editingContent?.metadata?.wordUrl || ''

      if (selectedPdfFile) {
        pdfUrl = await uploadFile(selectedPdfFile)
      }
      if (selectedWordFile) {
        wordUrl = await uploadFile(selectedWordFile)
      }

      // Create FormData instead of JSON
      const reportFormData = new FormData()
      reportFormData.append('section', 'annual_reports')
      reportFormData.append('title', formData.title) // Year as title
      reportFormData.append('content', formData.content) // Description as content
      reportFormData.append('metadata', JSON.stringify({
        year: formData.title,
        description: formData.content,
        period: formData.metadata?.period || '',
        reportType: formData.metadata?.reportType || 'Plan de Trabajo',
        pdfUrl: pdfUrl,
        wordUrl: wordUrl
      }))
      reportFormData.append('display_order', '0')
      reportFormData.append('is_active', 'true')

      // Add ID for editing
      if (editingContent) {
        reportFormData.append('id', editingContent.id.toString())
      }

      const url = editingContent
        ? `/api/defensoria-audiencia`
        : '/api/defensoria-audiencia'
      const method = editingContent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        body: reportFormData // Send FormData instead of JSON
      })

      if (response.ok) {
        setDialogMessage(editingContent ? 'Informe anual actualizado exitosamente' : 'Informe anual creado exitosamente')
        setIsDialogOpen(false)
        resetForm() // Reset form state
        loadContent() // Reload content
      } else {
        const error = await response.json()
        setDialogMessage(`Error al guardar el informe: ${error.error || error.message || 'Error desconocido'}`)
      }
    } catch (error: any) {
      setDialogMessage(`Error al guardar el informe: ${error.message || 'Error de conexión'}`)
    } finally {
      setIsUploading(false)
    }
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
                      {editingId ? 'Actualizar' : 'Crear'}
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

  // --- Main view displaying tabs and tables ---
  return (
    <div className="space-y-6 p-6">
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
          const sectionContent = filteredContent.filter(item => item.section === key)

          // Special rendering for 'annual_reports' tab
          if (key === 'annual_reports') {
            const annualReports = content.filter(item => item.section === 'annual_reports');
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
                      <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                          resetForm(); // Reset form when dialog closes
                          setEditingContent(null); // Clear editing content state
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button onClick={() => { setActiveTab(key); /* No need to call setShowForm(true) here */ }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Informe Anual
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {editingContent?.section === 'annual_reports' ? 'Editar Informe Anual' : 'Nuevo Informe Anual'}
                            </DialogTitle>
                            <DialogDescription>
                              Crea o edita informes anuales con archivos PDF y Word
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleAnnualReportSubmit}>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="year">Año del Informe *</Label>
                                  <Input
                                    id="year"
                                    value={formData.title} // Use title for year input
                                    onChange={(e) => {
                                      setFormData({ ...formData, title: e.target.value });
                                      setDialogMessage(''); // Clear message on input change
                                    }}
                                    placeholder="2024"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="reportType">Tipo de Informe</Label>
                                  <Select
                                    value={formData.metadata?.reportType || ''}
                                    onValueChange={(value) => {
                                      setFormData({ ...formData, metadata: { ...formData.metadata, reportType: value } });
                                      setDialogMessage('');
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccione tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Plan de Trabajo">Plan de Trabajo</SelectItem>
                                      <SelectItem value="Informe Anual">Informe Anual</SelectItem>
                                      <SelectItem value="Reporte Especial">Reporte Especial</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="description">Descripción del Informe *</Label>
                                <Textarea
                                  id="description"
                                  value={formData.content} // Use content for description textarea
                                  onChange={(e) => {
                                    setFormData({ ...formData, content: e.target.value });
                                    setDialogMessage('');
                                  }}
                                  placeholder="Resumen ejecutivo del informe..."
                                  rows={3}
                                  required
                                />
                              </div>

                              <div>
                                <Label htmlFor="period">Período</Label>
                                <Input
                                  id="period"
                                  value={formData.metadata?.period || ''}
                                  onChange={(e) => {
                                    setFormData({ ...formData, metadata: { ...formData.metadata, period: e.target.value } });
                                    setDialogMessage('');
                                  }}
                                  placeholder="Ej: Enero - Diciembre 2024"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="pdfFile">Archivo PDF</Label>
                                  <Input
                                    id="pdfFile"
                                    type="file"
                                    onChange={(e) => handleAnnualReportFileChange(e, 'pdf')}
                                    accept=".pdf"
                                  />
                                  {selectedPdfFile && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      PDF: {selectedPdfFile.name} ({formatFileSize(selectedPdfFile.size)})
                                    </p>
                                  )}
                                  {/* Display existing PDF if no new PDF is selected */}
                                  {editingContent?.metadata?.pdfUrl && !selectedPdfFile && (
                                    <p className="text-sm text-green-600 mt-1">
                                      <a href={editingContent.metadata.pdfUrl} target="_blank" rel="noopener noreferrer" className="underline">
                                        PDF actual disponible
                                      </a>
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <Label htmlFor="wordFile">Archivo Word</Label>
                                  <Input
                                    id="wordFile"
                                    type="file"
                                    onChange={(e) => handleAnnualReportFileChange(e, 'word')}
                                    accept=".doc,.docx"
                                  />
                                  {selectedWordFile && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      Word: {selectedWordFile.name} ({formatFileSize(selectedWordFile.size)})
                                    </p>
                                  )}
                                  {/* Display existing Word if no new Word is selected */}
                                  {editingContent?.metadata?.wordUrl && !selectedWordFile && (
                                    <p className="text-sm text-green-600 mt-1">
                                      <a href={editingContent.metadata.wordUrl} target="_blank" rel="noopener noreferrer" className="underline">
                                        Word actual disponible
                                      </a>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {dialogMessage && (
                              <Alert className="mt-4">
                                <AlertDescription>{dialogMessage}</AlertDescription>
                              </Alert>
                            )}

                            <DialogFooter className="mt-6">
                              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancelar
                              </Button>
                              <Button type="submit" disabled={isUploading}>
                                <Upload className="h-4 w-4 mr-2" />
                                {isUploading ? 'Guardando...' : (editingContent?.section === 'annual_reports' ? 'Actualizar' : 'Crear')}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Search for Annual Reports */}
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
                    ) : annualReports.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Icon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium mb-2">No hay informes anuales</h3>
                        <p>Agrega el primer informe anual.</p>
                        <Dialog open={isDialogOpen} onOpenChange={(open) => {
                          setIsDialogOpen(open);
                          if (!open) {
                            resetForm();
                            setEditingContent(null);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button className="mt-4" onClick={() => setActiveTab(key)}>
                              <Plus className="w-4 h-4 mr-2" />
                              Agregar Informe Anual
                            </Button>
                          </DialogTrigger>
                          {/* Dialog content for adding new annual report - same as above */}
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Nuevo Informe Anual</DialogTitle>
                              <DialogDescription>Crea o edita informes anuales con archivos PDF y Word</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAnnualReportSubmit}>
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="year">Año del Informe *</Label>
                                    <Input
                                      id="year"
                                      value={formData.title}
                                      onChange={(e) => {
                                        setFormData({ ...formData, title: e.target.value });
                                        setDialogMessage('');
                                      }}
                                      placeholder="2024"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="reportType">Tipo de Informe</Label>
                                    <Select
                                      value={formData.metadata?.reportType || ''}
                                      onValueChange={(value) => {
                                        setFormData({ ...formData, metadata: { ...formData.metadata, reportType: value } });
                                        setDialogMessage('');
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione tipo" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Plan de Trabajo">Plan de Trabajo</SelectItem>
                                        <SelectItem value="Informe Anual">Informe Anual</SelectItem>
                                        <SelectItem value="Reporte Especial">Reporte Especial</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="description">Descripción del Informe *</Label>
                                  <Textarea
                                    id="description"
                                    value={formData.content}
                                    onChange={(e) => {
                                      setFormData({ ...formData, content: e.target.value });
                                      setDialogMessage('');
                                    }}
                                    placeholder="Resumen ejecutivo del informe..."
                                    rows={3}
                                    required
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="period">Período</Label>
                                  <Input
                                    id="period"
                                    value={formData.metadata?.period || ''}
                                    onChange={(e) => {
                                      setFormData({ ...formData, metadata: { ...formData.metadata, period: e.target.value } });
                                      setDialogMessage('');
                                    }}
                                    placeholder="Ej: Enero - Diciembre 2024"
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="pdfFile">Archivo PDF</Label>
                                    <Input
                                      id="pdfFile"
                                      type="file"
                                      onChange={(e) => handleAnnualReportFileChange(e, 'pdf')}
                                      accept=".pdf"
                                    />
                                    {selectedPdfFile && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        PDF: {selectedPdfFile.name} ({formatFileSize(selectedPdfFile.size)})
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    <Label htmlFor="wordFile">Archivo Word</Label>
                                    <Input
                                      id="wordFile"
                                      type="file"
                                      onChange={(e) => handleAnnualReportFileChange(e, 'word')}
                                      accept=".doc,.docx"
                                    />
                                    {selectedWordFile && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        Word: {selectedWordFile.name} ({formatFileSize(selectedWordFile.size)})
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {dialogMessage && (
                                <Alert className="mt-4">
                                  <AlertDescription>{dialogMessage}</AlertDescription>
                                </Alert>
                              )}

                              <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                  Cancelar
                                </Button>
                                <Button type="submit" disabled={isUploading}>
                                  <Upload className="h-4 w-4 mr-2" />
                                  {isUploading ? 'Guardando...' : 'Crear'}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </TabsContent>
            )
          }

          // Render for other tabs (original logic)
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
                      <Button className="mt-4" onClick={() => { setActiveTab(key); setShowForm(true) }}>
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
                            <TableRow key={item.id as string}>
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