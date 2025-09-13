"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, FileSpreadsheet, RefreshCw, Save, Tv, Upload } from 'lucide-react'

export default function ProgramacionAdmin() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [programmingData, setProgrammingData] = useState<any>(null)

  // Load current programming data on component mount
  useEffect(() => {
    loadCurrentProgramming()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage('Por favor selecciona un archivo Excel')
      return
    }

    setUploading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('excel', file)

      const response = await fetch('/api/programacion/upload', {
        method: 'POST',
        body: formData
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response')
      }

      const result = await response.json()

      if (response.ok) {
        setMessage('Excel procesado exitosamente')
        setProgrammingData(result.data)
      } else {
        setMessage(result.error || 'Error al procesar el archivo')
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        setMessage('Error: El servidor no devolvió una respuesta válida')
      } else {
        setMessage('Error al subir el archivo: ' + (error instanceof Error ? error.message : 'Error desconocido'))
      }
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProgramming = async () => {
    if (!programmingData) {
      setMessage('No hay datos de programación para guardar')
      return
    }

    try {
      const response = await fetch('/api/programacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'update_from_excel',
          data: programmingData
        })
      })

      if (response.ok) {
        setMessage('Programación guardada exitosamente')
        loadCurrentProgramming()
      } else {
        setMessage('Error al guardar la programación')
      }
    } catch (error) {
      setMessage('Error al guardar la programación')
      console.error('Save error:', error)
    }
  }

  const handleClearProgramming = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar todos los datos de programación? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch('/api/programacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'clear_data'
        })
      })

      if (response.ok) {
        setMessage('Datos de programación eliminados exitosamente')
        setProgrammingData(null)
        setFile(null)
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
        if (fileInput) {
          fileInput.value = ''
        }
      } else {
        setMessage('Error al eliminar los datos de programación')
      }
    } catch (error) {
      setMessage('Error al eliminar los datos de programación')
      console.error('Clear error:', error)
    }
  }

  const loadCurrentProgramming = async () => {
    try {
      const response = await fetch('/api/programacion')
      const data = await response.json()
      
      if (response.ok) {
        setProgrammingData(data.data)
      } else {
        setMessage('Error al cargar la programación')
      }
    } catch (error) {
      setMessage('Error al cargar la programación')
      console.error('Load error:', error)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-purple-600" />
            Programación Diaria
          </h1>
          <p className="text-gray-600 mt-1">Gestiona la programación diaria de todos los canales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Subir Programación Excel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="mb-4"
                />
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Archivo Excel con 3 hojas (Canales: 45.1, 45.2, 45.3)
                </p>
              </div>

              <Button 
                onClick={handleUpload} 
                disabled={!file || uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir y Procesar Excel
                  </>
                )}
              </Button>

              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tv className="h-5 w-5" />
              Acciones de Programación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="font-semibold text-purple-700">Canal 45.1</div>
                  <div className="text-purple-600">Principal</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="font-semibold text-blue-700">Canal 45.2</div>
                  <div className="text-blue-600">Secundario</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="font-semibold text-green-700">Canal 45.3</div>
                  <div className="text-green-600">Tercero</div>
                </div>
              </div>

              <div className="space-y-3">
                {programmingData && (
                  <Button 
                    onClick={handleSaveProgramming}
                    className="w-full"
                    variant="default"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Programación
                  </Button>
                )}

                {programmingData && (
                  <Button 
                    onClick={handleClearProgramming}
                    className="w-full"
                    variant="destructive"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Eliminar Datos de Programación
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {programmingData && (
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa de Programación</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="45.1">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="45.1">Canal 45.1</TabsTrigger>
                <TabsTrigger value="45.2">Canal 45.2</TabsTrigger>
                <TabsTrigger value="45.3">Canal 45.3</TabsTrigger>
              </TabsList>

              {Object.keys(programmingData).map(channel => (
                <TabsContent key={channel} value={channel}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2">Hora</th>
                          <th className="border border-gray-300 px-4 py-2">Programa</th>
                          <th className="border border-gray-300 px-4 py-2">Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {programmingData[channel]?.map((program: any, index: number) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">
                              {program.hora || program.time || 'N/A'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {program.programa || program.program || 'N/A'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {program.descripcion || program.description || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}