import Link from "next/link"
import Footer from "@/components/footer"

export default function AutonomiaPage() {
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            
            {/* Title */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                AUTONOMÍA TÉCNICA
              </h1>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Y DE GESTIÓN
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Autonomía del Canal del Congreso
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  A fin de dar cumplimiento a lo señalado en el artículo 86 de la Ley Federal de 
                  Telecomunicaciones y Radiodifusión, que impone obligaciones a los Concesionarios de 
                  Uso Público, se reformaron los artículos 140 y 141 de la Ley Orgánica del Congreso 
                  General de los Estados Unidos Mexicanos, así como el Reglamento del Canal del Congreso.
                </p>

                <div className="bg-purple-50 border-l-4 border-purple-600 p-6 my-8">
                  <h3 className="text-xl font-bold text-purple-900 mb-3">
                    Marco Legal
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Artículo 86 - Ley Federal de Telecomunicaciones y Radiodifusión</li>
                    <li>• Artículos 140 y 141 - Ley Orgánica del Congreso General</li>
                    <li>• Reglamento del Canal del Congreso</li>
                  </ul>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Esta reforma garantiza la autonomía técnica y de gestión del Canal del Congreso, 
                  permitiendo un funcionamiento independiente y profesional en la difusión de las 
                  actividades legislativas.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
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
        </div>
      </main>
      
      <Footer />
    </>
  )
}
