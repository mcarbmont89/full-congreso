"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import TinyMCEWrapper from "@/components/tinymce-wrapper"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, ArrowLeft, Search, Send, Star } from "lucide-react"
import { getNews, createNewsItem, updateNewsItem, deleteNewsItem, type NewsItem } from "@/lib/api-client"
import BulkNewsUpload from "@/components/bulk-news-upload"
import { formatForAdminTimezoneInput, parseAdminTimezoneDateTime } from "@/lib/timezone"

export default function NewsAdmin() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    category: '',
    publishedAt: '',
    date: new Date().toISOString().split('T')[0],
    isFeatured: false,
    featuredRank: null as number | null
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const categories = [
    'Trabajo en comisiones',
    'Trabajo en pleno',
    'Relaciones Exteriores',
    'Temas de actualidad',
    'Reformas aprobadas',
    'Foros y seminarios'
  ]

  useEffect(() => {
    loadNews()

    // Set up interval to refresh news list periodically
    const interval = setInterval(loadNews, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [])

  // Filter and search functionality
  useEffect(() => {
    let filtered = news

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus)
    }

    setFilteredNews(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [news, searchTerm, selectedCategory, selectedStatus])

  const loadNews = async () => {
    try {
      setIsLoading(true)
      // For admin, we want to see all news including scheduled
      const response = await fetch('/api/news/all', {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setNews(data.news) // Fix: Use data.news instead of data
      }
    } catch (error) {
      console.error('Error loading news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Bulk operations
  const handleSelectAll = () => {
    if (selectedItems.length === filteredNews.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredNews.map(item => item.id))
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return

    if (confirm(`¿Estás seguro de que quieres eliminar ${selectedItems.length} noticias?`)) {
      try {
        setIsLoading(true)
        const deletePromises = selectedItems.map(id => 
          fetch(`/api/news/${id}`, { method: 'DELETE' })
        )
        await Promise.all(deletePromises)
        setSelectedItems([])
        loadNews()
        alert('Noticias eliminadas exitosamente')
      } catch (error) {
        console.error('Error deleting news:', error)
        alert('Error al eliminar noticias')
      } finally {
        setIsLoading(false)
      }
    }
  }



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'news')

    try {
      console.log('Uploading news image:', file.name)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error uploading image')
      }

      const result = await response.json()
      console.log('News image uploaded successfully:', result.imageUrl)
      return result.imageUrl
    } catch (error) {
      console.error('Error uploading news image:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent | null, forcedStatus?: string) => {
    if (e) e.preventDefault()

    try {
      setIsLoading(true)

      let imageUrl = formData.imageUrl

      // Upload new image if file is selected
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile)
      }

      // Determine status and publication date
      let status = forcedStatus
      let publishedAt: Date = new Date()

      if (forcedStatus === 'draft') {
        // For drafts, use current time but status will be handled by API
        status = 'draft'
        publishedAt = new Date()
      } else if (forcedStatus === 'publish_now') {
        // Force immediate publication with current time
        status = 'published'
        publishedAt = new Date()
      } else if (formData.publishedAt) {
        // Send raw datetime-local string to server - let server handle timezone conversion
        publishedAt = new Date(formData.publishedAt) // Keep for status determination only
        const now = new Date()
        
        // If we're editing and the original status was 'scheduled', preserve the scheduled date
        if (editingNews && editingNews.status === 'scheduled' && !forcedStatus) {
          status = publishedAt <= now ? 'published' : 'scheduled'
        } else {
          status = publishedAt <= now ? 'published' : 'scheduled'
        }
      } else {
        // No date provided and not forced as draft, publish immediately
        status = 'published'
        publishedAt = new Date()
      }

      const newsData = {
        ...formData,
        imageUrl,
        publishedAt: publishedAt, // Always use the Date object for type safety
        status
      }

      if (editingNews) {
        await updateNewsItem(editingNews.id, newsData)
      } else {
        await createNewsItem(newsData)
      }

      setShowForm(false)
      setEditingNews(null)
      setFormData({ 
        title: '', 
        summary: '', 
        content: '', 
        imageUrl: '', 
        category: '',
        publishedAt: '',
        date: new Date().toISOString().split('T')[0],
        isFeatured: false,
        featuredRank: null
      })
      setSelectedFile(null)
      setImagePreview('')
      loadNews()
    } catch (error) {
      console.error('Error saving news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (newsItem: NewsItem) => {
    setEditingNews(newsItem)
    // Format the publishedAt date using admin timezone (NO CONVERSION)
    const formattedDate = await formatForAdminTimezoneInput(new Date(newsItem.publishedAt))
    
    setFormData({
      title: newsItem.title,
      summary: newsItem.summary,
      content: newsItem.content,
      imageUrl: newsItem.imageUrl,
      category: newsItem.category || '',
      publishedAt: formattedDate,
      date: new Date(newsItem.publishedAt).toISOString().split('T')[0],
      isFeatured: newsItem.isFeatured || false,
      featuredRank: newsItem.featuredRank ?? null
    })
    setSelectedFile(null)
    setImagePreview(newsItem.imageUrl || '')
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      try {
        setIsLoading(true)
        await deleteNewsItem(id)
        loadNews()
        alert('Noticia eliminada exitosamente')
      } catch (error) {
        console.error('Error deleting news:', error)
        alert('Error al eliminar la noticia')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePublishNow = async (newsItem: NewsItem) => {
    if (confirm('¿Estás seguro de que quieres publicar esta noticia ahora?')) {
      try {
        setIsLoading(true)
        
        // Send minimal payload to avoid overwriting unintended fields
        const updateData = {
          status: 'published',
          publishedAt: new Date()
        }
        
        await updateNewsItem(newsItem.id, updateData)
        loadNews()
        alert('Noticia publicada exitosamente')
      } catch (error) {
        console.error('Error publishing news:', error)
        alert('Error al publicar la noticia')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleNewNews = () => {
    setEditingNews(null)
    setFormData({ 
          title: '', 
          summary: '', 
          content: '', 
          imageUrl: '', 
          category: '',
          publishedAt: '',  // Empty by default
          date: new Date().toISOString().split('T')[0],
          isFeatured: false,
          featuredRank: null
        })
    setSelectedFile(null)
    setImagePreview('')
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingNews(null)
    setFormData({ 
      title: '', 
      summary: '', 
      content: '', 
      imageUrl: '', 
      category: '',
      publishedAt: '',
      date: new Date().toISOString().split('T')[0],
      isFeatured: false,
      featuredRank: null
    })
    setSelectedFile(null)
    setImagePreview('')
  }

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentNews = filteredNews.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedItems([]) // Clear selections when changing pages
  }

  if (showForm) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {editingNews ? 'Editar Noticia' : 'Nueva Noticia'}
            </h1>
            <p className="text-gray-600">
              Completa la información de la noticia.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="mt-1"
                      placeholder="Ingresa el título de la noticia"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="mt-1 bg-white">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="publishedAt">Fecha y Hora de Publicación</Label>
                    <Input
                      id="publishedAt"
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Deja vacío para guardar como borrador
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="image">Imagen</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Image Preview Section */}
                {imagePreview && (
                  <div className="w-full">
                    <Label>Vista previa de imagen</Label>
                    <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                      <img 
                        src={imagePreview} 
                        alt="Vista previa" 
                        className="max-w-full h-48 object-cover rounded border mx-auto"
                      />
                    </div>
                  </div>
                )}

                {editingNews && !selectedFile && !imagePreview && (
                  <div className="w-full">
                    <p className="text-sm text-gray-500 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      💡 Selecciona una nueva imagen para reemplazar la actual
                    </p>
                  </div>
                )}

                {/* Featured News Section */}
                <div className="border-t pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Noticia Destacada
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Las noticias destacadas aparecen en posiciones prominentes con mayor visibilidad.
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isFeatured" 
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => 
                          setFormData({ 
                            ...formData, 
                            isFeatured: checked as boolean,
                            featuredRank: checked ? formData.featuredRank || 1 : null
                          })
                        }
                      />
                      <Label htmlFor="isFeatured" className="text-sm font-medium">
                        Destacar esta noticia
                      </Label>
                    </div>

                    {formData.isFeatured && (
                      <div className="ml-6">
                        <Label htmlFor="featuredRank" className="text-sm">
                          Prioridad de visualización
                        </Label>
                        <Input
                          id="featuredRank"
                          type="number"
                          min="0"
                          max="999"
                          value={formData.featuredRank || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            featuredRank: e.target.value ? parseInt(e.target.value) : null 
                          })}
                          className="mt-1 w-32"
                          placeholder="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Números menores tienen mayor prioridad (0 = más alta prioridad)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="space-y-8">
                  <div className="border-t pt-6">
                    <div className="mb-4">
                      <Label htmlFor="summary" className="text-lg font-semibold">Resumen de la Noticia</Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Escribe un resumen atractivo que capture la esencia de la noticia. Este será visible en las vistas previas.
                      </p>
                    </div>
                    <div className="mt-1">
                      <Textarea
                        id="summary"
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        placeholder="Escribe un resumen conciso y atractivo de la noticia..."
                        rows={6}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="mb-4">
                      <Label htmlFor="content" className="text-lg font-semibold">Contenido Principal</Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Desarrolla la noticia completa con todos los detalles. Usa los botones del editor para dar formato y estructura al contenido.
                      </p>
                    </div>
                    <div className="mt-1">
                      <TinyMCEWrapper
                        value={formData.content}
                        onChange={(value) => setFormData({ ...formData, content: value })}
                        placeholder="Desarrolla la noticia completa con todos los detalles importantes..."
                        height={500}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto min-h-[44px]">
                  Cancelar
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleSubmit(null, 'draft')}
                  disabled={isLoading}
                  className="w-full sm:w-auto min-h-[44px]"
                >
                  {isLoading ? 'Guardando...' : 'Guardar como Borrador'}
                </Button>
                {editingNews && editingNews.status === 'draft' && (
                  <Button 
                    type="button" 
                    onClick={() => handleSubmit(null, 'publish_now')}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto min-h-[44px]"
                  >
                    {isLoading ? 'Publicando...' : 'Publicar Ahora'}
                  </Button>
                )}
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto min-h-[44px]">
                  {isLoading ? 'Guardando...' : (editingNews ? 'Actualizar' : 'Publicar')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Noticias</h1>
          <p className="text-sm sm:text-base text-gray-600">Gestiona artículos y noticias del portal</p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button onClick={handleNewNews} className="w-full sm:w-auto min-h-[44px]">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Noticia
          </Button>
          <BulkNewsUpload onComplete={loadNews} />
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-4 md:mb-6">
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Buscar por título, resumen o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-1 bg-white">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="mt-1 bg-white">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="scheduled">Programado</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedStatus('all')
                }}
                className="mt-1"
              >
                Limpiar filtros
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">
                    {selectedItems.length} elementos seleccionados
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar seleccionados
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Noticias</CardTitle>
          <CardDescription>
            {filteredNews.length} de {news.length} noticias
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' ? ' (filtradas)' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Cargando noticias...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === currentNews.length && currentNews.length > 0}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Vistas</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentNews.map((newsItem) => (
                    <TableRow key={newsItem.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(newsItem.id)}
                          onChange={() => handleSelectItem(newsItem.id)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-xs">
                          <div className="truncate">{newsItem.title}</div>
                          {newsItem.imageUrl && (
                            <div className="text-xs text-gray-500 mt-1">📷 Con imagen</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {newsItem.category || 'Sin categoría'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          newsItem.status === 'published' ? 'bg-green-100 text-green-800' :
                          newsItem.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {newsItem.status === 'published' ? 'Publicado' :
                           newsItem.status === 'scheduled' ? 'Programado' :
                           'Borrador'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(newsItem.publishedAt).toLocaleDateString('es-ES')}</div>
                          <div className="text-gray-500">{new Date(newsItem.publishedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">-</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {newsItem.status === 'draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePublishNow(newsItem)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Publicar ahora"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(newsItem)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(newsItem.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {currentNews.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {filteredNews.length === 0 && news.length === 0
                          ? 'No hay noticias disponibles. Crea la primera noticia.'
                          : 'No se encontraron noticias con los filtros aplicados.'
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredNews.length)} de {filteredNews.length} resultados
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}