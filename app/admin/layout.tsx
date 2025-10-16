"use client"

import Link from "next/link"
import { Inter } from "next/font/google"
import { Home, Monitor, BarChart3, Newspaper, Users, Settings, LogOut, Mail, Radio, Mic, Building, LayoutDashboard, Eye, Globe, Menu, X, Clock } from 'lucide-react'
import { Toaster } from "@/components/ui/toaster"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Video } from 'lucide-react'
import { Button } from "@/components/ui/button"

const inter = Inter({ subsets: ['latin'] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Function to determine link class based on active path
  const linkClassName = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center gap-3 px-3 py-2 rounded-lg min-h-[44px] touch-manipulation ${
      isActive
        ? "bg-blue-500 text-white font-semibold"
        : "text-gray-700 hover:bg-gray-100"
    }`;
  };

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className={`${inter.className} flex min-h-screen bg-gray-100`}>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="outline"
          size="sm"
          className="bg-white shadow-md"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-white shadow-lg fixed lg:static inset-y-0 left-0 z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
        <div className="p-4 sm:p-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Admin CMS</h1>
          <p className="text-xs sm:text-sm text-gray-600">Canal del Congreso</p>
        </div>

        <nav className="mt-4 sm:mt-6">
          <div className="px-3 sm:px-4 space-y-1 sm:space-y-2">
            <Link 
              href="/admin" 
              className={linkClassName("/admin")}
            >
              <Home className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Dashboard</span>
            </Link>


            <Link 
              href="/admin/live-streams" 
              className={linkClassName("/admin/live-streams")}
            >
              <Monitor className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Transmisiones</span>
            </Link>
            <Link
              href="/admin/homepage-config"
              className={linkClassName("/admin/homepage-config")}
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Config Homepage</span>
            </Link>

            <Link 
              href="/admin/programs" 
              className={linkClassName("/admin/programs")}
            >
              <BarChart3 className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Programas TV</span>
            </Link>

            <Link 
              href="/admin/programacion" 
              className={linkClassName("/admin/programacion")}
            >
              <Monitor className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Programación</span>
            </Link>

            <Link 
              href="/admin/news" 
              className={linkClassName("/admin/news")}
            >
              <Newspaper className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Noticias</span>
            </Link>

            <Link 
              href="/admin/video-news" 
              className={linkClassName("/admin/video-news")}
            >
              <Video className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Video Noticias</span>
            </Link>

            <Link 
              href="/admin/documents" 
              className={linkClassName("/admin/documents")}
            >
              <Globe className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Documentos</span>
            </Link>

            <Link 
              href="/admin/defensoria" 
              className={linkClassName("/admin/defensoria")}
            >
              <Mic className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Defensoría</span>
            </Link>

            <Link 
              href="/admin/users" 
              className={linkClassName("/admin/users")}
            >
              <Users className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Usuarios</span>
            </Link>

            <Link 
              href="/admin/database-config" 
              className={linkClassName("/admin/database-config")}
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Base de Datos</span>
            </Link>

             <Link 
               href="/admin/smtp-config" 
               className={linkClassName("/admin/smtp-config")}
             >
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">SMTP Config</span>
            </Link>

            <Link 
              href="/admin/radio-programs" 
              className={linkClassName("/admin/radio-programs")}
            >
              <Radio className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Radio Programas</span>
            </Link>

            <Link 
              href="/admin/organs" 
              className={linkClassName("/admin/organs")}
            >
              <Building className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Órganos</span>
            </Link>

            <Link 
              href="/admin/pages" 
              className={linkClassName("/admin/pages")}
            >
              <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Páginas</span>
            </Link>

            <Link 
              href="/admin/channels" 
              className={linkClassName("/admin/channels")}
            >
              <Monitor className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Canales</span>
            </Link>

             <Link 
               href="/admin/featured-programs" 
               className={linkClassName("/admin/featured-programs")}
             >
              <Eye className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Programas Destacados</span>
            </Link>

            <Link 
              href="/admin/timezone-config" 
              className={linkClassName("/admin/timezone-config")}
            >
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Zona Horaria</span>
            </Link>

            <Link 
              href="/admin/transparency-sections" 
              className={linkClassName("/admin/transparency-sections")}
            >
              <Eye className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Transparencia</span>
            </Link>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link 
                href="/" 
                className={linkClassName("/")}
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm sm:text-base">Salir al Sitio</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="lg:hidden h-16"></div> {/* Spacer for mobile menu button */}
        {children}
        <Toaster />
      </div>
    </div>
  )
}