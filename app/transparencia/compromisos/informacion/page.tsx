import Link from "next/link"
import Footer from "@/components/footer"

export default function InformacionPage() {
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            
            {/* Title */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                INFORMACIÓN DE
              </h1>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                UTILIDAD PÚBLICA
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 - Defensor de Audiencias */}
            <div className="group">
              <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Badge */}
                <div className="inline-block bg-purple-500 rounded-full px-6 py-2 mb-6">
                  <h3 className="text-sm font-bold tracking-wide">DEFENSOR DE AUDIENCIAS</h3>
                </div>
                
                {/* Content */}
                <div className="mb-8 min-h-[280px]">
                  <p className="text-white/90 leading-relaxed">
                    La principal función del Defensor de Audiencia; es recibir, documentar, procesar y dar seguimiento a las observaciones, quejas, sugerencias, peticiones o señalamientos que formulen las personas que componen la audiencia, en materia de contenidos y programación del Canal del Congreso.
                  </p>
                </div>
                
                {/* Button */}
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
                {/* Badge */}
                <div className="inline-block bg-purple-500 rounded-full px-6 py-2 mb-6">
                  <h3 className="text-sm font-bold tracking-wide">AUTONOMÍA TÉCNICA Y DE GESTIÓN</h3>
                </div>
                
                {/* Content */}
                <div className="mb-8 min-h-[280px]">
                  <p className="text-white/90 leading-relaxed">
                    A fin de dar cumplimiento a lo señalado en el artículo 86 de la Ley Federal de Telecomunicaciones y Radiodifusión, que impone obligaciones a los Concesionarios de Uso Público, se reformaron los artículos 140 y 141 de la Ley Orgánica del Congreso General de los Estados Unidos Mexicanos, así como el Reglamento del Canal del Congreso.
                  </p>
                </div>
                
                {/* Button */}
                <Link 
                  href="/transparencia/compromisos/informacion/autonomia"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 group-hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Entra aquí</span>
                </Link>
              </div>
            </div>

            {/* Card 3 - Adquisiciones */}
            <div className="group">
              <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Badge */}
                <div className="inline-block bg-purple-500 rounded-full px-6 py-2 mb-6">
                  <h3 className="text-sm font-bold tracking-wide">ADQUISICIONES</h3>
                </div>
                
                {/* Content */}
                <div className="mb-8 min-h-[280px]">
                  <p className="text-white/90 leading-relaxed">
                    Aquí encontrará información sobre las principales adquisiciones efectuadas durante los ejercicios fiscales, por el Canal del Congreso en la Cámara de Senadores.
                  </p>
                  <p className="text-white/90 leading-relaxed mt-4">
                    Aquí encontrará información sobre las principales adquisiciones efectuadas durante los ejercicios fiscales, por el Canal del Congreso en la Cámara de Diputados.
                  </p>
                </div>
                
                {/* Button */}
                <Link 
                  href="/transparencia/compromisos/informacion/adquisiciones"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 group-hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Entra aquí</span>
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
