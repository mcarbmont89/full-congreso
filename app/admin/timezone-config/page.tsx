"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Save, Clock, Globe } from "lucide-react"

interface TimezoneConfig {
  id?: number
  timezone: string
  displayName: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

const TIMEZONE_OPTIONS = [
  { value: 'America/Mexico_City', label: 'Ciudad de México (CST/CDT)', offset: 'UTC-6/-5' },
  { value: 'America/New_York', label: 'Nueva York (EST/EDT)', offset: 'UTC-5/-4' },
  { value: 'America/Los_Angeles', label: 'Los Ángeles (PST/PDT)', offset: 'UTC-8/-7' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: 'UTC-6/-5' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)', offset: 'UTC-7/-6' },
  { value: 'America/Phoenix', label: 'Phoenix (MST)', offset: 'UTC-7' },
  { value: 'America/Anchorage', label: 'Anchorage (AKST/AKDT)', offset: 'UTC-9/-8' },
  { value: 'America/Honolulu', label: 'Honolulu (HST)', offset: 'UTC-10' },
  { value: 'Europe/London', label: 'Londres (GMT/BST)', offset: 'UTC+0/+1' },
  { value: 'Europe/Paris', label: 'París (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'Europe/Berlin', label: 'Berlín (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'Asia/Tokyo', label: 'Tokio (JST)', offset: 'UTC+9' },
  { value: 'Asia/Shanghai', label: 'Shanghái (CST)', offset: 'UTC+8' },
  { value: 'Asia/Dubai', label: 'Dubái (GST)', offset: 'UTC+4' },
  { value: 'Australia/Sydney', label: 'Sídney (AEST/AEDT)', offset: 'UTC+10/+11' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', offset: 'UTC+12/+13' }
]

export default function TimezoneConfigAdmin() {
  const [config, setConfig] = useState<TimezoneConfig>({
    timezone: 'America/Mexico_City',
    displayName: 'Ciudad de México (CST/CDT)',
    isActive: true
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    loadConfig()
    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 1000)
    return () => clearInterval(interval)
  }, [config.timezone])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/timezone-config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('Error loading timezone config:', error)
      toast({
        title: "Error",
        description: "Error al cargar la configuración de zona horaria",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateCurrentTime = () => {
    try {
      const now = new Date()
      const timeInTimezone = new Intl.DateTimeFormat('es-MX', {
        timeZone: config.timezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now)
      setCurrentTime(timeInTimezone)
    } catch (error) {
      setCurrentTime('Error al obtener la hora')
    }
  }

  const handleTimezoneChange = (timezone: string) => {
    const option = TIMEZONE_OPTIONS.find(opt => opt.value === timezone)
    if (option) {
      setConfig(prev => ({
        ...prev,
        timezone,
        displayName: option.label
      }))
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const method = config.id ? 'PUT' : 'POST'
      const response = await fetch('/api/admin/timezone-config', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: config.id,
          timezone: config.timezone,
          displayName: config.displayName
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save timezone configuration')
      }

      const updatedConfig = await response.json()
      setConfig(updatedConfig)

      toast({
        title: "✅ Configuración Guardada",
        description: `Zona horaria actualizada a: ${config.displayName}`,
        duration: 4000,
      })
    } catch (error) {
      console.error('Error saving timezone config:', error)
      toast({
        title: "Error",
        description: "Error al guardar la configuración de zona horaria",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const createTimezoneTable = async () => {
    try {
      const response = await fetch('/api/admin/create-missing-tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          table: 'timezone_config'
        })
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Tabla de configuración de zona horaria creada",
        })
        await loadConfig()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear la tabla de configuración",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return <div className="p-6">Cargando configuración de zona horaria...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración de Zona Horaria</h1>
        <p className="text-gray-600">
          Configura la zona horaria que se usará para todos los elementos publicados en el sistema
        </p>
      </div>

      {/* Current Time Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Hora Actual
          </CardTitle>
          <CardDescription>
            Hora actual en la zona horaria configurada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono font-bold text-blue-600">
            {currentTime}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Zona horaria: {config.displayName}
          </div>
        </CardContent>
      </Card>

      {/* Timezone Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Configuración de Zona Horaria
          </CardTitle>
          <CardDescription>
            Selecciona la zona horaria que se aplicará a todas las publicaciones programadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Zona Horaria</Label>
            <Select value={config.timezone} onValueChange={handleTimezoneChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una zona horaria" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-gray-500">{option.offset}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Nombre para Mostrar</Label>
            <Input
              id="displayName"
              value={config.displayName}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                displayName: e.target.value
              }))}
              placeholder="Ej: Ciudad de México (CST/CDT)"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar Configuración'}
            </Button>

            <Button 
              onClick={createTimezoneTable}
              variant="outline"
            >
              Crear Tabla de Configuración
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Impact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Impacto de los Cambios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• La zona horaria configurada afectará a todas las publicaciones programadas</p>
            <p>• Los elementos de noticias y episodios de radio se publicarán según esta zona horaria</p>
            <p>• Los usuarios verán las fechas y horas en formato local del sistema</p>
            <p>• Esta configuración es global para toda la aplicación</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}