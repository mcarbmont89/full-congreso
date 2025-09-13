"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useMobileMenu } from "@/components/mobile-menu-context"

export default function Navbar() {
  const pathname = usePathname()
  const { isMenuOpen, toggleMenu, closeMenu } = useMobileMenu()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname?.startsWith(path)) return true
    return false
  }

  return (
    <header className="bg-white text-gray-800 relative z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" onClick={closeMenu}>
            <div className="flex items-center">
              <Image
                src="/images/logo-canal-congreso.png"
                alt="Canal del Congreso"
                width={0}
                height={0}
                className="h-20 md:h-24 w-auto"
                priority
              />
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex space-x-6 uppercase text-sm font-medium">
          <Link href="/" className={isActive("/") ? "text-[#3b0764] font-bold" : "hover:text-[#3b0764]"}>
            Inicio
          </Link>
          <Link
            href="/programacion"
            className={isActive("/programacion") ? "text-[#3b0764] font-bold" : "hover:text-[#3b0764]"}
          >
            Programación
          </Link>
          <Link
            href="/radio"
            className={isActive("/radio") ? "text-[#3b0764] font-bold" : "hover:text-[#3b0764]"}
          >
            Radio
          </Link>
          <Link
            href="/noticias"
            className={isActive("/noticias") ? "text-[#3b0764] font-bold" : "hover:text-[#3b0764]"}
          >
            Noticias
          </Link>
          <a
            href="https://www.canaldelcongreso.gob.mx/Transparencia"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#3b0764]"
          >
            Transparencia
          </a>
          <Link
            href="/contacto"
            className={isActive("/contacto") ? "text-[#3b0764] font-bold" : "hover:text-[#3b0764]"}
          >
            Contacto
          </Link>
        </nav>

        <button
          className="md:hidden text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3b0764] focus:ring-opacity-50 rounded-md p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Menú principal"
          type="button"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu-container absolute top-full ml-auto w-[85%] bg-white shadow-lg border-t border-gray-200 z-[60] md:hidden">
          <nav className="px-4 py-4 flex flex-col space-y-2 uppercase text-sm font-medium">
            <Link
              href="/"
              onClick={closeMenu}
              className={`block py-3 px-2 min-h-[44px] flex items-center rounded-md transition-colors ${
                isActive("/") ? "text-[#3b0764] font-bold bg-purple-50" : "hover:text-[#3b0764] hover:bg-gray-50"
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/programacion"
              onClick={closeMenu}
              className={`block py-3 px-2 min-h-[44px] flex items-center rounded-md transition-colors ${
                isActive("/programacion") ? "text-[#3b0764] font-bold bg-purple-50" : "hover:text-[#3b0764] hover:bg-gray-50"
              }`}
            >
              Programación
            </Link>
            <Link
              href="/radio"
              onClick={closeMenu}
              className={`block py-3 px-2 min-h-[44px] flex items-center rounded-md transition-colors ${
                isActive("/radio") ? "text-[#3b0764] font-bold bg-purple-50" : "hover:text-[#3b0764] hover:bg-gray-50"
              }`}
            >
              Radio
            </Link>
            <Link
              href="/noticias"
              onClick={closeMenu}
              className={`block py-3 px-2 min-h-[44px] flex items-center rounded-md transition-colors ${
                isActive("/noticias") ? "text-[#3b0764] font-bold bg-purple-50" : "hover:text-[#3b0764] hover:bg-gray-50"
              }`}
            >
              Noticias
            </Link>
            <a
              href="https://www.canaldelcongreso.gob.mx/Transparencia"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="block py-3 px-2 min-h-[44px] flex items-center rounded-md transition-colors hover:text-[#3b0764] hover:bg-gray-50"
            >
              Transparencia
            </a>
            <a
              href="https://www.canaldelcongreso.gob.mx/Transparencia/contacto"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="block py-3 px-2 min-h-[44px] flex items-center rounded-md transition-colors hover:text-[#3b0764] hover:bg-gray-50"
            >
              Contacto
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}