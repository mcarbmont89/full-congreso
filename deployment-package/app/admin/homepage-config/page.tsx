"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Upload, Save, Image as ImageIcon } from "lucide-react"

interface HomepageConfig {
  id: string
  section: string
  title?: string
  description?: string
  backgroundImageUrl?: string
  heroImageUrl?: string
  logoUrl?: string
  additionalImages?: any
  configData?: any
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export default function HomepageConfigAdmin() {
  const [configs, setConfigs] = useState<HomepageConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [liveSectionConfig, setLiveSectionConfig] = useState({
    title: '',
    description: '',
    backgroundImageUrl: '',
    showLiveIndicator: false,
    liveIndicatorText: 'EN VIVO AHORA'
  })

  const [downloadAppConfig, setDownloadAppConfig] = useState({
    title: '',
    description: '',
    heroImageUrl: '',
    mobileImageUrl: ''
  })

  useEffect(() => {
    loadConfigs()
  }, [])

  const loadConfigs = async () => {
    try {
      const response = await fetch('/api/homepage-config')
      if (response.ok) {
        const data = await response.json()
        setConfigs(data)

        // Load live section config
        const liveSection = data.find((c: any) => c.section === 'liveSection')
        if (liveSection) {
          setLiveSectionConfig({
            title: String(liveSection.title || ''),
            description: String(liveSection.description || ''),
            backgroundImageUrl: String(liveSection.backgroundImageUrl || ''),
            showLiveIndicator: liveSection.configData?.showLiveIndicator || false,
            liveIndicatorText: String(liveSection.configData?.liveIndicatorText || 'EN VIVO AHORA')
          })
        }

        // Load download app config
        const downloadApp = data.find((c: any) => c.section === 'downloadApp')
        if (downloadApp) {
          const mobileImageUrl = downloadApp.mobileImageUrl || '';
          console.log('Loading download app config, mobileImageUrl:', mobileImageUrl);
          console.log('Full downloadApp object:', downloadApp);
          setDownloadAppConfig({
            title: String(downloadApp.title || ''),
            description: String(downloadApp.description || ''),
            heroImageUrl: String(downloadApp.heroImageUrl || ''),
            mobileImageUrl: String(mobileImageUrl)
          })
        }
      }
    } catch (error) {
      console.error('Error loading homepage config:', error)
      toast({
        title: "Error",
        description: "Error al cargar la configuración",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (file: File, section: string, type: string) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'homepage')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload file')

      const result = await response.json()

      if (section === 'liveSection' && type === 'background') {
        setLiveSectionConfig(prev => ({
          ...prev,
          backgroundImageUrl: result.url
        }))
      } else if (section === 'downloadApp' && type === 'hero') {
        setDownloadAppConfig(prev => ({
          ...prev,
          heroImageUrl: result.url
        }))
      } else if (section === 'downloadApp' && type === 'mobile') {
        setDownloadAppConfig(prev => ({
          ...prev,
          mobileImageUrl: result.url
        }))
      }

      toast({
        title: "Éxito",
        description: "Imagen subida correctamente"
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Error",
        description: "Error al subir la imagen",
        variant: "destructive"
      })
    }
  }

  const saveLiveSectionConfig = async () => {
    try {
      const existingConfig = configs.find((c: any) => c.section === 'liveSection')
      console.log('Saving live section config:', liveSectionConfig)
      console.log('Existing config:', existingConfig)

      // Ensure we're sending proper data
      const configData = {
        section: 'liveSection',
        title: liveSectionConfig.title || null,
        description: liveSectionConfig.description || null,
        backgroundImageUrl: liveSectionConfig.backgroundImageUrl || null,
        configData: {
          showLiveIndicator: liveSectionConfig.showLiveIndicator,
          liveIndicatorText: liveSectionConfig.liveIndicatorText || 'EN VIVO AHORA'
        }
      }

      console.log('Sending config data:', configData)

      if (existingConfig) {
        // Update existing
        const response = await fetch('/api/homepage-config', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(configData)
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Update response error:', errorText)
          throw new Error(`Failed to update config: ${response.status} ${errorText}`)
        }
      } else {
        // Create new
        const requestBody = {
          ...configData,
          isActive: true
        }
        console.log('Creating new config with body:', requestBody)

        const response = await fetch('/api/homepage-config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Create response error:', errorText)
          throw new Error(`Failed to create config: ${response.status} ${errorText}`)
        }
      }

      await loadConfigs()
      toast({
        title: "✅ Configuración Guardada",
        description: "La configuración de la sección 'En Vivo Ahora' se ha guardado exitosamente",
        duration: 4000,
      })
    } catch (error) {
      console.error('Error saving live section config:', error)
      toast({
        title: "Error",
        description: `Error al guardar la configuración: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      })
    }
  }

  const saveDownloadAppConfig = async () => {
    try {
      const existingConfig = configs.find((c: any) => c.section === 'downloadApp')
      console.log('Saving download app config:', downloadAppConfig)
      console.log('Existing config:', existingConfig)

      // Ensure we're sending proper data
      const configData = {
        section: 'downloadApp',
        title: downloadAppConfig.title || null,
        description: downloadAppConfig.description || null,
        heroImageUrl: downloadAppConfig.heroImageUrl || null,
        mobileImageUrl: downloadAppConfig.mobileImageUrl || null
      }

      console.log('Sending config data:', configData)

      if (existingConfig) {
        // Update existing
        const response = await fetch('/api/homepage-config', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(configData)
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Update response error:', errorText)
          throw new Error(`Failed to update config: ${response.status} ${errorText}`)
        }
      } else {
        // Create new
        const requestBody = {
          ...configData,
          isActive: true
        }
        console.log('Creating new config with body:', requestBody)

        const response = await fetch('/api/homepage-config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Create response error:', errorText)
          throw new Error(`Failed to create config: ${response.status} ${errorText}`)
        }
      }

      await loadConfigs()
      toast({
        title: "✅ Configuración Guardada", 
        description: "La configuración de la sección 'Descarga App' se ha guardado exitosamente",
        duration: 4000,
      })
    } catch (error) {
      console.error('Error saving download app config:', error)
      toast({
        title: "Error",
        description: `Error al guardar la configuración: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return <div className="p-6">Cargando configuración...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración de Página de Inicio</h1>
        <p className="text-gray-600">Gestiona las imágenes y configuraciones de la página principal</p>
      </div>

      {/* Live Streams Section Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Sección "En Vivo Ahora"
          </CardTitle>
          <CardDescription>
            Configura el fondo y contenido de la sección de transmisiones en vivo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="live-title">Título de la Sección</Label>
              <Input
                id="live-title"
                value={liveSectionConfig.title || ''}
                onChange={(e) => setLiveSectionConfig(prev => ({
                  ...prev,
                  title: String(e.target.value || '')
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="live-background">URL de Imagen de Fondo</Label>
              <Input
                id="live-background"
                value={liveSectionConfig.backgroundImageUrl || ''}
                onChange={(e) => setLiveSectionConfig(prev => ({
                  ...prev,
                  backgroundImageUrl: String(e.target.value || '')
                }))}
                placeholder="/images/fondo-menu-inicio.png"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-live-indicator"
                checked={liveSectionConfig.showLiveIndicator}
                onCheckedChange={(checked) => {
                  console.log('Toggle changed to:', checked)
                  setLiveSectionConfig(prev => ({
                    ...prev,
                    showLiveIndicator: checked
                  }))
                }}
              />
              <Label htmlFor="show-live-indicator">Mostrar Indicador "En Vivo"</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="live-indicator-text">Texto del Indicador</Label>
              <Input
                id="live-indicator-text"
                value={liveSectionConfig.liveIndicatorText || ''}
                onChange={(e) => setLiveSectionConfig(prev => ({
                  ...prev,
                  liveIndicatorText: String(e.target.value || '')
                }))}
                placeholder="EN VIVO AHORA"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="live-description">Descripción</Label>
            <Textarea
              id="live-description"
              value={liveSectionConfig.description || ''}
              onChange={(e) => setLiveSectionConfig(prev => ({
                ...prev,
                description: String(e.target.value || '')
              }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Subir Nueva Imagen de Fondo</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFileUpload(file, 'liveSection', 'background')
                  }
                }}
              />
              <Upload className="h-4 w-4" />
            </div>
          </div>

          {liveSectionConfig.backgroundImageUrl && (
            <div className="space-y-2">
              <Label>Vista Previa de Imagen de Fondo</Label>
              <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={liveSectionConfig.backgroundImageUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <Button 
            onClick={saveLiveSectionConfig}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
            size="lg"
          >
            <Save className="h-5 w-5 mr-2" />
            Guardar Configuración
          </Button>
        </CardContent>
      </Card>

      {/* Download App Section Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Sección "Descarga App"
          </CardTitle>
          <CardDescription>
            Configura la imagen y contenido de la sección de descarga de aplicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="download-title">Título de la Sección</Label>
              <Input
                id="download-title"
                value={downloadAppConfig.title || ''}
                onChange={(e) => setDownloadAppConfig(prev => ({
                  ...prev,
                  title: String(e.target.value || '')
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="download-hero">URL de Imagen Principal</Label>
              <Input
                id="download-hero"
                value={downloadAppConfig.heroImageUrl || ''}
                onChange={(e) => setDownloadAppConfig(prev => ({
                  ...prev,
                  heroImageUrl: String(e.target.value || '')
                }))}
                placeholder="/images/descarga-app-default.png"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="download-mobile">URL de Imagen Mobile</Label>
              <Input
                id="download-mobile"
                value={downloadAppConfig.mobileImageUrl || ''}
                onChange={(e) => setDownloadAppConfig(prev => ({
                  ...prev,
                  mobileImageUrl: String(e.target.value || '')
                }))}
                placeholder="/images/descarga-app-mobile-default.png"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="download-description">Descripción</Label>
            <Textarea
              id="download-description"
              value={downloadAppConfig.description || ''}
              onChange={(e) => setDownloadAppConfig(prev => ({
                ...prev,
                description: String(e.target.value || '')
              }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Subir Nueva Imagen Principal</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFileUpload(file, 'downloadApp', 'hero')
                  }
                }}
              />
              <Upload className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subir Nueva Imagen Mobile</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFileUpload(file, 'downloadApp', 'mobile')
                  }
                }}
              />
              <Upload className="h-4 w-4" />
            </div>
          </div>

          {downloadAppConfig.heroImageUrl && (
            <div className="space-y-2">
              <Label>Vista Previa de Imagen Principal</Label>
              <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={downloadAppConfig.heroImageUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {downloadAppConfig.mobileImageUrl && (
            <div className="space-y-2">
              <Label>Vista Previa de Imagen Mobile</Label>
              <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={downloadAppConfig.mobileImageUrl}
                  alt="Vista previa mobile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Error loading mobile image preview:', downloadAppConfig.mobileImageUrl);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">Imagen Mobile: {downloadAppConfig.mobileImageUrl}</p>
            </div>
          )}

          <Button 
            onClick={saveDownloadAppConfig}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
            size="lg"
          >
            <Save className="h-5 w-5 mr-2" />
            Guardar Configuración
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={async () => {
                try {
                  const response = await fetch('/api/admin/init-db', {
                    method: 'POST'
                  })
                  if (response.ok) {
                    toast({
                      title: "Éxito",
                      description: "Tabla de configuración inicializada"
                    })
                    await loadConfigs()
                  }
                } catch (error) {
                  toast({
                    title: "Error", 
                    description: "Error al inicializar la tabla",
                    variant: "destructive"
                  })
                }
              }}
            >
              Inicializar Tabla de Configuración
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}