
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface SmtpConfig {
  host: string
  port: string
  secure: boolean
  user: string
  pass: string
  from: string
  to: string
}

export function SmtpConfigClient() {
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>({
    host: "",
    port: "587",
    secure: false,
    user: "",
    pass: "",
    from: "",
    to: "",
  })

  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error"
    message: string
  }>({
    type: "idle",
    message: "",
  })

  const [testStatus, setTestStatus] = useState<{
    type: "idle" | "testing" | "success" | "error"
    message: string
  }>({
    type: "idle",
    message: "",
  })

  useEffect(() => {
    loadSmtpConfig()
  }, [])

  const loadSmtpConfig = async () => {
    try {
      const response = await fetch("/api/smtp/config")
      if (response.ok) {
        const config = await response.json()
        setSmtpConfig(config)
      }
    } catch (error) {
      console.error("Error loading SMTP config:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSmtpConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ type: "loading", message: "Guardando configuración..." })

    // Validation
    if (!smtpConfig.host || !smtpConfig.port || !smtpConfig.user || !smtpConfig.from || !smtpConfig.to) {
      setStatus({
        type: "error",
        message: "Todos los campos son requeridos.",
      })
      return
    }

    try {
      const response = await fetch("/api/smtp/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(smtpConfig),
      })

      const result = await response.json()

      if (result.success) {
        setStatus({
          type: "success",
          message: "Configuración SMTP guardada correctamente.",
        })
        // Reload config to get masked password
        loadSmtpConfig()
      } else {
        setStatus({
          type: "error",
          message: result.message || "Error al guardar la configuración SMTP.",
        })
      }
    } catch (error) {
      console.error("Error saving SMTP config:", error)
      setStatus({
        type: "error",
        message: "Error de conexión al guardar la configuración SMTP.",
      })
    }
  }

  const handleTestEmail = async () => {
    setTestStatus({ type: "testing", message: "Enviando email de prueba..." })

    // Validate that we have the required config
    if (!smtpConfig.host || !smtpConfig.user || !smtpConfig.from || !smtpConfig.to) {
      setTestStatus({
        type: "error",
        message: "Configuración SMTP incompleta. Guarda la configuración primero.",
      })
      return
    }

    try {
      const response = await fetch("/api/smtp/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: "Sistema de Prueba",
          email: smtpConfig.from,
          asunto: "Email de prueba - Configuración SMTP",
          mensaje: "Este es un email de prueba para verificar que la configuración SMTP está funcionando correctamente.",
          telefono: "",
          empresa: "Canal del Congreso",
          puesto: "Sistema",
          ciudad: "",
          estado: "",
        }),
      })

      const result = await response.json()

      if (result.success) {
        setTestStatus({
          type: "success",
          message: "Email de prueba enviado correctamente.",
        })
      } else {
        setTestStatus({
          type: "error",
          message: result.message || "Error al enviar el email de prueba.",
        })
      }
    } catch (error) {
      console.error("Error testing email:", error)
      setTestStatus({
        type: "error",
        message: "Error de conexión al probar el email.",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Servidor SMTP</CardTitle>
          <CardDescription>
            Configure los parámetros del servidor de correo para el envío de formularios de contacto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="host">Servidor SMTP</Label>
                <Input
                  id="host"
                  name="host"
                  type="text"
                  value={smtpConfig.host}
                  onChange={handleChange}
                  placeholder="smtp.gmail.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="port">Puerto</Label>
                <Input
                  id="port"
                  name="port"
                  type="number"
                  value={smtpConfig.port}
                  onChange={handleChange}
                  placeholder="587"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user">Usuario/Email</Label>
                <Input
                  id="user"
                  name="user"
                  type="email"
                  value={smtpConfig.user}
                  onChange={handleChange}
                  placeholder="your-email@gmail.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pass">Contraseña</Label>
                <Input
                  id="pass"
                  name="pass"
                  type="password"
                  value={smtpConfig.pass}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from">Email Remitente</Label>
                <Input
                  id="from"
                  name="from"
                  type="email"
                  value={smtpConfig.from}
                  onChange={handleChange}
                  placeholder="notificaciones@canaldelcongreso.gob.mx"
                  required
                />
              </div>
              <div>
                <Label htmlFor="to">Email Destino</Label>
                <Input
                  id="to"
                  name="to"
                  type="email"
                  value={smtpConfig.to}
                  onChange={handleChange}
                  placeholder="contacto@canaldelcongreso.gob.mx"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="secure"
                name="secure"
                type="checkbox"
                checked={smtpConfig.secure}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="secure">Usar conexión SSL/TLS segura</Label>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button 
                type="submit" 
                disabled={status.type === "loading"}
                className="min-w-[120px]"
              >
                {status.type === "loading" ? "Guardando..." : "Guardar Configuración"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleTestEmail}
                disabled={testStatus.type === "testing" || !smtpConfig.host}
                className="min-w-[120px]"
              >
                {testStatus.type === "testing" ? "Enviando..." : "Probar Email"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {(status.message || testStatus.message) && (
        <div className="space-y-3">
          {status.message && (
            <Card>
              <CardContent className="pt-6">
                <div className={`p-4 rounded-lg flex items-center gap-2 ${
                  status.type === "success" 
                    ? "bg-green-50 text-green-800 border border-green-200" 
                    : status.type === "error"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}>
                  {status.type === "success" && <CheckCircle className="h-4 w-4" />}
                  {status.type === "error" && <XCircle className="h-4 w-4" />}
                  {status.type === "loading" && <AlertTriangle className="h-4 w-4" />}
                  <span className="font-medium">{status.message}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {testStatus.message && (
            <Card>
              <CardContent className="pt-6">
                <div className={`p-4 rounded-lg flex items-center gap-2 ${
                  testStatus.type === "success" 
                    ? "bg-green-50 text-green-800 border border-green-200" 
                    : testStatus.type === "error"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}>
                  {testStatus.type === "success" && <CheckCircle className="h-4 w-4" />}
                  {testStatus.type === "error" && <XCircle className="h-4 w-4" />}
                  {testStatus.type === "testing" && <AlertTriangle className="h-4 w-4" />}
                  <span className="font-medium">{testStatus.message}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Current Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Configuración</CardTitle>
          <CardDescription>
            Estado actual de la configuración SMTP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Servidor</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span>Host:</span>
                  {smtpConfig.host ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {smtpConfig.host}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      No configurado
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>Puerto:</span>
                  <Badge variant="secondary">{smtpConfig.port}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>SSL/TLS:</span>
                  <Badge variant={smtpConfig.secure ? "default" : "secondary"}>
                    {smtpConfig.secure ? "Habilitado" : "Deshabilitado"}
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Emails</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span>Remitente:</span>
                  {smtpConfig.from ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {smtpConfig.from}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      No configurado
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>Destino:</span>
                  {smtpConfig.to ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {smtpConfig.to}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      No configurado
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
