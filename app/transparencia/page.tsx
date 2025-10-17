"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Footer from "@/components/footer"

interface TransparencyFileItem {
  label: string
  fileUrl?: string
  fileType?: string
}

interface TransparencyCard {
  title: string
  description: string
  linkUrl?: string
  hasButton?: boolean
  items?: TransparencyFileItem[]
}

interface TransparencySection {
  id: string
  sectionKey: string
  sectionTitle: string
  iconType?: string
  cardsData: TransparencyCard[]
  displayOrder: number
  isActive: boolean
}

export default function TransparenciaPage() {
  const [sections, setSections] = useState<TransparencySection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    try {
      const response = await fetch('/api/transparency-sections', {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setSections(data)
      }
    } catch (error) {
      console.error('Error loading transparency sections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSectionByKey = (key: string) => {
    return sections.find(s => s.sectionKey === key)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500 flex items-center justify-center">
        <p className="text-white text-xl">Cargando...</p>
      </div>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
        </div>

        <section className="relative z-10 pt-0 pb-0 mt-8">
          <div className="w-full h-[150px] overflow-hidden relative">
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('/images/transparency/purple-gradient-bg.png')`
              }}
            />
            <img 
              src="/images/transparency/transparencia-banner.png" 
              alt="Transparencia" 
              className="relative w-full h-full object-contain z-10"
            />
          </div>
        </section>

        <section className="relative z-10 py-12 pb-24">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center opacity-50"
            style={{
              backgroundImage: `url('/images/transparency/purple-gradient-bg.png')`,
              top: '-150px',
              height: 'calc(100% + 150px)'
            }}
          />
          <div className="container mx-auto px-6 relative z-10">
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

        <section id="informacion" className="relative py-16 scroll-mt-20 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/transparency/hexagonal-pattern-bg.png')`
            }}
          />
          <div className="container mx-auto px-6 relative z-10">
            {(() => {
              const section = getSectionByKey('informacion-utilidad')
              if (!section) return null

              return (
                <>
                  <div className="w-full mb-12">
                    <img 
                      src="/images/transparency/informacion-banner.png" 
                      alt="Información de Utilidad Pública" 
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {section.cardsData.map((card, index) => (
                      <div key={index} className="group">
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                          <div className="inline-block bg-purple-600 rounded-full px-6 py-2 mb-6">
                            <h3 className="text-sm font-bold tracking-wide">{card.title}</h3>
                          </div>

                          <div className="mb-8 min-h-[240px]">
                            <p className="text-white/90 leading-relaxed text-sm">
                              {card.description}
                            </p>
                          </div>

                          {card.hasButton && card.linkUrl && (
                            <a href={card.linkUrl}>
                              <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 group-hover:scale-105">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-sm">Entra aquí</span>
                              </button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        </section>

        <section id="estructura" className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            {(() => {
              const section = getSectionByKey('estructura-presupuesto')
              if (!section) return null

              return (
                <>
                  <div className="w-full mb-12">
                    <img 
                      src="/images/transparency/estructura-banner.png" 
                      alt="Estructura y Presupuesto" 
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {section.cardsData.map((card, index) => (
                      <div key={index} className="group">
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                          <div className="inline-block bg-purple-600 rounded-full px-6 py-2 mb-6">
                            <h3 className="text-sm font-bold tracking-wide">{card.title}</h3>
                          </div>

                          <div className="mb-8 min-h-[240px]">
                            <p className="text-white/90 leading-relaxed text-sm">
                              {card.description}
                            </p>
                          </div>

                          {card.hasButton && card.linkUrl && (
                            <a href={card.linkUrl}>
                              <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 group-hover:scale-105">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-sm">Entra aquí</span>
                              </button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        </section>

        <section id="normatividad" className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            {(() => {
              const section = getSectionByKey('normatividad')
              if (!section) return null

              return (
                <>
                  <div className="w-full mb-12">
                    <img 
                      src="/images/transparency/normatividad-banner.png" 
                      alt="Normatividad" 
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {section.cardsData.map((card, index) => (
                      <div key={index} className="group">
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                          <div className="inline-block bg-purple-600 rounded-full px-6 py-2 mb-6">
                            <h3 className="text-sm font-bold tracking-wide">{card.title}</h3>
                          </div>

                          <div className="mb-8 min-h-[200px]">
                            <p className="text-white/90 leading-relaxed text-sm">
                              {card.description}
                            </p>
                          </div>

                          {card.hasButton && card.linkUrl && (
                            <a href={card.linkUrl}>
                              <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 group-hover:scale-105">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-sm">Entra aquí</span>
                              </button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        </section>

        <section id="compromisos" className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            {(() => {
              const section = getSectionByKey('compromisos-transparencia')
              if (!section) return null

              return (
                <>
                  <div className="w-full mb-12">
                    <img 
                      src="/images/transparency/compromisos-banner.png" 
                      alt="Compromisos con la Transparencia" 
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {section.cardsData.map((card, index) => (
                      <div key={index} className="group">
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                          <div className="inline-block bg-purple-600 rounded-full px-6 py-2 mb-6">
                            <h3 className="text-sm font-bold tracking-wide">{card.title}</h3>
                          </div>

                          <div className="mb-8 min-h-[200px]">
                            <p className="text-white/90 leading-relaxed text-sm">
                              {card.description}
                            </p>
                          </div>

                          {card.hasButton && card.linkUrl && (
                            <a href={card.linkUrl}>
                              <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 group-hover:scale-105">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-sm">Entra aquí</span>
                              </button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        </section>

        <section id="focalizada" className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            {(() => {
              const section = getSectionByKey('transparencia-focalizada')
              if (!section) return null

              return (
                <>
                  <div className="w-full mb-12">
                    <img 
                      src="/images/transparency/focalizada-banner.png" 
                      alt="Transparencia Focalizada" 
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {section.cardsData.map((card, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                        <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                        <p className="text-white/90 mb-6 leading-relaxed">{card.description}</p>

                        {card.items && card.items.length > 0 && (
                          <ul className="space-y-3 mb-6">
                            {card.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-3">
                                {item.fileUrl ? (
                                  <a 
                                    href={item.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-purple-200 hover:text-white transition-colors flex items-center gap-2 group"
                                  >
                                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm">{item.label}</span>
                                  </a>
                                ) : (
                                  <span className="text-purple-200 text-sm">{item.label}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}

                        {card.hasButton && card.linkUrl && (
                          <a
                            href={card.linkUrl}
                            className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-purple-100 transition-colors"
                          >
                            Entra aquí
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        </section>

        <section id="datos-abiertos" className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            {(() => {
              const section = getSectionByKey('datos-abiertos')
              if (!section) return null

              return (
                <>
                  <div className="w-full mb-12">
                    <img 
                      src="/images/transparency/datos-abiertos-banner.png" 
                      alt="Datos Abiertos" 
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.cardsData.map((card, index) => (
                      <div key={index} className="group">
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                          <div className="inline-block bg-purple-600 rounded-full px-5 py-2 mb-5">
                            <h3 className="text-xs font-bold tracking-wide">{card.title}</h3>
                          </div>

                          {card.items && card.items.length > 0 ? (
                            <div className="mb-6 space-y-2">
                              {card.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-center gap-2 text-sm">
                                  <span className="text-pink-400">●</span>
                                  {item.fileUrl ? (
                                    <a 
                                      href={item.fileUrl} 
                                      download
                                      className="text-white/90 hover:text-white hover:underline flex items-center gap-2 group"
                                    >
                                      <span>{item.label}</span>
                                      {item.fileType && (
                                        <span className="text-xs bg-pink-500/30 px-2 py-0.5 rounded group-hover:bg-pink-500/50 transition-colors">
                                          {item.fileType.toUpperCase()}
                                        </span>
                                      )}
                                      <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    </a>
                                  ) : (
                                    <span className="text-white/90">{item.label}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="mb-6">
                              <p className="text-white/90 leading-relaxed text-sm">
                                {card.description}
                              </p>
                            </div>
                          )}

                          {card.hasButton && card.linkUrl && (
                            <a href={card.linkUrl}>
                              <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-sm">Entra aquí</span>
                              </button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        </section>

        <section id="acerca" className="bg-white py-16 scroll-mt-20">
          <div className="container mx-auto px-6">
            {(() => {
              const section = getSectionByKey('acerca-nosotros')
              if (!section) return null

              return (
                <>
                  <div className="w-full mb-12">
                    <img 
                      src="/images/transparency/acerca-nosotros-banner.png" 
                      alt="Acerca de Nosotros" 
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {section.cardsData.map((card, index) => (
                      <div key={index} className="group">
                        <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                          <div className="inline-block bg-purple-500 rounded-full px-5 py-2 mb-5">
                            <h3 className="text-xs font-bold tracking-wide">{card.title}</h3>
                          </div>

                          <div className="mb-6 min-h-[120px]">
                            <p className="text-white/90 leading-relaxed text-sm">
                              {card.description}
                            </p>
                          </div>

                          {card.hasButton && card.linkUrl && (
                            <a href={card.linkUrl}>
                              <button className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 group-hover:scale-105">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-sm">Entra aquí</span>
                              </button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}