"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Users, Settings, FileText, Radio, Tv } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is authenticated
    fetch('/api/auth/verify')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(err => console.error('Auth check failed:', err))
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600">Canal del Congreso - CMS</p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600">
                Bienvenido, {user.username}
              </span>
            )}
            <Button onClick={handleLogout} variant="outline">
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Database Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configuración de Base de Datos
              </CardTitle>
              <CardDescription>
                Configurar y gestionar la conexión a la base de datos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/database-config">
                <Button className="w-full">
                  Configurar Base de Datos
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Programs Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tv className="h-5 w-5" />
                Gestión de Programas
              </CardTitle>
              <CardDescription>
                Administrar programas de televisión y contenido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/programs">
                <Button className="w-full">
                  Gestionar Programas
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Live Streams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5" />
                Transmisiones en Vivo
              </CardTitle>
              <CardDescription>
                Gestionar señales y transmisiones en directo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/live-streams">
                <Button className="w-full">
                  Gestionar Transmisiones
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* News Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gestión de Noticias
              </CardTitle>
              <CardDescription>
                Administrar noticias y artículos del congreso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/news">
                <Button className="w-full">
                  Gestionar Noticias
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración
              </CardTitle>
              <CardDescription>
                Configuraciones generales del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Configuración
              </Button>
            </CardContent>
          </Card>

          


          <Card>
          <CardHeader>
            <CardTitle>Gestión de Radio</CardTitle>
            <CardDescription>
              Administra contenido de Radio Congreso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link 
                href="/admin/radio-programs" 
                className="block p-3 border rounded hover:bg-gray-50"
              >
                <div className="font-medium">Programas de Radio</div>
                <div className="text-sm text-gray-600">Gestionar programas destacados y episodios</div>
              </Link>
               <Link 
                href="/admin/radio-categories" 
                className="block p-3 border rounded hover:bg-gray-50"
              >
                <div className="font-medium">Imágenes de Categorías del Carrusel</div>
                <div className="text-sm text-gray-600">Gestionar imágenes de categorías para el carrusel de radio</div>
              </Link>

              <Link 
                href="/admin/radio-episodes" 
                className="block p-3 border rounded hover:bg-gray-50"
              >
                <div className="font-medium">Radio Episodes</div>
                <div className="text-sm text-gray-600">Gestionar episodios de audio MP3 por categorías</div>
              </Link>

              <Link 
                href="/admin/radio-live" 
                className="block p-3 border rounded hover:bg-gray-50"
              >
                <div className="font-medium">Radio en Vivo</div>
                <div className="text-sm text-gray-600">Configurar transmisión en vivo y estado del stream</div>
              </Link>

              <button 
                onClick={async () => {
                  try {
                    const response = await fetch('/api/admin/init-radio', { method: 'POST' })
                    const result = await response.json()
                    alert(result.success ? 'Radio database initialized!' : 'Error: ' + result.error)
                  } catch (error) {
                    console.error('Error initializing radio:', error)
                    alert('Error initializing radio database')
                  }
                }}
                className="block w-full p-3 border rounded hover:bg-gray-50 text-left"
              >
                <div className="font-medium">Inicializar Base de Datos Radio</div>
                <div className="text-sm text-gray-600">Crear tablas y datos iniciales para Radio</div>
              </button>
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Status Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
              <CardDescription>
                Información sobre el estado actual del CMS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Sistema Operativo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Autenticación Activa</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Base de Datos </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}