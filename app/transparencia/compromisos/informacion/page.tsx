import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TransparencySubmenu from "@/components/transparency/submenu"
import { MobileMenuProvider } from "@/components/mobile-menu-context"

export default function InformacionPage() {
  return (
    <MobileMenuProvider>
      <Navbar />
      <TransparencySubmenu />
      <main className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Información Relevante y de Utilidad Pública</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Document Card 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">Informe Anual de Actividades 2023</h3>
              <p className="text-gray-600 mb-4 text-sm">Publicado: 15 de enero, 2024</p>
              <p className="text-gray-700 mb-4">
                Resumen de las actividades y logros del Canal del Congreso durante el año 2023.
              </p>
              <a href="#" className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Descargar PDF
              </a>
            </div>
          </div>

          {/* Document Card 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">Programación Trimestral</h3>
              <p className="text-gray-600 mb-4 text-sm">Publicado: 1 de abril, 2024</p>
              <p className="text-gray-700 mb-4">
                Programación del Canal del Congreso para el segundo trimestre de 2024.
              </p>
              <a href="#" className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Descargar PDF
              </a>
            </div>
          </div>

          {/* Document Card 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">Estadísticas de Audiencia</h3>
              <p className="text-gray-600 mb-4 text-sm">Publicado: 10 de marzo, 2024</p>
              <p className="text-gray-700 mb-4">
                Análisis de las estadísticas de audiencia del Canal del Congreso durante 2023.
              </p>
              <a href="#" className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Descargar PDF
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </MobileMenuProvider>
  )
}
