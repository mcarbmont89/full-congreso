"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Edit } from "lucide-react"
import Link from "next/link"

interface TransparencyCard {
  title: string
  description: string
  linkUrl?: string
  hasButton?: boolean
  items?: string[]
}

interface TransparencySection {
  id: string
  sectionKey: string
  sectionTitle: string
  iconType?: string
  cardsData: TransparencyCard[]
  displayOrder: number
  isActive: boolean
}

export default function TransparencySectionsAdmin() {
  const [sections, setSections] = useState<TransparencySection[]>([])
  const [editingSection, setEditingSection] = useState<TransparencySection | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/transparency-sections', {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setSections(data)
      }
    } catch (error) {
      console.error('Error loading transparency sections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (section: TransparencySection) => {
    setEditingSection({ ...section })
  }

  const handleSave = async () => {
    if (!editingSection) return
    
    try {
      setIsSaving(true)
      const response = await fetch(`/api/transparency-sections/${editingSection.sectionKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle: editingSection.sectionTitle,
          cardsData: editingSection.cardsData,
          iconType: editingSection.iconType,
          displayOrder: editingSection.displayOrder,
          isActive: editingSection.isActive
        })
      })

      if (response.ok) {
        await loadSections()
        setEditingSection(null)
        alert('Sección actualizada exitosamente')
      } else {
        alert('Error al actualizar la sección')
      }
    } catch (error) {
      console.error('Error saving section:', error)
      alert('Error al guardar los cambios')
    } finally {
      setIsSaving(false)
    }
  }

  const updateSectionTitle = (title: string) => {
    if (!editingSection) return
    setEditingSection({ ...editingSection, sectionTitle: title })
  }

  const updateCardField = (cardIndex: number, field: keyof TransparencyCard, value: string) => {
    if (!editingSection) return
    const newCards = [...editingSection.cardsData]
    newCards[cardIndex] = { ...newCards[cardIndex], [field]: value }
    setEditingSection({ ...editingSection, cardsData: newCards })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p>Cargando secciones...</p>
      </div>
    )
  }

  if (editingSection) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => setEditingSection(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">Editar Sección: {editingSection.sectionKey}</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Título de la Sección</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={editingSection.sectionTitle}
              onChange={(e) => updateSectionTitle(e.target.value)}
              placeholder="Título de la sección"
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tarjetas de Contenido</h2>
          {editingSection.cardsData.map((card, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-sm">Tarjeta {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={card.title}
                    onChange={(e) => updateCardField(index, 'title', e.target.value)}
                    placeholder="Título de la tarjeta"
                  />
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea
                    value={card.description}
                    onChange={(e) => updateCardField(index, 'description', e.target.value)}
                    placeholder="Descripción de la tarjeta"
                    rows={4}
                  />
                </div>
                {card.hasButton && (
                  <div>
                    <Label>URL del Enlace</Label>
                    <Input
                      value={card.linkUrl || ''}
                      onChange={(e) => updateCardField(index, 'linkUrl', e.target.value)}
                      placeholder="https://ejemplo.com o /ruta-interna"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => setEditingSection(null)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Panel
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Gestión de Secciones de Transparencia</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Secciones de Transparencia</CardTitle>
          <CardDescription>
            Edita el contenido de las secciones de transparencia que aparecen en la página pública
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{section.sectionTitle}</h3>
                  <p className="text-sm text-gray-500">
                    {section.cardsData.length} tarjeta(s) · Clave: {section.sectionKey}
                  </p>
                </div>
                <Button onClick={() => handleEdit(section)} size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            ))}
            {sections.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No hay secciones disponibles. Primero debes poblar la base de datos con el contenido inicial.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
