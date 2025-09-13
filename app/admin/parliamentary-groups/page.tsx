
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ParliamentaryGroup } from "@/lib/api"

export default function ParliamentaryGroupsPage() {
  const [groups, setGroups] = useState<ParliamentaryGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<ParliamentaryGroup | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    colorHex: "",
    description: "",
    imageUrl: ""
  })
  const { toast } = useToast()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'organs') // Reusing organs upload directory

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }))
        toast({
          title: "Éxito",
          description: "Imagen subida correctamente"
        })
      } else {
        throw new Error('Failed to upload image')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo subir la imagen",
        variant: "destructive"
      })
    }
  }

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/parliamentary-groups')
      if (response.ok) {
        const data = await response.json()
        setGroups(data)
      }
    } catch (error) {
      console.error('Error fetching parliamentary groups:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los grupos parlamentarios",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingGroup ? `/api/parliamentary-groups/${editingGroup.id}` : '/api/parliamentary-groups'
      const method = editingGroup ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: editingGroup ? "Grupo parlamentario actualizado" : "Grupo parlamentario creado"
        })
        setDialogOpen(false)
        setEditingGroup(null)
        setFormData({ name: "", abbreviation: "", colorHex: "", description: "", imageUrl: "" })
        fetchGroups()
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el grupo parlamentario",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (group: ParliamentaryGroup) => {
    setEditingGroup(group)
    setFormData({
      name: group.name,
      abbreviation: group.abbreviation,
      colorHex: group.colorHex || "",
      description: group.description || "",
      imageUrl: group.imageUrl
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este grupo parlamentario?')) {
      try {
        const response = await fetch(`/api/parliamentary-groups/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          toast({
            title: "Éxito",
            description: "Grupo parlamentario eliminado"
          })
          fetchGroups()
        } else {
          throw new Error('Failed to delete')
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el grupo parlamentario",
          variant: "destructive"
        })
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Grupos Parlamentarios</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingGroup(null)
              setFormData({ name: "", abbreviation: "", colorHex: "", description: "", imageUrl: "" })
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Grupo Parlamentario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingGroup ? "Editar Grupo Parlamentario" : "Nuevo Grupo Parlamentario"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="abbreviation">Abreviatura</Label>
                  <Input
                    id="abbreviation"
                    value={formData.abbreviation}
                    onChange={(e) => setFormData(prev => ({ ...prev, abbreviation: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="colorHex">Color (Hex)</Label>
                <div className="flex gap-2">
                  <Input
                    id="colorHex"
                    type="color"
                    value={formData.colorHex || "#000000"}
                    onChange={(e) => setFormData(prev => ({ ...prev, colorHex: e.target.value }))}
                    className="w-20"
                  />
                  <Input
                    value={formData.colorHex}
                    onChange={(e) => setFormData(prev => ({ ...prev, colorHex: e.target.value }))}
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="imageFile">Imagen del Grupo</Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingGroup ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Grupos Parlamentarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Abreviatura</TableHead>
                <TableHead>Legisladores</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{group.abbreviation}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {group.legislatorCount || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {group.colorHex && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: group.colorHex }}
                        ></div>
                        <span className="text-sm text-gray-600">{group.colorHex}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {group.description || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(group)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(group.id)}
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
