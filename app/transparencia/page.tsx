import Image from "next/image"
import Link from "next/link"
import Footer from "@/components/footer"
import TransparencySubmenu from "@/components/transparency/submenu"

export default function TransparenciaPage() {
  return (
    <>
      <TransparencySubmenu />
      <main className="min-h-screen">
        {/* Hero Banner Section */}
        <section className="relative w-full h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-700 z-0">
            <Image
              src="/images/transparency/hero-bg.png"
              alt="Transparencia"
              fill
              className="object-cover mix-blend-soft-light opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent"></div>
          </div>
          <div className="container mx-auto px-6 z-10 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-2/3 text-white">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium border border-orange-400/30">
                    Transparencia y Rendición de Cuentas
                  </span>
                </div>
                <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                  <span className="block bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    INFORME
                  </span>
                  <span className="block bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    ANUAL
                  </span>
                </h1>
                <h2 className="text-3xl md:text-4xl mb-8 font-light">
                  Canal del <span className="text-orange-400 font-semibold">Congreso</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full mb-8"></div>
                <p className="text-xl text-cyan-100 mb-8 max-w-2xl leading-relaxed">
                  Conoce nuestros informes de transparencia, rendición de cuentas y el trabajo realizado para mantener informada a la ciudadanía.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/transparencia/informes"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                  >
                    <span>Consulta aquí</span>
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/transparencia/datos-abiertos"
                    className="inline-flex items-center justify-center border-2 border-white/30 text-white hover:bg-white/10 font-medium py-4 px-8 rounded-xl transition-all duration-300 backdrop-blur-sm"
                  >
                    Ver Datos Abiertos
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating elements for visual enhancement */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-1/4 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/3 left-10 w-16 h-16 bg-blue-400/30 rounded-full blur-lg"></div>
        </section>

        {/* Explore Our Sections */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Explora nuestras <span className="text-blue-600">Secciones</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Accede a información detallada sobre transparencia, compromisos institucionales y datos abiertos del Canal del Congreso
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-6 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Compromisos con la Transparencia */}
              <Link href="/transparencia/compromisos" className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  <div className="h-56 relative overflow-hidden">
                    <Image
                      src="/images/transparency/compromiso.png"
                      alt="Compromisos con la Transparencia"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <h3 className="text-lg font-bold text-gray-800 text-center mb-2 group-hover:text-blue-600 transition-colors">
                      Compromisos con la Transparencia
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      Conoce nuestros compromisos institucionales y marcos normativos
                    </p>
                  </div>
                </div>
              </Link>

              {/* Contacto */}
              <Link href="/contacto" className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  <div className="h-56 relative overflow-hidden">
                    <Image 
                      src="/images/transparency/contacto.png" 
                      alt="Contacto" 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent"></div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                    <h3 className="text-lg font-bold text-gray-800 text-center mb-2 group-hover:text-green-600 transition-colors">
                      Contacto
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      Ponte en contacto con nosotros para solicitudes de información
                    </p>
                  </div>
                </div>
              </Link>

              {/* Transparencia Focalizada */}
              <Link href="/transparencia/focalizada" className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  <div className="h-56 relative overflow-hidden">
                    <Image
                      src="/images/transparency/transparencia-focalizada.png"
                      alt="Transparencia Focalizada"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50">
                    <h3 className="text-lg font-bold text-gray-800 text-center mb-2 group-hover:text-purple-600 transition-colors">
                      Transparencia Focalizada
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      Información específica sobre el Congreso y tus representantes
                    </p>
                  </div>
                </div>
              </Link>

              {/* Datos Abiertos */}
              <Link href="/transparencia/datos-abiertos" className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  <div className="h-56 relative overflow-hidden">
                    <Image
                      src="/images/transparency/datos-abiertos.png"
                      alt="Datos Abiertos"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 to-transparent"></div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50">
                    <h3 className="text-lg font-bold text-gray-800 text-center mb-2 group-hover:text-orange-600 transition-colors">
                      Datos Abiertos
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      Accede a bases de datos públicas y información estadística
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Defensoría de Audiencia */}
        <section className="py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl"></div>
          </div>
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Logo and badge */}
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-40 h-40 bg-white/10 backdrop-blur-sm rounded-full p-6 border border-white/20">
                    <Image
                      src="/images/defensoria-audiencia.png"
                      alt="Defensoría de Audiencia"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="mb-8">
                <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 mb-6">
                  <span className="text-purple-200 font-medium">Atención Ciudadana</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  DEFENSORÍA
                </h2>
                <h3 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  DE AUDIENCIA
                </h3>
                <p className="text-2xl text-purple-200 font-light">CANAL DEL CONGRESO</p>
              </div>

              {/* Description */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
                <p className="text-lg text-purple-100 leading-relaxed mb-6">
                  La Defensoría de Audiencia es el mecanismo de participación ciudadana que garantiza el derecho a la información, 
                  recibe y da seguimiento a las observaciones, quejas y sugerencias del público respecto a los contenidos y servicios del Canal del Congreso.
                </p>
              </div>

              {/* Contact section */}
              <div className="space-y-6">
                <h4 className="text-3xl font-bold text-white mb-6">¡Contáctanos!</h4>
                
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                  {/* Email contact */}
                  <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-7 h-7 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-purple-200 font-medium">Correo electrónico</p>
                      <a 
                        href="mailto:defensoria.audiencia@canaldelcongreso.gob.mx"
                        className="text-lg font-semibold text-white hover:text-purple-200 transition-colors"
                      >
                        defensoria.audiencia@canaldelcongreso.gob.mx
                      </a>
                    </div>
                  </div>

                  {/* Additional contact options */}
                  <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-7 h-7 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-purple-200 font-medium">Envía tu consulta</p>
                      <Link 
                        href="/contacto"
                        className="text-lg font-semibold text-white hover:text-purple-200 transition-colors"
                      >
                        Formulario de contacto
                      </Link>
                    </div>
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
