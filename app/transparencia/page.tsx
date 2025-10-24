"use client"

import { useState, useEffect } from "react"
import Footer from "@/components/footer"
import TransparencyCard from "@/components/transparency/TransparencyCard"
import Image from "next/image";

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

  useEffect(() => {
    fetch('/api/transparency-sections', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setSections(data))
      .catch(err => console.error('Error loading transparency sections:', err))
  }, [])

  const getSectionByKey = (key: string) => {
    return sections.find(s => s.sectionKey === key)
  }

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

        <section className="relative z-10 pt-0 pb-0 mt-8">
          <div className="relative left-1/2 -translate-x-1/2 w-screen h-[150px] md:h-[180px] lg:h-[220px] overflow-hidden">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
              style={{ backgroundImage: `url('/images/transparency/purple-gradient-bg.png')` }}
            />

            <img
              src="/images/transparency/transparencia-banne.png"
              alt="Transparencia"
              className="absolute inset-0 w-full h-full object-cover object-center z-10"
            />

            <div className="absolute inset-0 bg-black/20 z-20" />

            <div className="absolute inset-0 z-30 flex items-center justify-center">
              <h1
                className="text-white font-extrabold uppercase tracking-wide text-4xl md:text-6xl lg:text-7xl 
                          drop-shadow-[0_3px_10px_rgba(0,0,0,0.7)] leading-none"
              >
                Transparencia
              </h1>
            </div>
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

                <button
                  onClick={() => scrollToSection('informacion')}
                  className="absolute top-0 left-1/2 -translate-x-1/2 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-purple-600/90 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-500">
                      <div className="relative w-full h-full p-2">
                        <Image
                          src="/images/transparency/01_icono_informacion.svg"
                          alt="Información de utilidad pública"
                          fill
                          className="object-contain pointer-events-none select-none"
                          priority
                        />
                      </div>
                    </div>

                    <div className="mt-3 text-center">
                      <p className="text-white font-semibold text-xs max-w-[140px]">
                        Información de utilidad pública
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => scrollToSection('compromisos')}
                  className="absolute top-16 right-8 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-purple-600/90 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-500">
                      <div className="relative w-full h-full p-2">
                      <Image
                          src="/images/transparency/04_icono_ compromisos.svg"
                          alt="Información de utilidad pública"
                          fill
                          className="object-contain pointer-events-none select-none"
                          priority
                        />
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-white font-semibold text-xs max-w-[140px]">
                        Compromisos con la Transparencia
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => scrollToSection('focalizada')}
                  className="absolute bottom-16 right-8 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-purple-600/90 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-500">
                      <div className="relative w-full h-full p-2">
                    <Image
                        src="/images/transparency/05_Icono_ Transparencia Focalizada.svg"
                        alt="Información de utilidad pública"
                        fill
                        className="object-contain pointer-events-none select-none"
                        priority
                      />
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-white font-semibold text-xs max-w-[140px]">Transparencia Focalizada</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => scrollToSection('datos-abiertos')}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-purple-600/90 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-500">
                      <div className="relative w-full h-full p-2">
                      <Image
                        src="/images/transparency/06_Icono_ Datos Abiertos.svg"
                        alt="Información de utilidad pública"
                        fill
                        className="object-contain pointer-events-none select-none"
                        priority
                      />
                      </div>
                    </div>

                    <div className="mt-3 text-center">
                      <p className="text-white font-semibold text-xs max-w-[140px]">Datos Abiertos</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => scrollToSection('normatividad')}
                  className="absolute bottom-16 left-8 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-purple-600/90 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-500">
                      <div className="relative w-full h-full p-2">
                      <Image
                        src="/images/transparency/03_Icono_ Normatividad.svg"
                        alt="Información de utilidad pública"
                        fill
                        className="object-contain pointer-events-none select-none"
                        priority
                      />
                      </div>
                    </div>

                    <div className="mt-3 text-center">
                      <p className="text-white font-semibold text-xs max-w-[140px]">Normatividad</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => scrollToSection('estructura')}
                  className="absolute top-16 left-8 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-purple-600/90 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-500">
                      <div className="relative w-full h-full p-2">
                      <Image
                        src="/images/transparency/02_Icono_Estructura.svg"
                        alt="Información de utilidad pública"
                        fill
                        className="object-contain pointer-events-none select-none"
                        priority
                      />
                      </div>
                    </div>

                    <div className="mt-3 text-center">
                      <p className="text-white font-semibold text-xs max-w-[140px]">
                        Estructura y Presupuesto
                      </p>
                    </div>
                  </div>
                </button>


              </div>
            </div>
          </div>
        </section>

        <section id="informacion" className="relative py-16 scroll-mt-20 overflow-x-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/transparency/hexagonal-pattern-bg.png')` }}
          />

          <div className="relative left-1/2 -translate-x-1/2 w-screen mb-12 z-10">
            <img
              src="/images/transparency/informacion-banner.png"
              alt="Información de Utilidad Pública"
              className="block w-full h-auto"
            />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            {(() => {
              const section = getSectionByKey('informacion-utilidad')
              if (!section) return null
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.cardsData.map((card, i) => (
                    <TransparencyCard
                      key={i}
                      title={card.title}
                      description={card.description}
                      linkUrl={card.linkUrl}
                      hasButton={card.hasButton}
                    />
                  ))}
                </div>
              )
            })()}
          </div>
        </section>

        <section id="estructura" className="relative py-16 scroll-mt-20 overflow-x-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/transparency/hexagonal-pattern-bg.png')` }}
          />

          <div className="relative left-1/2 -translate-x-1/2 w-screen mb-12 z-10">
            <img
              src="/images/transparency/estructura-banner.png"
              alt="Estructura y Presupuesto"
              className="block w-full h-auto"
            />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            {(() => {
              const section = getSectionByKey('estructura-presupuesto')
              if (!section) return null

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.cardsData.map((card, index) => (
                    <TransparencyCard
                      key={index}
                      title={card.title}
                      description={card.description}
                      linkUrl={card.linkUrl}
                      hasButton={card.hasButton}
                    />
                  ))}
                </div>
              )
            })()}
          </div>
        </section>

        <section id="informacion" className="relative py-16 scroll-mt-20 overflow-x-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/transparency/hexagonal-pattern-bg.png')` }}
          />
          <div className="relative left-1/2 -translate-x-1/2 w-screen mb-12 z-10">
            <img
              src="/images/transparency/informacion-banner.png"
              alt="Información de Utilidad Pública"
              className="block w-full h-auto"
            />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            {(() => {
              const section = getSectionByKey('informacion-utilidad')
              if (!section) return null
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.cardsData.map((card, index) => (
                    <TransparencyCard
                      key={index}
                      title={card.title}
                      description={card.description}
                      linkUrl={card.linkUrl}
                      hasButton={card.hasButton}
                    />
                  ))}
                </div>
              )
            })()}
          </div>
        </section>

        <section id="estructura" className="relative py-16 scroll-mt-20 overflow-x-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/transparency/hexagonal-pattern-bg.png')` }}
          />
          <div className="relative left-1/2 -translate-x-1/2 w-screen mb-12 z-10">
            <img
              src="/images/transparency/estructura-banner.png"
              alt="Estructura y Presupuesto"
              className="block w-full h-auto"
            />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            {(() => {
              const section = getSectionByKey('estructura-presupuesto')
              if (!section) return null
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.cardsData.map((card, index) => (
                    <TransparencyCard
                      key={index}
                      title={card.title}
                      description={card.description}
                      linkUrl={card.linkUrl}
                      hasButton={card.hasButton}
                    />
                  ))}
                </div>
              )
            })()}
          </div>
        </section>

        <section id="normatividad" className="relative py-16 scroll-mt-20 overflow-x-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/transparency/hexagonal-pattern-bg.png')` }}
          />
          <div className="relative left-1/2 -translate-x-1/2 w-screen mb-12 z-10">
            <img
              src="/images/transparency/normatividad-banner.png"
              alt="Normatividad"
              className="block w-full h-auto"
            />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            {(() => {
              const section = getSectionByKey('normatividad')
              if (!section) return null
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.cardsData.map((card, index) => (
                    <TransparencyCard
                      key={index}
                      title={card.title}
                      description={card.description}
                      linkUrl={card.linkUrl}
                      hasButton={card.hasButton}
                    />
                  ))}
                </div>
              )
            })()}
          </div>
        </section>

        <section id="compromisos" className="relative py-16 scroll-mt-20 overflow-x-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/transparency/hexagonal-pattern-bg.png')` }}
          />
          <div className="relative left-1/2 -translate-x-1/2 w-screen mb-12 z-10">
            <img
              src="/images/transparency/compromisos-banner.png"
              alt="Compromisos con la Transparencia"
              className="block w-full h-auto"
            />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            {(() => {
              const section = getSectionByKey('compromisos-transparencia')
              if (!section) return null
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.cardsData.map((card, index) => (
                    <TransparencyCard
                      key={index}
                      title={card.title}
                      description={card.description}
                      linkUrl={card.linkUrl}
                      hasButton={card.hasButton}
                    />
                  ))}
                </div>
              )
            })()}
          </div>
        </section>

        <section id="focalizada" className="relative py-16 scroll-mt-20 overflow-x-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/transparency/hexagonal-pattern-bg.png')` }}
          />
          <div className="relative left-1/2 -translate-x-1/2 w-screen mb-12 z-10">
            <img
              src="/images/transparency/focalizada-banner.png"
              alt="Transparencia Focalizada"
              className="block w-full h-auto"
            />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            {(() => {
              const section = getSectionByKey('transparencia-focalizada')
              if (!section) return null
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.cardsData.map((card, index) => (
                    <TransparencyCard
                      key={index}
                      title={card.title}
                      description={card.description}
                      linkUrl={card.linkUrl}
                      hasButton={card.hasButton}
                      items={card.items}
                    />
                  ))}
                </div>
              )
            })()}
          </div>
        </section>

        <section id="datos-abiertos" className="relative py-16 scroll-mt-20 overflow-x-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/images/transparency/hexagonal-pattern-bg.png')` }}
          />
          <div className="relative left-1/2 -translate-x-1/2 w-screen mb-12 z-10">
            <img
              src="/images/transparency/datos-abiertos-banner.png"
              alt="Datos Abiertos"
              className="block w-full h-auto"
            />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            {(() => {
              const section = getSectionByKey('datos-abiertos')
              if (!section) return null
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.cardsData.map((card, index) => (
                    <TransparencyCard
                      key={index}
                      title={card.title}
                      description={card.description}
                      linkUrl={card.linkUrl}
                      hasButton={card.hasButton}
                      items={card.items}
                    />
                  ))}
                </div>
              )
            })()}
          </div>
        </section>

        <section id="acerca" className="relative py-16 scroll-mt-20 overflow-x-hidden bg-white">
          <div className="relative left-1/2 -translate-x-1/2 w-screen mb-12 z-10">
            <img
              src="/images/transparency/acerca-nosotros-banner.png"
              alt="Acerca de Nosotros"
              className="block w-full h-auto"
            />
          </div>

          <div className="container mx-auto px-6">
            {(() => {
              const section = getSectionByKey('acerca-nosotros')
              if (!section) return null

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.cardsData.map((card, index) => (
                    <TransparencyCard
                      key={index}
                      title={card.title}
                      description={card.description}
                      linkUrl={card.linkUrl}
                      hasButton={card.hasButton}
                    />
                  ))}
                </div>
              )
            })()}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}