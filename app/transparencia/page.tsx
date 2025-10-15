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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
        </div>

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

        <section className="relative z-10 py-12 pb-24">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-4xl" style={{ height: '600px' }}>
                
                <button onClick={() => scrollToSection('acerca')} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer">
                  <div className="w-48 h-48 rounded-full border-4 border-white/50 bg-purple-600/80 backdrop-blur-sm flex items-center justify-center hover:bg-purple-500 transition-all">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-white">Acerca de</h2>
                      <h2 className="text-2xl font-bold text-white">nosotros</h2>
                    </div>
                  </div>
                </button>

                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] max-h-[500px]" viewBox="0 0 500 500">
                  <circle cx="250" cy="250" r="180" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
                </svg>

                <button onClick={() => scrollToSection('informacion')} className="absolute top-0 left-1/2 -translate-x-1/2 group cursor-pointer">
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

                <button onClick={() => scrollToSection('compromisos')} className="absolute top-16 right-8 group cursor-pointer">
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

                <button onClick={() => scrollToSection('focalizada')} className="absolute bottom-16 right-8 group cursor-pointer">
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

                <button onClick={() => scrollToSection('datos-abiertos')} className="absolute bottom-0 left-1/2 -translate-x-1/2 group cursor-pointer">
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

                <button onClick={() => scrollToSection('normatividad')} className="absolute bottom-16 left-8 group cursor-pointer">
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

                <button onClick={() => scrollToSection('estructura')} className="absolute top-16 left-8 group cursor-pointer">
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

        <section id="informacion" className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">INFORMACIÓN DE UTILIDAD PÚBLICA</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-6 py-2 mb-6">
                    <h3 className="text-sm font-bold tracking-wide">DEFENSOR DE AUDIENCIAS</h3>
                  </div>
                  
                  <div className="mb-8 min-h-[240px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      La principal función del Defensor de Audiencia; es recibir, documentar, procesar y dar seguimiento a las observaciones, quejas, sugerencias, peticiones o señalamientos que formulen las personas que componen la audiencia, en materia de contenidos y programación del Canal del Congreso.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-6 py-2 mb-6">
                    <h3 className="text-sm font-bold tracking-wide">AUTONOMÍA TÉCNICA Y DE GESTIÓN</h3>
                  </div>
                  
                  <div className="mb-8 min-h-[240px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      A fin de dar cumplimiento a lo señalado en el artículo 86 de la Ley Federal de Telecomunicaciones y Radiodifusión, que impone obligaciones a los Concesionarios de Uso Público, se reformaron los artículos 140 y 141 de la Ley Orgánica del Congreso General de los Estados Unidos Mexicanos, así como el Reglamento del Canal del Congreso.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-6 py-2 mb-6">
                    <h3 className="text-sm font-bold tracking-wide">ADQUISICIONES</h3>
                  </div>
                  
                  <div className="mb-8 min-h-[240px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      Aquí encontrará información sobre las principales adquisiciones efectuadas durante los ejercicios fiscales, por el Canal del Congreso en la Cámara de Senadores.
                    </p>
                    <p className="text-white/90 leading-relaxed mt-4 text-sm">
                      Aquí encontrará información sobre las principales adquisiciones efectuadas durante los ejercicios fiscales, por el Canal del Congreso en la Cámara de Diputados.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section id="estructura" className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">ESTRUCTURA Y PRESUPUESTO</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-6 py-2 mb-6">
                    <h3 className="text-sm font-bold tracking-wide">PRESUPUESTO</h3>
                  </div>
                  
                  <div className="mb-8 min-h-[240px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      Información del presupuesto autorizado y ejercido por el Canal del Congreso en la Cámara de Senadores y Diputados.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-6 py-2 mb-6">
                    <h3 className="text-sm font-bold tracking-wide">DIRECTORIO</h3>
                  </div>
                  
                  <div className="mb-8 min-h-[240px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      Listado del personal de mando superior y mandos medios del Canal.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-6 py-2 mb-6">
                    <h3 className="text-sm font-bold tracking-wide">ORGANIGRAMA</h3>
                  </div>
                  
                  <div className="mb-8 min-h-[240px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      Organigrama de las áreas que conforman el Canal del Congreso.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section id="normatividad" className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">NORMATIVIDAD</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-6 py-2 mb-6">
                    <h3 className="text-sm font-bold tracking-wide">NORMATIVIDAD GENERAL</h3>
                  </div>
                  
                  <div className="mb-8 min-h-[200px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      Constitución, Ley Federal de Telecomunicaciones, Ley Federal de Transparencia y Acceso a la Información, Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados, y Ley Federal de Archivos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-6 py-2 mb-6">
                    <h3 className="text-sm font-bold tracking-wide">NORMATIVIDAD INTERNA</h3>
                  </div>
                  
                  <div className="mb-8 min-h-[200px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      Ley Orgánica del Congreso, Reglamento del Canal, Políticas de Comunicación, Guía de Usuario, Código de Ética, Lineamientos de la Defensoría de Audiencia, Reglas de Funcionamiento del Consejo Consultivo, Lineamientos Generales de Administración, entre otros.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section id="compromisos" className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">COMPROMISOS CON LA TRANSPARENCIA</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-6 py-2 mb-6">
                    <h3 className="text-sm font-bold tracking-wide">ÓRGANO RECTOR</h3>
                  </div>
                  
                  <div className="mb-8 min-h-[200px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      El Canal del Congreso está regido por una comisión legislativa integrada de manera plural por representantes de la Cámara de Senadores y de la Cámara de Diputados, denominada "Comisión Bicameral del Canal de Televisión del Congreso.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-6 py-2 mb-6">
                    <h3 className="text-sm font-bold tracking-wide">CONSEJO CONSULTIVO</h3>
                  </div>
                  
                  <div className="mb-8 min-h-[200px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      El Canal del Congreso cuenta con un Consejo Consultivo, conformado por once especialistas con amplia trayectoria y reconocimiento en el ámbito de los medios de comunicación, propuestos por instituciones académicas, organizaciones civiles y otras.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section id="focalizada" className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">TRANSPARENCIA FOCALIZADA</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">NUEVAS PRODUCCIONES</h3>
                  </div>
                  
                  <div className="mb-6 min-h-[200px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      El Canal del Congreso ha ampliado su oferta de programación y diversificado sus contenidos, a través de nuevos espacios de información y análisis del acontecer nacional e internacional, que contribuyen a generar una sociedad mejor informada.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">ACCESIBILIDAD</h3>
                  </div>
                  
                  <div className="mb-6 min-h-[200px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      Comprometidos con la inclusión de diversos sectores de la sociedad a los contenidos del Canal del Congreso, se incorporó desde diciembre de 2015 la interpretación a Lengua de Señas Mexicanas de las sesiones de ambas Cámaras del Congreso de la Unión, así como el noticiero nocturno de este medio de comunicación.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">ENCUESTAS DE OPINIÓN PÚBLICA</h3>
                  </div>
                  
                  <div className="mb-6 min-h-[200px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      Entre sus políticas de vinculación con la audiencia, el Canal del Congreso realiza estudios de opinión para conocer los perfiles, comportamientos, necesidades e inquietudes de la ciudadanía con respecto a la comunicación parlamentaria y a la función social del propio Canal.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">REPORTES DE COMUNICACIÓN DE LA AUDIENCIA</h3>
                  </div>
                  
                  <div className="mb-6 min-h-[200px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      Entre sus políticas de vinculación con la audiencia, el Canal del Congreso busca generar mayor interacción y dar atención a las comunicaciones que recibe a través del Sistema Escríbenos y redes sociales.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section id="datos-abiertos" className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">DATOS ABIERTOS</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">INFORME DE ACTIVIDADES</h3>
                  </div>
                  
                  <div className="mb-6 space-y-2">
                    {['2021', '2020', '2019', '2018', '2017', '2016', '2015'].map((year) => (
                      <div key={year} className="flex items-center gap-2 text-sm">
                        <span className="text-pink-400">●</span>
                        <span className="text-white/90">Actividades {year}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">INFORMES TRIMESTRALES</h3>
                  </div>
                  
                  <div className="mb-6 space-y-2">
                    {['2021', '2020', '2019', '2018', '2017', '2016', '2015'].map((year) => (
                      <div key={year} className="flex items-center gap-2 text-sm">
                        <span className="text-pink-400">●</span>
                        <span className="text-white/90">Informe {year}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">PROGRAMA ANUAL DE TRABAJO</h3>
                  </div>
                  
                  <div className="mb-6 space-y-2">
                    {['2021', '2020', '2019', '2018', '2017', '2016', '2015'].map((year) => (
                      <div key={year} className="flex items-center gap-2 text-sm">
                        <span className="text-pink-400">●</span>
                        <span className="text-white/90">Programa {year}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">BITÁCORAS DE TRANSMISIÓN EN VIVO EN SEÑAL ABIERTA</h3>
                  </div>
                  
                  <div className="mb-6 space-y-2">
                    {['2021', '2020', '2019', '2018', '2017', '2016', '2015'].map((year) => (
                      <div key={year} className="flex items-center gap-2 text-sm">
                        <span className="text-pink-400">●</span>
                        <span className="text-white/90">Bitácoras {year}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">BASE DE DATOS DE ACERVO VIDEOGRÁFICO</h3>
                  </div>
                  
                  <div className="mb-6 space-y-2">
                    {['2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'].map((year) => (
                      <div key={year} className="flex items-center gap-2 text-sm">
                        <span className="text-pink-400">●</span>
                        <span className="text-white/90">Acervo videográfico {year}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="inline-block bg-purple-600 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">ESTADÍSTICAS DE PLATAFORMAS DIGITALES DEL CANAL</h3>
                  </div>
                  
                  <div className="mb-6 space-y-2">
                    {['2021', '2020', '2019', '2018', '2017', '2016', '2015'].map((year) => (
                      <div key={year} className="flex items-center gap-2 text-sm">
                        <span className="text-pink-400">●</span>
                        <span className="text-white/90">Estadísticas {year}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section id="acerca" className="bg-white py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-full border-4 border-purple-600 bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">ACERCA DE NOSOTROS</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              <div className="group">
                <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="inline-block bg-purple-500 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">HISTORIA</h3>
                  </div>
                  
                  <div className="mb-6 min-h-[180px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      El 03 de octubre de 1998 nació el Canal de Televisión del Congreso General de los Estados Unidos Mexicanos a través de un Canal de televisión, como medio de servicio público, abierto a la libre expresión de las ideas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="inline-block bg-purple-500 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">VALORES Y PRINCIPIOS</h3>
                  </div>
                  
                  <div className="mb-6 min-h-[180px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      El Canal del Congreso es un medio de trabajo y su desempeño se rige en un conjunto de valores entendidos desde la perspectiva humana hacia la transformación social y la profesionalización cotidiana.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="inline-block bg-purple-500 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">¿DÓNDE ESTAMOS?</h3>
                  </div>
                  
                  <div className="mb-6 min-h-[180px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      Ubicación de las Oficinas del Canal del Congreso.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="inline-block bg-purple-500 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">SINTONÍA</h3>
                  </div>
                  
                  <div className="mb-6 min-h-[180px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      Consulta el listado completo de sistemas que te permiten sintonizar el Canal del Congreso.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="group">
                <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="inline-block bg-purple-500 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">ESCRÍBENOS</h3>
                  </div>
                  
                  <div className="mb-6 min-h-[120px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      Este buzón electrónico está orientado a atender quejas, sugerencias, comentarios y todas aquellas opiniones de nuestros contenidos y programación, e incluso nuestros trabajos como televisión.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="inline-block bg-purple-500 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">SOLICITUDES DE SERVICIOS</h3>
                  </div>
                  
                  <div className="mb-6 min-h-[120px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      Aquí puedes consultar la guía de usuario para solicitación de servicios, como: Acreditación, Grabación, formato, donde aquí.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="inline-block bg-purple-500 rounded-full px-5 py-2 mb-5">
                    <h3 className="text-xs font-bold tracking-wide">COBERTURA Y TRANSMISIONES</h3>
                  </div>
                  
                  <div className="mb-6 min-h-[120px]">
                    <p className="text-white/90 leading-relaxed text-sm">
                      Consulta los espacios donde el Canal del Congreso realiza sus transmisiones en tiempo real, así como las ubicaciones desde las necesitas proximamente.
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Entra aquí</span>
                  </button>
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
