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
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-sm sm:text-base text-gray-600">Canal del Congreso - CMS</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            {user && (
              <span className="text-xs sm:text-sm text-gray-600">
                Bienvenido, {user.username}
              </span>
            )}
            <Button onClick={handleLogout} variant="outline" className="w-full sm:w-auto min-h-[44px]">
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                <Button className="w-full min-h-[44px] text-sm sm:text-base">
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
                <Button className="w-full min-h-[44px] text-sm sm:text-base">
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
                <Button className="w-full min-h-[44px] text-sm sm:text-base">
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
                <Button className="w-full min-h-[44px] text-sm sm:text-base">
                  Gestionar Noticias
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Transparency Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Secciones de Transparencia
              </CardTitle>
              <CardDescription>
                Administrar contenido de transparencia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/transparency-sections">
                <Button className="w-full min-h-[44px] text-sm sm:text-base">
                  Gestionar Transparencia
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
              <Button className="w-full min-h-[44px] text-sm sm:text-base" variant="outline">
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
            <div className="space-y-2 sm:space-y-3">
              <Link 
                href="/admin/radio-programs" 
                className="block p-3 border rounded hover:bg-gray-50 min-h-[44px] flex flex-col justify-center touch-manipulation"
              >
                <div className="font-medium text-sm sm:text-base">Programas de Radio</div>
                <div className="text-xs sm:text-sm text-gray-600">Gestionar programas destacados y episodios</div>
              </Link>
               <Link 
                href="/admin/radio-categories" 
                className="block p-3 border rounded hover:bg-gray-50 min-h-[44px] flex flex-col justify-center touch-manipulation"
              >
                <div className="font-medium text-sm sm:text-base">Categorías del Carrusel</div>
                <div className="text-xs sm:text-sm text-gray-600">Gestionar imágenes de categorías</div>
              </Link>

              <Link 
                href="/admin/radio-episodes" 
                className="block p-3 border rounded hover:bg-gray-50 min-h-[44px] flex flex-col justify-center touch-manipulation"
              >
                <div className="font-medium text-sm sm:text-base">Radio Episodes</div>
                <div className="text-xs sm:text-sm text-gray-600">Gestionar episodios de audio MP3</div>
              </Link>

              <Link 
                href="/admin/radio-live" 
                className="block p-3 border rounded hover:bg-gray-50 min-h-[44px] flex flex-col justify-center touch-manipulation"
              >
                <div className="font-medium text-sm sm:text-base">Radio en Vivo</div>
                <div className="text-xs sm:text-sm text-gray-600">Configurar transmisión en vivo</div>
              </Link>
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Status Section */}
        <div className="mt-6 md:mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Estado del Sistema</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Información sobre el estado actual del CMS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex items-center gap-2 p-2 sm:p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm font-medium">Sistema Operativo</span>
                </div>
                <div className="flex items-center gap-2 p-2 sm:p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm font-medium">Autenticación Activa</span>
                </div>
                <div className="flex items-center gap-2 p-2 sm:p-3 bg-yellow-50 rounded-lg sm:col-span-2 md:col-span-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm font-medium">Base de Datos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}