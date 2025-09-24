'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { Trash2, Upload, Save, Plus } from 'lucide-react'

interface CarouselCategory {
  id: string
  title: string
  image: string
  link: string
}

interface CategoryImage {
  [key: string]: string
}

export default function RadioCategoriesPage() {
  const [categories, setCategories] = useState<CarouselCategory[]>([])
  const [categoryImages, setCategoryImages] = useState<CategoryImage>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [newCategory, setNewCategory] = useState({ title: '', link: '' })
  const [showAddForm, setShowAddForm] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
    fetchCategoryImages()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/radio/carousel')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive"
      })
    }
  }

  const fetchCategoryImages = async () => {
    try {
      const response = await fetch('/api/radio/config')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched category images:', data.categoryImages)
        setCategoryImages(data.categoryImages || {})
      }
    } catch (error) {
      console.error('Error fetching category images:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (categoryTitle: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Clear the input value to allow re-uploading the same file
    event.target.value = ''

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido",
        variant: "destructive"
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no puede ser mayor a 5MB",
        variant: "destructive"
      })
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'radio-categories')

    try {
      toast({
        title: "Subiendo...",
        description: "Subiendo imagen, por favor espera..."
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        const imageUrl = result.url || result.imageUrl || result.fileUrl
        console.log('Uploaded image URL:', imageUrl)

        if (imageUrl) {
          // Find the category by title
          const foundCategory = categories.find(cat => cat.title === categoryTitle)
          if (!foundCategory) {
            throw new Error('Categoría no encontrada')
          }

          // Update both local state and database immediately
          setCategories(prevCategories => 
            prevCategories.map(cat => 
              cat.title === categoryTitle ? { ...cat, image: imageUrl } : cat
            )
          )

          // Update category images config
          setCategoryImages(prev => ({
            ...prev,
            [categoryTitle]: imageUrl
          }))

          // Update the category in the database with the new image
          try {
            const updateResponse = await fetch(`/api/radio/carousel/${foundCategory.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: foundCategory.id,
                title: categoryTitle,
                image: imageUrl,
                link: foundCategory.link
              })
            })

            if (!updateResponse.ok) {
              const errorText = await updateResponse.text()
              throw new Error(`Error updating database: ${errorText}`)
            }

            // Also update the config to maintain consistency
            await fetch('/api/radio/config', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                categoryImages: {
                  ...categoryImages,
                  [categoryTitle]: imageUrl
                }
              })
            })

            toast({
              title: "Éxito",
              description: "Imagen actualizada correctamente"
            })

            // Refresh data to ensure consistency
            setTimeout(() => {
              fetchCategories()
              fetchCategoryImages()
            }, 1000)

          } catch (updateError) {
            console.error('Error updating category in database:', updateError)
            toast({
              title: "Error",
              description: "No se pudo actualizar la categoría en la base de datos",
              variant: "destructive"
            })
          }
        } else {
          throw new Error('No se recibió URL de imagen del servidor')
        }
      } else {
        const errorText = await response.text()
        console.error('Upload response error:', response.status, errorText)
        throw new Error(`Error del servidor: ${response.status}`)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Error",
        description: `No se pudo subir la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive"
      })
    }
  }

  const saveConfigImages = async (images: CategoryImage) => {
    try {
      const response = await fetch('/api/radio/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryImages: images
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save config')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      throw error
    }
  }

  const handleCategoryUpdate = async (categoryId: string, updates: Partial<CarouselCategory>) => {
    setIsSaving(true)
    try {
      // Get the current category data
      const currentCategory = categories.find(cat => cat.id === categoryId)
      if (!currentCategory) {
        console.error('Category not found in local state:', categoryId, 'Available categories:', categories.map(c => c.id))

        // Try to refresh categories first
        await fetchCategories()

        // Check again after refresh
        const refreshedCategory = categories.find(cat => cat.id === categoryId)
        if (!refreshedCategory) {
          toast({
            title: "Error",
            description: "Categoría no encontrada. Por favor, recarga la página."
          })
          return
        }
      }

      // Use the found category (either from original search or after refresh)
      const categoryToUpdate = currentCategory || categories.find(cat => cat.id === categoryId)

      if (!categoryToUpdate) {
        toast({
          title: "Error",
          description: "No se pudo encontrar la categoría para actualizar"
        })
        return
      }

      // Prepare the complete update data
      const updateData = {
        id: categoryToUpdate.id,
        title: updates.title || categoryToUpdate.title,
        image: updates.image || categoryImages[categoryToUpdate.title] || categoryToUpdate.image,
        link: updates.link || categoryToUpdate.link
      }

      console.log('Updating category:', categoryId, 'with data:', updateData)

      const response = await fetch(`/api/radio/carousel/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const updatedCategory = await response.json()
        console.log('Category updated successfully:', updatedCategory)

        // Update local state immediately
        setCategories(prevCategories => 
          prevCategories.map(cat => 
            cat.id === categoryId ? { ...cat, ...updates } : cat
          )
        )

        // Refresh from server to ensure consistency
        setTimeout(() => {
          fetchCategories()
        }, 500)

        toast({
          title: "Éxito",
          description: "Categoría actualizada correctamente"
        })
      } else {
        const errorText = await response.text()
        console.error('Server response error:', response.status, errorText)
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText || 'Error desconocido del servidor' }
        }
        throw new Error(errorData.error || `Error del servidor: ${response.status}`)
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast({
        title: "Error",
        description: `No se pudo actualizar la categoría: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.title || !newCategory.link) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/radio/carousel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newCategory.title.toLowerCase().replace(/\s+/g, '-'),
          title: newCategory.title,
          image: '/images/placeholder.jpg',
          link: newCategory.link
        })
      })

      if (response.ok) {
        await fetchCategories()
        setNewCategory({ title: '', link: '' })
        setShowAddForm(false)
        toast({
          title: "Éxito",
          description: "Categoría creada correctamente"
        })
      } else {
        throw new Error('Error creating category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
        title: "Error",
        description: "No se pudo crear la categoría",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      return
    }

    try {
      const response = await fetch(`/api/radio/carousel/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchCategories()
        toast({
          title: "Éxito",
          description: "Categoría eliminada correctamente"
        })
      } else {
        throw new Error('Error deleting category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return <div className="p-8">Cargando...</div>
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Categorías de Radio</h1>
          <p className="text-gray-600 mt-2">
            Administra las categorías que aparecen en el carrusel de la página de radio
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Categoría
        </Button>
      </div>

      {/* Add New Category Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nueva Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newTitle">Título de la Categoría</Label>
                  <Input
                    id="newTitle"
                    value={newCategory.title}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej: PROGRAMAS"
                  />
                  <p className="text-xs text-gray-500 mt-1">Este título aparecerá en la tarjeta de categoría</p>
                </div>
                <div>
                  <Label htmlFor="newLink">URL de Destino</Label>
                  <Input
                    id="newLink"
                    value={newCategory.link}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="Ej: /radio/programas o https://external-site.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">Los usuarios irán a esta URL al hacer clic en la categoría</p>
                </div>
              </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddCategory} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex justify-between items-center">
                {category.title}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Preview */}
              <div className="aspect-video relative overflow-hidden rounded-lg border">
                {(categoryImages[category.title] || category.image) && 
                 (categoryImages[category.title] || category.image) !== "/images/placeholder.jpg" ? (
                  <Image
                    src={categoryImages[category.title] || category.image}
                    alt={category.title}
                    fill
                    className="object-cover"
                    key={`${category.title}-${categoryImages[category.title] || category.image}-${Date.now()}`}
                    onError={(e) => {
                      console.log('Image load error for', category.title, '- URL:', categoryImages[category.title] || category.image)
                      // Don't remove from state on error, just log it
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Sin imagen</span>
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <Label htmlFor={`image-${category.id}`} className="text-sm font-medium">
                  Cambiar Imagen
                </Label>
                <Input
                  id={`image-${category.id}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(category.title, e)}
                  className="mt-1"
                />
              </div>

              {/* Category Details */}
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-gray-500">Título</Label>
                  <Input
                    value={category.title}
                    onChange={(e) => {
                      const newTitle = e.target.value
                      setCategories(prevCategories =>
                        prevCategories.map(cat =>
                          cat.id === category.id ? { ...cat, title: newTitle } : cat
                        )
                      )
                    }}
                    placeholder="Ej: NOTICIAS CONGRESO"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Enlace</Label>
                  <Input
                    value={category.link}
                    onChange={(e) => {
                      const newLink = e.target.value
                      setCategories(prevCategories =>
                        prevCategories.map(cat =>
                          cat.id === category.id ? { ...cat, link: newLink } : cat
                        )
                      )
                    }}
                    placeholder="Ej: /radio/noticias-congreso"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <Button
                  onClick={() => {
                    const currentCategory = categories.find(cat => cat.id === category.id)
                    if (currentCategory) {
                      handleCategoryUpdate(category.id, {
                        title: currentCategory.title,
                        link: currentCategory.link
                      })
                    }
                  }}
                  disabled={isSaving}
                  className="w-full"
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No hay categorías disponibles</p>
            <Button onClick={() => setShowAddForm(true)} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Categoría
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}