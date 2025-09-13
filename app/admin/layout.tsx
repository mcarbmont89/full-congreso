"use client"

import Link from "next/link"
import { Inter } from "next/font/google"
import { Home, Monitor, BarChart3, Newspaper, Users, Settings, LogOut, Mail, Radio, Mic, Building, LayoutDashboard, Eye, Globe } from 'lucide-react'
import { Toaster } from "@/components/ui/toaster"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Video } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} flex min-h-screen bg-gray-100`}>
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">Admin CMS</h1>
          <p className="text-sm text-gray-600">Canal del Congreso</p>
        </div>

        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>


            <Link href="/admin/live-streams" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Monitor className="h-4 w-4" />
              Transmisiones
            </Link>
            <Link
              href="/admin/homepage-config"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Settings className="h-4 w-4" />
              Configuración de Homepage
            </Link>

            <Link href="/admin/programs" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <BarChart3 className="h-4 w-4" />
              Programas TV
            </Link>

            <Link href="/admin/programacion" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Monitor className="h-4 w-4" />
              Programación Diaria
            </Link>

            <Link href="/admin/news" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Newspaper className="h-4 w-4" />
              Noticias
            </Link>

            <Link href="/admin/video-news" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Video className="h-4 w-4" />
              Video Noticias
            </Link>

            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Users className="h-4 w-4" />
              Gestión de Usuarios
            </Link>

            <Link href="/admin/database-config" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Settings className="h-4 w-4" />
              Base de Datos
            </Link>

             <Link href="/admin/smtp-config" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Mail className="h-4 w-4" />
              SMTP Config
            </Link>

            <Link href="/admin/radio-programs" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Radio className="h-4 w-4" />
              Radio Programas
            </Link>

            <Link href="/admin/organs" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Building className="h-4 w-4" />
              Órganos
            </Link>


            <Link href="/admin/pages" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <LayoutDashboard className="h-4 w-4" />
              Páginas
            </Link>

            <Link href="/admin/channels" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Monitor className="h-4 w-4" />
              Canales
            </Link>

             <Link href="/admin/featured-programs" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Eye className="h-4 w-4" />
              Programas Destacados
            </Link>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link href="/" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <LogOut className="h-4 w-4" />
                Salir al Sitio
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
        <Toaster />
      </div>
    </div>
  )
}