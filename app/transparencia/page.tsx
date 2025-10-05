"use client"

import Link from "next/link"
import Footer from "@/components/footer"

export default function TransparenciaPage() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Header Section */}
        <section className="relative z-10 pt-20 pb-8">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-6 mb-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-wider flex items-center">
                TRANSP
                <span className="inline-flex items-center justify-center mx-2">
                  <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 100 100" fill="none">
                    <circle cx="40" cy="40" r="25" stroke="white" strokeWidth="6" opacity="0.9"/>
                    <line x1="58" y1="58" x2="75" y2="75" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.9"/>
                  </svg>
                </span>
                RENCIA
              </h1>
            </div>
          </div>
        </section>

        {/* Circular Hub Navigation */}
        <section className="relative z-10 py-12 pb-24">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-4xl" style={{ height: '600px' }}>
                
                {/* Center Circle - Acerca de nosotros */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-48 h-48 rounded-full border-4 border-white/50 bg-purple-600/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-white">Acerca de</h2>
                      <h2 className="text-2xl font-bold text-white">nosotros</h2>
                    </div>
                  </div>
                </div>

                {/* Connecting circle line */}
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] max-h-[500px]" viewBox="0 0 500 500">
                  <circle cx="250" cy="250" r="180" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
                </svg>

                {/* Top - Información de utilidad pública */}
                <button 
                  onClick={() => scrollToSection('informacion')}
                  className="absolute top-0 left-1/2 -translate-x-1/2 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full border-4 border-white bg-purple-600/80 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-purple-500">
                      <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-white font-semibold text-xs max-w-[120px]">Información de utilidad pública</p>
                    </div>
                  </div>
                </button>

                {/* Top Right - Compromisos */}
                <button 
                  onClick={() => scrollToSection('compromisos')}
                  className="absolute top-16 right-8 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full border-4 border-white bg-purple-600/80 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-purple-500">
                      <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-white font-semibold text-xs max-w-[120px]">Compromisos con la Transparencia</p>
                    </div>
                  </div>
                </button>

                {/* Bottom Right - Transparencia Focalizada */}
                <button 
                  onClick={() => scrollToSection('focalizada')}
                  className="absolute bottom-16 right-8 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full border-4 border-white bg-purple-600/80 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-purple-500">
                      <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-white font-semibold text-xs max-w-[120px]">Transparencia Focalizada</p>
                    </div>
                  </div>
                </button>

                {/* Bottom - Datos Abiertos */}
                <button 
                  onClick={() => scrollToSection('datos-abiertos')}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full border-4 border-white bg-purple-600/80 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-purple-500">
                      <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-white font-semibold text-xs max-w-[120px]">Datos Abiertos</p>
                    </div>
                  </div>
                </button>

                {/* Bottom Left - Normatividad */}
                <button 
                  onClick={() => scrollToSection('normatividad')}
                  className="absolute bottom-16 left-8 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full border-4 border-white bg-purple-600/80 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-purple-500">
                      <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-white font-semibold text-xs max-w-[120px]">Normatividad</p>
                    </div>
                  </div>
                </button>

                {/* Top Left - Estructura y Presupuesto */}
                <button 
                  onClick={() => scrollToSection('estructura')}
                  className="absolute top-16 left-8 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full border-4 border-white bg-purple-600/80 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-purple-500">
                      <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-white font-semibold text-xs max-w-[120px]">Estructura y Presupuesto</p>
                    </div>
                  </div>
                </button>

              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Información de Utilidad Pública */}
        <section id="informacion" className="bg-gradient-to-br from-gray-50 to-purple-50 py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-full border-4 border-purple-600 bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">INFORMACIÓN DE UTILIDAD PÚBLICA</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1 - Defensor de Audiencias */}
              <div className="group">
                <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="inline-block bg-purple-500 rounded-full px-6 py-2 mb-6">
                    <h3 className="text-sm font-bold tracking-wide">DEFENSOR DE AUDIENCIAS</h3>
                  </div>
                  
                  <div className="mb-8 min-h-[280px]">
                    <p className="text-white/90 leading-relaxed">
                      La principal función del Defensor de Audiencia; es recibir, documentar, procesar y dar seguimiento a las observaciones, quejas, sugerencias, peticiones o señalamientos que formulen las personas que componen la audiencia, en materia de contenidos y programación del Canal del Congreso.
                    </p>
                  </div>
                  
                  <Link 
                    href="/defensoria-audiencia"
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 group-hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Entra aquí</span>
                  </Link>
                </div>
              </div>

              {/* Card 2 - Autonomía Técnica */}
              <div className="group">
                <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="inline-block bg-purple-500 rounded-full px-6 py-2 mb-6">
                    <h3 className="text-sm font-bold tracking-wide">AUTONOMÍA TÉCNICA Y DE GESTIÓN</h3>
                  </div>
                  
                  <div className="mb-8 min-h-[280px]">
                    <p className="text-white/90 leading-relaxed">
                      A fin de dar cumplimiento a lo señalado en el artículo 86 de la Ley Federal de Telecomunicaciones y Radiodifusión, que impone obligaciones a los Concesionarios de Uso Público, se reformaron los artículos 140 y 141 de la Ley Orgánica del Congreso General de los Estados Unidos Mexicanos, así como el Reglamento del Canal del Congreso.
                    </p>
                  </div>
                  
                  <button 
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 group-hover:scale-105 cursor-not-allowed opacity-50"
                    disabled
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Entra aquí</span>
                  </button>
                </div>
              </div>

              {/* Card 3 - Adquisiciones */}
              <div className="group">
                <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="inline-block bg-purple-500 rounded-full px-6 py-2 mb-6">
                    <h3 className="text-sm font-bold tracking-wide">ADQUISICIONES</h3>
                  </div>
                  
                  <div className="mb-8 min-h-[280px]">
                    <p className="text-white/90 leading-relaxed">
                      Aquí encontrará información sobre las principales adquisiciones efectuadas durante los ejercicios fiscales, por el Canal del Congreso en la Cámara de Senadores.
                    </p>
                    <p className="text-white/90 leading-relaxed mt-4">
                      Aquí encontrará información sobre las principales adquisiciones efectuadas durante los ejercicios fiscales, por el Canal del Congreso en la Cámara de Diputados.
                    </p>
                  </div>
                  
                  <button 
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 group-hover:scale-105 cursor-not-allowed opacity-50"
                    disabled
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Entra aquí</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 2: Compromisos con la Transparencia */}
        <section id="compromisos" className="bg-white py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-full border-4 border-blue-600 bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">COMPROMISOS CON LA TRANSPARENCIA</h2>
            </div>
            <p className="text-gray-600 text-lg">Contenido en desarrollo...</p>
          </div>
        </section>

        {/* Section 3: Transparencia Focalizada */}
        <section id="focalizada" className="bg-gradient-to-br from-purple-50 to-blue-50 py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-600 bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">TRANSPARENCIA FOCALIZADA</h2>
            </div>
            <p className="text-gray-600 text-lg">Contenido en desarrollo...</p>
          </div>
        </section>

        {/* Section 4: Datos Abiertos */}
        <section id="datos-abiertos" className="bg-white py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-full border-4 border-cyan-600 bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">DATOS ABIERTOS</h2>
            </div>
            <p className="text-gray-600 text-lg">Contenido en desarrollo...</p>
          </div>
        </section>

        {/* Section 5: Normatividad */}
        <section id="normatividad" className="bg-gradient-to-br from-gray-50 to-purple-50 py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-600 bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">NORMATIVIDAD</h2>
            </div>
            <p className="text-gray-600 text-lg">Contenido en desarrollo...</p>
          </div>
        </section>

        {/* Section 6: Estructura y Presupuesto */}
        <section id="estructura" className="bg-white py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-full border-4 border-amber-600 bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">ESTRUCTURA Y PRESUPUESTO</h2>
            </div>
            <p className="text-gray-600 text-lg">Contenido en desarrollo...</p>
          </div>
        </section>

        {/* Defensoría de Audiencia Section */}
        <section className="relative z-10 py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  DEFENSORÍA DE AUDIENCIA
                </h3>
                <p className="text-xl text-purple-200">Canal del Congreso</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
                <p className="text-lg text-white leading-relaxed">
                  La Defensoría de Audiencia es el mecanismo de participación ciudadana que garantiza el derecho a la información, 
                  recibe y da seguimiento a las observaciones, quejas y sugerencias del público respecto a los contenidos y servicios del Canal del Congreso.
                </p>
              </div>

              <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-purple-200 font-medium">Correo electrónico</p>
                    <a href="mailto:defensoria.audiencia@canaldelcongreso.gob.mx" className="text-lg font-semibold text-white hover:text-purple-200 transition-colors">
                      defensoria.audiencia@canaldelcongreso.gob.mx
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-purple-200 font-medium">Envía tu consulta</p>
                    <Link href="/contacto" className="text-lg font-semibold text-white hover:text-purple-200 transition-colors">
                      Formulario de contacto
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
