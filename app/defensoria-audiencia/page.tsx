import { Suspense } from 'react'
import Image from "next/image"
import Link from "next/link"
import Footer from "@/components/footer"
import ContactModal from "@/components/defensoria/contact-modal"
import DefensoraProfile from "@/components/defensoria/defensora-profile"
import RecentRequests from "@/components/defensoria/recent-requests"
import ReportsSection from "@/components/defensoria/reports-section"

export default function DefensoriaAudienciaPage() {
  return (
    <>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 z-0">
            <Image
              src="/images/defensoria-audiencia.png"
              alt="Defensoría de Audiencia"
              fill
              className="object-cover mix-blend-soft-light opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-6 z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              {/* Logo and badge */}
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full p-6 border border-white/20">
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
                <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  DEFENSORÍA
                </h1>
                <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  DE AUDIENCIA
                </h2>
                <p className="text-2xl text-purple-200 font-light">CANAL DEL CONGRESO</p>
              </div>

              {/* Description */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
                <p className="text-lg text-purple-100 leading-relaxed">
                  La Defensoría de Audiencia es el mecanismo de participación ciudadana que garantiza el derecho a la información, 
                  recibe y da seguimiento a las observaciones, quejas y sugerencias del público respecto a los contenidos y servicios del Canal del Congreso.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ContactModal type="Queja">
                  <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25">
                    Presentar Queja
                  </button>
                </ContactModal>
                
                <ContactModal type="Sugerencia">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                    Enviar Sugerencia
                  </button>
                </ContactModal>
                
                <ContactModal type="Felicitaciones">
                  <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25">
                    Enviar Felicitaciones
                  </button>
                </ContactModal>
              </div>
            </div>
          </div>
        </section>

        {/* Conoce tu Ley Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Conoce tu <span className="text-blue-600">Ley</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Descarga el marco legal que rige los derechos de audiencia y las obligaciones del Canal del Congreso.
              </p>
              <Link
                href="/downloads/conoce-tu-ley.pdf"
                download
                className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar PDF
              </Link>
            </div>
          </div>
        </section>

        {/* Defensora Profile Section */}
        <Suspense fallback={<div className="py-20 text-center">Cargando información...</div>}>
          <DefensoraProfile />
        </Suspense>

        {/* Recent Requests Section */}
        <Suspense fallback={<div className="py-20 text-center">Cargando solicitudes...</div>}>
          <RecentRequests />
        </Suspense>

        {/* Reports Section */}
        <Suspense fallback={<div className="py-20 text-center">Cargando informes...</div>}>
          <ReportsSection />
        </Suspense>

        {/* Contact Information Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-8">
              ¿Tienes alguna consulta adicional?
            </h2>
            <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
              Nuestro equipo está aquí para ayudarte. Contáctanos directamente a través de nuestros canales oficiales.
            </p>
            
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

              {/* Contact form link */}
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
                  <p className="text-sm text-purple-200 font-medium">Formulario de contacto</p>
                  <Link 
                    href="/contacto"
                    className="text-lg font-semibold text-white hover:text-purple-200 transition-colors"
                  >
                    Enviar mensaje
                  </Link>
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