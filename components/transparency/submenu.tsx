"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function TransparencySubmenu() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname?.startsWith(path) 
      ? "text-blue-600 font-semibold bg-blue-50 px-3 py-2 rounded-lg border-l-4 border-blue-600" 
      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-all duration-200"
  }

  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 py-6 border-t border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Compromisos con la Transparencia */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-3"></div>
              <h3 className="text-gray-800 font-bold text-lg">COMPROMISOS CON LA TRANSPARENCIA</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/transparencia/compromisos/tu-canal"
                  className={isActive("/transparencia/compromisos/tu-canal")}
                >
                  TU CANAL
                </Link>
              </li>
              <li>
                <Link
                  href="/transparencia/compromisos/normatividad"
                  className={isActive("/transparencia/compromisos/normatividad")}
                >
                  NORMATIVIDAD
                </Link>
              </li>
              <li>
                <Link
                  href="/transparencia/compromisos/estructura"
                  className={isActive("/transparencia/compromisos/estructura")}
                >
                  ESTRUCTURA Y PRESUPUESTO
                </Link>
              </li>
              <li>
                <Link
                  href="/transparencia/compromisos/informacion"
                  className={isActive("/transparencia/compromisos/informacion")}
                >
                  INFORMACIÓN RELEVANTE Y DE UTILIDAD PÚBLICA
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Transparencia Focalizada */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full mr-3"></div>
              <h3 className="text-gray-800 font-bold text-lg">TRANSPARENCIA FOCALIZADA</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/transparencia/focalizada/tu-congreso"
                  className={isActive("/transparencia/focalizada/tu-congreso")}
                >
                  TU CONGRESO
                </Link>
              </li>
              <li>
                <Link
                  href="/transparencia/focalizada/representantes"
                  className={isActive("/transparencia/focalizada/representantes")}
                >
                  TUS REPRESENTANTES
                </Link>
              </li>
              <li>
                <Link
                  href="/transparencia/focalizada/ciudadania"
                  className={isActive("/transparencia/focalizada/ciudadania")}
                >
                  LA CIUDADANÍA Y EL CONGRESO
                </Link>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full mr-3"></div>
                <h3 className="text-gray-800 font-bold text-lg">DATOS ABIERTOS</h3>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/transparencia/datos-abiertos" className={isActive("/transparencia/datos-abiertos")}>
                    DATOS ABIERTOS
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Plataforma Nacional */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full mr-3"></div>
              <h3 className="text-gray-800 font-bold text-lg">PLATAFORMA NACIONAL DE TRANSPARENCIA</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Accede al Sistema Nacional de Transparencia para realizar solicitudes de información pública.
              </p>
              <a
                href="https://www.plataformadetransparencia.org.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <span>ACCEDER A LA PLATAFORMA</span>
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
