import Link from "next/link"
import Footer from "@/components/footer"

export default function TransparenciaPage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Header Section */}
        <section className="relative z-10 pt-20 pb-16">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-6 mb-4">
              <h1 className="text-6xl md:text-8xl font-bold text-white tracking-wider flex items-center">
                TRANSP
                <span className="inline-flex items-center justify-center mx-2">
                  <svg className="w-20 h-20 md:w-24 md:h-24" viewBox="0 0 100 100" fill="none">
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
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-5xl aspect-square flex items-center justify-center">
                
                {/* Center Circle - Acerca de nosotros */}
                <div className="absolute z-20">
                  <div className="w-64 h-64 rounded-full border-4 border-white/50 bg-purple-600/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-white">Acerca de</h2>
                      <h2 className="text-3xl font-bold text-white">nosotros</h2>
                    </div>
                  </div>
                </div>

                {/* Connecting lines */}
                <svg className="absolute w-full h-full" viewBox="0 0 500 500">
                  <circle cx="250" cy="250" r="200" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
                </svg>

                {/* Top Left - Información de utilidad pública */}
                <Link 
                  href="/transparencia/compromisos/informacion"
                  className="absolute top-8 left-16 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-purple-600/80 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-purple-500">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-white font-semibold text-sm max-w-[150px]">Información de utilidad pública</p>
                    </div>
                  </div>
                </Link>

                {/* Top Right - Compromisos con la Transparencia */}
                <Link 
                  href="/transparencia/compromisos"
                  className="absolute top-8 right-16 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-purple-600/80 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-purple-500">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-white font-semibold text-sm max-w-[150px]">Compromisos con la Transparencia</p>
                    </div>
                  </div>
                </Link>

                {/* Middle Left - Estructura y Presupuesto */}
                <Link 
                  href="/transparencia/compromisos/estructura"
                  className="absolute left-0 top-1/2 -translate-y-1/2 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-purple-600/80 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-purple-500">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-white font-semibold text-sm max-w-[150px]">Estructura y Presupuesto</p>
                    </div>
                  </div>
                </Link>

                {/* Middle Right - Transparencia Focalizada */}
                <Link 
                  href="/transparencia/focalizada"
                  className="absolute right-0 top-1/2 -translate-y-1/2 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-purple-600/80 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-purple-500">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-white font-semibold text-sm max-w-[150px]">Transparencia Focalizada</p>
                    </div>
                  </div>
                </Link>

                {/* Bottom Left - Normatividad */}
                <Link 
                  href="/transparencia/compromisos/normatividad"
                  className="absolute bottom-8 left-16 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-purple-600/80 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-purple-500">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-white font-semibold text-sm max-w-[150px]">Normatividad</p>
                    </div>
                  </div>
                </Link>

                {/* Bottom Right - Datos Abiertos */}
                <Link 
                  href="/transparencia/datos-abiertos"
                  className="absolute bottom-8 right-16 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-purple-600/80 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-purple-500">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-white font-semibold text-sm max-w-[150px]">Datos Abiertos</p>
                    </div>
                  </div>
                </Link>

              </div>
            </div>
          </div>
        </section>

        {/* Defensoría de Audiencia Section */}
        <section className="relative z-10 py-20 bg-black/30 backdrop-blur-sm mt-20">
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
