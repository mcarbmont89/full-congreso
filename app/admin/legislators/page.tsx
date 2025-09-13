"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash2, Plus, Upload } from "lucide-react"
import Image from "next/image"
import type { Legislator, ParliamentaryGroup } from "@/lib/api"

export default function LegislatorsPage() {
  const [legislators, setLegislators] = useState<Legislator[]>([])
  const [parliamentaryGroups, setParliamentaryGroups] = useState<ParliamentaryGroup[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLegislator, setEditingLegislator] = useState<Legislator | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    parliamentaryGroupId: "",
    legislature: "",
    state: "",
    type: "",
    gender: "",
    status: "Activo",
    imageUrl: "",
    email: "",
    biography: ""
  })
  const { toast } = useToast()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'legislators')

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

  const fetchLegislators = async () => {
    try {
      const response = await fetch('/api/legislators')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched legislators:', data)
        setLegislators(data)
      } else {
        console.error('Failed to fetch legislators:', response.status)
      }
    } catch (error) {
      console.error('Error fetching legislators:', error)
    }
  }

  const fetchParliamentaryGroups = async () => {
    try {
      const response = await fetch('/api/parliamentary-groups')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched parliamentary groups:', data)
        setParliamentaryGroups(data)
      } else {
        console.error('Failed to fetch parliamentary groups:', response.status)
      }
    } catch (error) {
      console.error('Error fetching parliamentary groups:', error)
    }
  }

  useEffect(() => {
    fetchLegislators()
    fetchParliamentaryGroups()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingLegislator ? `/api/legislators/${editingLegislator.id}` : '/api/legislators'
      const method = editingLegislator ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Legislador ${editingLegislator ? 'actualizado' : 'creado'} correctamente`
        })
        fetchLegislators()
        setDialogOpen(false)
        resetForm()
      } else {
        throw new Error('Error al guardar legislador')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el legislador",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (legislator: Legislator) => {
    setEditingLegislator(legislator)
    setFormData({
      name: legislator.name,
      parliamentaryGroupId: legislator.parliamentaryGroupId,
      legislature: legislator.legislature || "",
      state: legislator.state || "",
      type: legislator.type || "",
      gender: legislator.gender || "",
      status: legislator.status || "Activo",
      imageUrl: legislator.imageUrl || "",
      email: legislator.email || "",
      biography: legislator.biography || ""
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este legislador?')) {
      try {
        const response = await fetch(`/api/legislators/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          toast({
            title: "Éxito",
            description: "Legislador eliminado correctamente"
          })
          fetchLegislators()
        } else {
          throw new Error('Error al eliminar legislador')
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el legislador",
          variant: "destructive"
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      parliamentaryGroupId: "",
      legislature: "",
      state: "",
      type: "",
      gender: "",
      status: "Activo",
      imageUrl: "",
      email: "",
      biography: ""
    })
    setEditingLegislator(null)
  }

  const getParliamentaryGroupName = (id: string) => {
    const group = parliamentaryGroups.find(g => g.id === id)
    return group?.name || "Sin grupo"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Legisladores</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Legislador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLegislator ? 'Editar Legislador' : 'Nuevo Legislador'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="parliamentaryGroup">Grupo Parlamentario *</Label>
                  <Select
                    value={formData.parliamentaryGroupId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, parliamentaryGroupId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {parliamentaryGroups.map(group => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="legislature">Legislatura</Label>
                  <Input
                    id="legislature"
                    value={formData.legislature}
                    onChange={(e) => setFormData(prev => ({ ...prev, legislature: e.target.value }))}
                    placeholder="LXV (2021–2024)"
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mayoría relativa">Mayoría relativa</SelectItem>
                      <SelectItem value="Plurinominal">Plurinominal</SelectItem>
                      <SelectItem value="Diputado">Diputado</SelectItem>
                      <SelectItem value="Senador">Senador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="gender">Género</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                      <SelectItem value="Licencia">Licencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="imageFile">Fotografía</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  {formData.imageUrl && (
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden border">
                      <Image 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="biography">Biografía</Label>
                <textarea
                  id="biography"
                  value={formData.biography}
                  onChange={(e) => setFormData(prev => ({ ...prev, biography: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingLegislator ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Legisladores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fotografía</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Grupo Parlamentario</TableHead>
                  <TableHead>Legislatura</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Género</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {legislators.map((legislator) => (
                  <TableRow key={legislator.id}>
                    <TableCell>
                      <div className="w-12 h-12 relative rounded-full overflow-hidden">
                        <Image
                          src={legislator.imageUrl || "/placeholder.svg?height=48&width=48&text=L"}
                          alt={legislator.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{legislator.name}</TableCell>
                    <TableCell>{getParliamentaryGroupName(legislator.parliamentaryGroupId)}</TableCell>
                    <TableCell>{legislator.legislature || "–"}</TableCell>
                    <TableCell>{legislator.state || "–"}</TableCell>
                    <TableCell>{legislator.type || "–"}</TableCell>
                    <TableCell>{legislator.gender === "M" ? "M" : legislator.gender === "F" ? "F" : "–"}</TableCell>
                    <TableCell>
                      <Badge variant={legislator.status === "Activo" ? "default" : "secondary"}>
                        {legislator.status || "Activo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(legislator)}
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(legislator.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}