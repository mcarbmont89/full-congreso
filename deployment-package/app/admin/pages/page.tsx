
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save, Eye } from "lucide-react"

interface PageContent {
  id: string
  page: string
  section: string
  title: string
  content: string
  metadata?: any
  updated_at: string
}

export default function PagesAdmin() {
  const [pages, setPages] = useState<PageContent[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPage, setEditingPage] = useState<PageContent | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPages()
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editingPage) {
        handleCancel()
      }
    }
    
    if (editingPage) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [editingPage])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages')
      if (response.ok) {
        const data = await response.json()
        setPages(data)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (page: PageContent) => {
    setEditingPage({ ...page })
  }

  const handleSave = async () => {
    if (!editingPage) return

    setSaving(true)
    try {
      const response = await fetch(`/api/pages/${editingPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingPage.title,
          content: editingPage.content,
          metadata: editingPage.metadata
        }),
      })

      if (response.ok) {
        await fetchPages()
        setEditingPage(null)
      }
    } catch (error) {
      console.error('Error saving page:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingPage(null)
  }

  const groupedPages = pages.reduce((acc, page) => {
    if (!acc[page.page]) {
      acc[page.page] = []
    }
    acc[page.page].push(page)
    return acc
  }, {} as Record<string, PageContent[]>)

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestión de Páginas</h1>
        <p className="text-gray-600">Edita el contenido de las páginas del sitio web</p>
      </div>

      <Tabs defaultValue="transparencia" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transparencia">Transparencia</TabsTrigger>
          <TabsTrigger value="contacto">Contacto</TabsTrigger>
        </TabsList>

        <TabsContent value="transparencia" className="space-y-4">
          <div className="grid gap-4">
            {groupedPages.transparencia?.map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                      <CardDescription>
                        <Badge variant="secondary">{page.section}</Badge>
                        <span className="ml-2 text-sm text-gray-500">
                          Actualizado: {new Date(page.updated_at).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/transparencia/${page.section}`, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(page)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">{page.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacto" className="space-y-4">
          <div className="grid gap-4">
            {groupedPages.contacto?.map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                      <CardDescription>
                        <Badge variant="secondary">{page.section}</Badge>
                        <span className="ml-2 text-sm text-gray-500">
                          Actualizado: {new Date(page.updated_at).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('/contacto', '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(page)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">{page.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      {editingPage && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancel()
            }
          }}
        >
          <div className="w-full max-w-4xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="bg-white border-b px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Editar: {editingPage.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Página: {editingPage.page} - Sección: {editingPage.section}
              </p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">Título</Label>
                  <Input
                    id="title"
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="content" className="text-sm font-medium text-gray-700">Contenido</Label>
                  <Textarea
                    id="content"
                    rows={25}
                    value={editingPage.content}
                    onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                    className="font-mono text-sm mt-1 resize-none"
                    placeholder="Ingresa el contenido HTML..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Puedes usar HTML y clases de Tailwind CSS para estilizar el contenido
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
