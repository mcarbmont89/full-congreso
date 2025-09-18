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
import { getLiveStreams, createLiveStream, updateLiveStream, deleteLiveStream, type LiveStream } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Image from 'next/image'

// Function to get the channel logo based on the channel name
const getChannelLogo = (channel: string) => {
  switch (channel) {
    case 'C+':
      return '/images/channel-c-logo.png'
    case 'D+':
      return '/images/channel-d-logo.png'
    case 'S+':
      return '/images/channel-g-logo.png'
    case 'ST+':
      return '/images/channel-st-logo.png'
    default:
      return '/images/placeholder-logo.png' // Or a default logo
  }
}

export default function LiveStreamsAdmin() {
  const [streams, setStreams] = useState<LiveStream[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStream, setEditingStream] = useState<LiveStream | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    thumbnailUrl: '',
    streamUrl: '',
    channel: '',
    isLive: false,
    status: 'offline'
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    loadStreams()
  }, [])

  const loadStreams = async () => {
    try {
      // Call the API endpoint directly instead of using getLiveStreams
      const response = await fetch('/api/live-streams')
      if (!response.ok) {
        throw new Error('Failed to fetch streams')
      }
      const data = await response.json()
      console.log('Loaded streams in admin:', data)
      setStreams(data)
    } catch (error) {
      console.error('Error loading streams in admin:', error)
      setStreams([])
    }
  }

  const resetForm = () => {
    setFormData({ title: '', thumbnailUrl: '', streamUrl: '', channel: '', isLive: false, status: 'offline' })
    setEditingStream(null)
    setSelectedFile(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, thumbnailUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('type', 'transmisiones')

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData,
    })

    if (!response.ok) {
      throw new Error('Error uploading image')
    }

    const result = await response.json()
    return result.imageUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      let thumbnailUrl = formData.thumbnailUrl

      // If a file is selected, upload it first
      if (selectedFile) {
        thumbnailUrl = await uploadImage(selectedFile)
      }

      const submitData = {
        ...formData,
        thumbnailUrl
      }

      console.log('Saving stream data:', submitData)

      if (editingStream) {
        console.log('Updating stream with ID:', editingStream.id)
        const result = await updateLiveStream(editingStream.id, submitData)
        console.log('Update result:', result)
        
        toast({
          title: "Éxito",
          description: "Transmisión actualizada correctamente"
        })
      } else {
        console.log('Creating new stream')
        const result = await createLiveStream(submitData)
        console.log('Create result:', result)
        
        toast({
          title: "Éxito", 
          description: "Transmisión creada correctamente"
        })
      }

      // Reload the streams to reflect changes
      await loadStreams()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving stream:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      toast({
        title: "Error",
        description: `Error al guardar la transmisión: ${errorMessage}`,
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (stream: LiveStream) => {
    setEditingStream(stream)
    setFormData({
      title: stream.title,
      thumbnailUrl: stream.thumbnailUrl,
      streamUrl: stream.streamUrl,
      channel: stream.channel || '',
      isLive: stream.isLive,
      status: stream.status || 'offline'
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta transmisión?')) {
      await deleteLiveStream(id)
      loadStreams()
    }
  }

  const handleQuickStatusUpdate = async (streamId: string, newStatus: string) => {
    try {
      console.log(`Updating stream ${streamId} status to ${newStatus}`)
      
      const updateData = {
        status: newStatus,
        isLive: newStatus === 'live'
      }

      await updateLiveStream(streamId, updateData)
      
      toast({
        title: "Éxito",
        description: `Estado actualizado a ${newStatus === 'live' ? 'EN VIVO' : newStatus === 'signal_open' ? 'SEÑAL ABIERTA' : newStatus === 'recess' ? 'EN RECESO' : 'FUERA DE LÍNEA'}`
      })
      
      // Reload streams to show updated status
      await loadStreams()
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error", 
        description: "Error al actualizar el estado",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Transmisiones en Vivo</h1>
          <p className="text-sm sm:text-base text-gray-600">Gestiona las señales y transmisiones en directo</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto min-h-[44px]">
                Limpiar datos de la BD
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará todos los registros de transmisiones de la base de datos y los reemplazará con transmisiones predeterminadas. 
                  <br /><br />
                  <strong>Esta acción no se puede deshacer.</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      // First cleanup any example streams
                      const cleanupResponse = await fetch('/api/admin/cleanup-streams', {
                        method: 'POST'
                      })

                      if (!cleanupResponse.ok) {
                        throw new Error('Error en limpieza')
                      }

                      // Then seed with real streams
                      const seedResponse = await fetch('/api/admin/seed-live-streams', {
                        method: 'POST'
                      })

                      if (!seedResponse.ok) {
                        throw new Error('Error en inserción')
                      }

                      // Reload the streams from database
                      await loadStreams()

                      toast({
                        title: "Éxito",
                        description: "Base de datos actualizada con transmisiones reales"
                      })
                    } catch (error) {
                      console.error('Error updating database:', error)
                      toast({
                        title: "Error",
                        description: "Error al actualizar la base de datos: " + (error instanceof Error ? error.message : 'Error desconocido'),
                        variant: "destructive"
                      })
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Sí, limpiar base de datos
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingStream(null)
                resetForm()
              }} className="w-full sm:w-auto min-h-[44px]">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Transmisión
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingStream ? 'Editar Transmisión' : 'Nueva Transmisión'}
                </DialogTitle>
                <DialogDescription>
                  Completa la información de la transmisión en vivo.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="thumbnailUrl">Miniatura</Label>
                  <Input
                    type="file"
                    id="thumbnailUrl"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {formData.thumbnailUrl && typeof formData.thumbnailUrl === 'string' && (
                    <img 
                      src={formData.thumbnailUrl}
                      alt="Miniatura"
                      className="mt-2 w-32 h-auto"
                    />
                  )}
                </div>

                <div>
                 <Label htmlFor="channel">Canal</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                  <RadioGroup
                        value={formData.channel}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, channel: value }))}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="C+" id="c-plus" />
                          <label htmlFor="c-plus" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2 cursor-pointer">
                            <div className="w-6 h-6 flex items-center justify-center">
                              <Image
                                src="/images/channel-c-logo.png"
                                alt="C+ logo"
                                width={24}
                                height={24}
                                className="w-6 h-6 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "/images/placeholder-logo.png";
                                }}
                              />
                            </div>
                            <span>C+ (45.1)</span>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="S+" id="s-plus" />
                          <label htmlFor="s-plus" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2 cursor-pointer">
                            <div className="w-6 h-6 flex items-center justify-center">
                              <Image
                                src="/images/channel-g-logo.png"
                                alt="S+ logo"
                                width={24}
                                height={24}
                                className="w-6 h-6 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "/images/placeholder-logo.png";
                                }}
                              />
                            </div>
                            <span>S+ (45.2)</span>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="D+" id="d-plus" />
                          <label htmlFor="d-plus" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2 cursor-pointer">
                            <div className="w-6 h-6 flex items-center justify-center">
                              <Image
                                src="/images/channel-d-logo.png"
                                alt="D+ logo"
                                width={24}
                                height={24}
                                className="w-6 h-6 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "/images/placeholder-logo.png";
                                }}
                              />
                            </div>
                            <span>D+ (45.3)</span>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ST+" id="st-plus" />
                          <label htmlFor="st-plus" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2 cursor-pointer">
                            <div className="w-6 h-6 flex items-center justify-center">
                              <Image
                                src="/images/channel-st-logo.png"
                                alt="ST+ logo"
                                width={24}
                                height={24}
                                className="w-6 h-6 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "/images/placeholder-logo.png";
                                }}
                              />
                            </div>
                            <span>ST+ (Streaming)</span>
                          </label>
                        </div>
                      </RadioGroup>
                  </div>
                </div>

                <div>
                  <Label htmlFor="streamUrl">URL de Transmisión</Label>
                  <Input
                    id="streamUrl"
                    value={formData.streamUrl}
                    onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="status">Estado de la Transmisión</Label>
                  <div className="mt-2">
                    <RadioGroup
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        status: value,
                        isLive: value === 'live'
                      }))}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="live" id="live" />
                        <label htmlFor="live" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          <span className="text-green-600">● En Vivo</span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="signal_open" id="signal_open" />
                        <label htmlFor="signal_open" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          <span className="text-green-600">● Señal Abierta</span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="recess" id="recess" />
                        <label htmlFor="recess" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          <span className="text-orange-600">● En Receso</span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="offline" id="offline" />
                        <label htmlFor="offline" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          <span className="text-gray-600">● Fuera de Línea</span>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? 'Subiendo...' : (editingStream ? 'Actualizar' : 'Crear')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Transmisiones</CardTitle>
          <CardDescription>
            {streams.length} transmisiones configuradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>URL de Transmisión</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {streams.map((stream) => (
                <TableRow key={stream.id}>
                  <TableCell className="font-medium">{stream.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img 
                        src={
                          stream.channel === 'C+' ? '/images/channel-c-logo.png' :
                          stream.channel === 'D+' ? '/images/channel-d-logo.png' :
                          stream.channel === 'S+' ? '/images/channel-g-logo.png' :
                          stream.channel === 'ST+' ? '/images/channel-st-logo.png' :
                          '/images/placeholder-logo.png'
                        }
                        alt={`Logo ${stream.channel}`}
                        className="w-8 h-8 object-contain"
                      />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stream.channel === 'C+' ? 'bg-gray-100 text-gray-800' :
                        stream.channel === 'D+' ? 'bg-red-100 text-red-800' :
                        stream.channel === 'S+' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {stream.channel || 'Sin canal'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      stream.status === 'live' || stream.status === 'signal_open'
                        ? 'bg-green-100 text-green-800' 
                        : stream.status === 'recess'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {stream.status === 'live' ? 'En Vivo' : 
                       stream.status === 'signal_open' ? 'Señal Abierta' :
                       stream.status === 'recess' ? 'En Receso' : 'Fuera de Línea'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {stream.streamUrl}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(stream)}
                        title="Editar transmisión"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {/* Quick status update buttons */}
                      {stream.status !== 'live' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-50 hover:bg-green-100 border-green-200"
                          onClick={() => handleQuickStatusUpdate(stream.id, 'live')}
                          title="Poner EN VIVO"
                        >
                          <span className="text-xs text-green-600">Live</span>
                        </Button>
                      )}
                      
                      {stream.status !== 'signal_open' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-50 hover:bg-green-100 border-green-200"
                          onClick={() => handleQuickStatusUpdate(stream.id, 'signal_open')}
                          title="Poner SEÑAL ABIERTA"
                        >
                          <span className="text-xs text-green-600">Open</span>
                        </Button>
                      )}
                      
                      {stream.status !== 'recess' && (
                        <Button
                          variant="outline"
                          size="sm" 
                          className="bg-orange-50 hover:bg-orange-100 border-orange-200"
                          onClick={() => handleQuickStatusUpdate(stream.id, 'recess')}
                          title="Poner EN RECESO"
                        >
                          <span className="text-xs text-orange-600">Rec</span>
                        </Button>
                      )}
                      
                      {stream.status !== 'offline' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gray-50 hover:bg-gray-100 border-gray-200"
                          onClick={() => handleQuickStatusUpdate(stream.id, 'offline')}
                          title="Poner FUERA DE LÍNEA"
                        >
                          <span className="text-xs text-gray-600">Off</span>
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(stream.id)}
                        title="Eliminar transmisión"
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