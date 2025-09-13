
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'

interface ChannelConfig {
  id: string
  name: string
  number: string
  logo: string
  backgroundColor: string
  textColor: string
  transmisionesLink: string
  isActive: boolean
  order: number
}

export default function ChannelsAdmin() {
  const [channels, setChannels] = useState<ChannelConfig[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingChannel, setEditingChannel] = useState<ChannelConfig | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    logo: '',
    backgroundColor: '',
    textColor: '#ffffff',
    transmisionesLink: '',
    isActive: true,
    order: 0
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadChannels()
  }, [])

  const loadChannels = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/channels')
      if (!response.ok) throw new Error('Failed to fetch channels')
      const data = await response.json()
      setChannels(data)
    } catch (error) {
      console.error('Error loading channels:', error)
      toast({
        title: "Error",
        description: "Error al cargar los canales",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      number: '',
      logo: '',
      backgroundColor: '',
      textColor: '#ffffff',
      transmisionesLink: '',
      isActive: true,
      order: 0
    })
    setEditingChannel(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const method = editingChannel ? 'PUT' : 'POST'
      const url = editingChannel ? `/api/channels?id=${editingChannel.id}` : '/api/channels'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to save channel')

      await loadChannels()
      setIsDialogOpen(false)
      resetForm()
      toast({
        title: "Éxito",
        description: editingChannel ? "Canal actualizado" : "Canal creado"
      })
    } catch (error) {
      console.error('Error saving channel:', error)
      toast({
        title: "Error",
        description: "Error al guardar el canal",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (channel: ChannelConfig) => {
    setEditingChannel(channel)
    setFormData({
      name: channel.name,
      number: channel.number,
      logo: channel.logo,
      backgroundColor: channel.backgroundColor,
      textColor: channel.textColor,
      transmisionesLink: channel.transmisionesLink,
      isActive: channel.isActive,
      order: channel.order
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este canal?')) return

    try {
      const response = await fetch(`/api/channels?id=${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete channel')
      
      await loadChannels()
      toast({
        title: "Éxito",
        description: "Canal eliminado"
      })
    } catch (error) {
      console.error('Error deleting channel:', error)
      toast({
        title: "Error",
        description: "Error al eliminar el canal",
        variant: "destructive"
      })
    }
  }

  const presetColors = [
    { name: 'Gris', value: '#4a4a4a' },
    { name: 'Rojo', value: '#b91c1c' },
    { name: 'Verde', value: '#15803d' },
    { name: 'Azul', value: '#1d4ed8' },
    { name: 'Morado', value: '#7e22ce' }
  ]

  const presetLogos = [
    { name: 'C+', value: '/images/channel-c-logo.png' },
    { name: 'S+', value: '/images/channel-g-logo.png' },
    { name: 'D+', value: '/images/channel-d-logo.png' },
    { name: 'ST+', value: '/images/channel-st-logo.png' }
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configuración de Canales</h1>
          <p className="text-gray-600">Gestiona los botones de canales que aparecen en todo el sitio</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingChannel(null)
              resetForm()
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Canal
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingChannel ? 'Editar Canal' : 'Nuevo Canal'}
              </DialogTitle>
              <DialogDescription>
                Configura la información del canal que aparecerá en las barras de navegación.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre del Canal</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ej: C+"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="number">Número de Canal</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="ej: 45.1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="logo">Logo del Canal</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, logo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un logo" />
                  </SelectTrigger>
                  <SelectContent>
                    {presetLogos.map((logo) => (
                      <SelectItem key={logo.value} value={logo.value}>
                        <div className="flex items-center gap-2">
                          <Image src={logo.value} alt={logo.name} width={20} height={20} />
                          {logo.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="mt-2"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="O ingresa URL personalizada"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backgroundColor">Color de Fondo</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, backgroundColor: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un color" />
                    </SelectTrigger>
                    <SelectContent>
                      {presetColors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded" 
                              style={{ backgroundColor: color.value }}
                            />
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    className="mt-2"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    placeholder="#4a4a4a"
                  />
                </div>
                <div>
                  <Label htmlFor="textColor">Color de Texto</Label>
                  <Input
                    id="textColor"
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="transmisionesLink">Enlace a Transmisiones</Label>
                <Input
                  id="transmisionesLink"
                  value={formData.transmisionesLink}
                  onChange={(e) => setFormData({ ...formData, transmisionesLink: e.target.value })}
                  placeholder="/transmisiones?stream=1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Orden de Aparición</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Canal Activo</Label>
                </div>
              </div>

              {/* Preview */}
              {formData.name && (
                <div>
                  <Label>Vista Previa</Label>
                  <div className="flex items-center mt-2 p-2 border rounded">
                    <Image
                      src={formData.logo || '/images/placeholder-logo.png'}
                      alt={formData.name}
                      width={32}
                      height={32}
                      className="mr-2"
                    />
                    <div 
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ 
                        backgroundColor: formData.backgroundColor || '#4a4a4a',
                        color: formData.textColor 
                      }}
                    >
                      CANAL <span className="font-bold">{formData.number}</span>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Guardando...' : (editingChannel ? 'Actualizar' : 'Crear')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Canales Configurados</CardTitle>
          <CardDescription>
            {channels.length} canales configurados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vista Previa</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Enlace</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Orden</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels.sort((a, b) => a.order - b.order).map((channel) => (
                  <TableRow key={channel.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Image
                          src={channel.logo || '/images/placeholder-logo.png'}
                          alt={channel.name}
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                        <div 
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: channel.backgroundColor,
                            color: channel.textColor 
                          }}
                        >
                          CANAL <span className="font-bold">{channel.number}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{channel.name}</TableCell>
                    <TableCell>{channel.number}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {channel.transmisionesLink}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        channel.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {channel.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell>{channel.order}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(channel)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(channel.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
