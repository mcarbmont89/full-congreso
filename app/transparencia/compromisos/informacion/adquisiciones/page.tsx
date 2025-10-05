import Link from "next/link"
import Footer from "@/components/footer"

export default function AdquisicionesPage() {
  return (
    <>
      {/* Header Section */}
      <section className="bg-gradient-to-r from-purple-700 to-purple-600 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-purple-600/50 flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            
            {/* Title */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                ADQUISICIONES
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            
            {/* Cámara de Senadores */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Cámara de Senadores
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-8">
                Aquí encontrará información sobre las principales adquisiciones efectuadas durante 
                los ejercicios fiscales, por el Canal del Congreso en la Cámara de Senadores.
              </p>

              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-4">
                  Ejercicios Fiscales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-gray-600 text-sm mb-1">Ejercicio Fiscal</p>
                    <p className="text-2xl font-bold text-purple-700">2024</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-gray-600 text-sm mb-1">Ejercicio Fiscal</p>
                    <p className="text-2xl font-bold text-purple-700">2023</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cámara de Diputados */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Cámara de Diputados
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-8">
                Aquí encontrará información sobre las principales adquisiciones efectuadas durante 
                los ejercicios fiscales, por el Canal del Congreso en la Cámara de Diputados.
              </p>

              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-4">
                  Ejercicios Fiscales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-gray-600 text-sm mb-1">Ejercicio Fiscal</p>
                    <p className="text-2xl font-bold text-purple-700">2024</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-gray-600 text-sm mb-1">Ejercicio Fiscal</p>
                    <p className="text-2xl font-bold text-purple-700">2023</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link 
                href="/transparencia/compromisos/informacion"
                className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Volver a Información de Utilidad Pública</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
