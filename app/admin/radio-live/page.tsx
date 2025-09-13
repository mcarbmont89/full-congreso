
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Radio, Users, Wifi, WifiOff, Save, TestTube, RefreshCw } from "lucide-react"

interface LiveRadioConfig {
  streamUrl: string
  isLive: boolean
  currentProgram: string
  description: string
  listeners: number
  quality: 'low' | 'medium' | 'high'
  fallbackUrl?: string
  enableAutoReconnect: boolean
  maxRetries: number
}

export default function RadioLiveAdmin() {
  const [config, setConfig] = useState<LiveRadioConfig>({
    streamUrl: "https://ccstreaming.packet.mx/LiveApp/streams/Radio_kd5oiNTTWO0gEOFc23dr762145.m3u8",
    isLive: false,
    currentProgram: "Transmisión en vivo",
    description: "Escuche la señal en vivo de Radio Congreso",
    listeners: 0,
    quality: 'high',
    fallbackUrl: "",
    enableAutoReconnect: true,
    maxRetries: 3
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [streamStatus, setStreamStatus] = useState<{ connected: boolean; error?: string } | null>(null)

  useEffect(() => {
    loadConfig()
    checkStreamStatus()
    
    // Check stream status every 30 seconds
    const interval = setInterval(checkStreamStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/radio/live-config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('Error loading live radio config:', error)
    }
  }

  const checkStreamStatus = async () => {
    try {
      const response = await fetch('/api/radio/stream-status')
      if (response.ok) {
        const status = await response.json()
        setStreamStatus(status)
        if (status.connected) {
          setConfig(prev => ({ ...prev, listeners: status.listeners || 0 }))
        }
      }
    } catch (error) {
      console.error('Error checking stream status:', error)
      setStreamStatus({ connected: false, error: 'Unable to check stream status' })
    }
  }

  const testStream = async () => {
    setIsTesting(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/radio/test-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamUrl: config.streamUrl })
      })
      
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: 'Error testing stream: ' + (error instanceof Error ? error.message : 'Unknown error') 
      })
    } finally {
      setIsTesting(false)
    }
  }

  const saveConfig = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/radio/live-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        alert('Configuración guardada exitosamente')
        await checkStreamStatus()
      } else {
        throw new Error('Failed to save configuration')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Error al guardar la configuración')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleLiveStatus = async () => {
    const newStatus = !config.isLive
    setConfig(prev => ({ ...prev, isLive: newStatus }))
    
    try {
      await fetch('/api/radio/live-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLive: newStatus })
      })
    } catch (error) {
      console.error('Error updating live status:', error)
      // Revert the change if API call failed
      setConfig(prev => ({ ...prev, isLive: !newStatus }))
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Radio en Vivo</h1>
          <p className="text-gray-600">Configure la transmisión en vivo de Radio Congreso</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={checkStreamStatus}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar Estado
          </Button>
          
          <Button
            onClick={saveConfig}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Configuración
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stream Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {streamStatus?.connected ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              Estado de la Transmisión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="live-status">Transmisión en Vivo</Label>
              <Switch
                id="live-status"
                checked={config.isLive}
                onCheckedChange={toggleLiveStatus}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Estado de Conexión:</span>
                <span className={streamStatus?.connected ? "text-green-600" : "text-red-600"}>
                  {streamStatus?.connected ? "Conectado" : "Desconectado"}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Oyentes Actuales:</span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {config.listeners}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Calidad:</span>
                <span className="capitalize">{config.quality}</span>
              </div>
            </div>

            {streamStatus?.error && (
              <Alert variant="destructive">
                <AlertDescription>{streamStatus.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Stream Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5" />
              Configuración de Stream
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="stream-url">URL de Transmisión (.m3u8)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="stream-url"
                  value={config.streamUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, streamUrl: e.target.value }))}
                  placeholder="https://example.com/stream.m3u8"
                />
                <Button
                  variant="outline"
                  onClick={testStream}
                  disabled={isTesting}
                >
                  <TestTube className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="fallback-url">URL de Respaldo (opcional)</Label>
              <Input
                id="fallback-url"
                value={config.fallbackUrl || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, fallbackUrl: e.target.value }))}
                placeholder="https://backup.example.com/stream.m3u8"
              />
            </div>

            <div>
              <Label htmlFor="current-program">Programa Actual</Label>
              <Input
                id="current-program"
                value={config.currentProgram}
                onChange={(e) => setConfig(prev => ({ ...prev, currentProgram: e.target.value }))}
                placeholder="Nombre del programa en vivo"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={config.description}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción de la transmisión"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quality">Calidad</Label>
                <select
                  id="quality"
                  value={config.quality}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    quality: e.target.value as 'low' | 'medium' | 'high' 
                  }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div>
                <Label htmlFor="max-retries">Máximos Reintentos</Label>
                <Input
                  id="max-retries"
                  type="number"
                  min="1"
                  max="10"
                  value={config.maxRetries}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    maxRetries: parseInt(e.target.value) || 3 
                  }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-reconnect">Reconexión Automática</Label>
              <Switch
                id="auto-reconnect"
                checked={config.enableAutoReconnect}
                onCheckedChange={(checked) => setConfig(prev => ({ 
                  ...prev, 
                  enableAutoReconnect: checked 
                }))}
              />
            </div>

            {testResult && (
              <Alert variant={testResult.success ? "default" : "destructive"}>
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
