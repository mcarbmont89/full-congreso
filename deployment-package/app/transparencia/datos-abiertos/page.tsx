import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TransparencySubmenu from "@/components/transparency/submenu"

export default function DatosAbiertosPage() {
  return (
    <>
      <Navbar />
      <TransparencySubmenu />
      <main className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Datos Abiertos</h1>

        <div className="prose max-w-none mb-8">
          <p className="text-lg">
            Los datos abiertos son información pública accesible, disponible en formatos técnicos y legales que permiten
            su uso, reutilización y redistribución para cualquier fin. En esta sección podrás encontrar conjuntos de
            datos relacionados con la actividad legislativa y parlamentaria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Dataset Card 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">Asistencias de Legisladores</h3>
              <p className="text-gray-600 mb-1 text-sm">Actualizado: 10 de abril, 2024</p>
              <p className="text-gray-600 mb-4 text-sm">Formato: CSV, JSON, XLSX</p>
              <p className="text-gray-700 mb-4">
                Registro de asistencias de diputados y senadores a sesiones plenarias y comisiones.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
                  Descargar
                </a>
                <a
                  href="#"
                  className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded text-sm"
                >
                  Metadatos
                </a>
              </div>
            </div>
          </div>

          {/* Dataset Card 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">Iniciativas Legislativas</h3>
              <p className="text-gray-600 mb-1 text-sm">Actualizado: 5 de abril, 2024</p>
              <p className="text-gray-600 mb-4 text-sm">Formato: CSV, JSON, XLSX</p>
              <p className="text-gray-700 mb-4">
                Registro de iniciativas presentadas en el Congreso, incluyendo autor, fecha, estatus y tema.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
                  Descargar
                </a>
                <a
                  href="#"
                  className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded text-sm"
                >
                  Metadatos
                </a>
              </div>
            </div>
          </div>

          {/* Dataset Card 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">Votaciones</h3>
              <p className="text-gray-600 mb-1 text-sm">Actualizado: 12 de abril, 2024</p>
              <p className="text-gray-600 mb-4 text-sm">Formato: CSV, JSON, XLSX</p>
              <p className="text-gray-700 mb-4">
                Registro de votaciones nominales en el pleno de ambas cámaras del Congreso.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
                  Descargar
                </a>
                <a
                  href="#"
                  className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded text-sm"
                >
                  Metadatos
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Política de Datos Abiertos</h2>
          <div className="prose max-w-none">
            <p>
              El Canal del Congreso se compromete a publicar de manera oportuna, accesible y usable la información
              generada en el ejercicio de sus funciones, siguiendo los principios de datos abiertos:
            </p>
            <ul>
              <li>
                <strong>Completos:</strong> Todos los datos públicos están disponibles.
              </li>
              <li>
                <strong>Primarios:</strong> Se publican tal como fueron recolectados en la fuente.
              </li>
              <li>
                <strong>Oportunos:</strong> Se publican tan pronto como sea necesario para preservar su valor.
              </li>
              <li>
                <strong>Accesibles:</strong> Están disponibles para el rango más amplio de usuarios y propósitos.
              </li>
              <li>
                <strong>Procesables por máquina:</strong> Están estructurados para permitir su procesamiento
                automatizado.
              </li>
              <li>
                <strong>No discriminatorios:</strong> Disponibles para cualquier persona sin necesidad de registro.
              </li>
              <li>
                <strong>No propietarios:</strong> Publicados en formatos abiertos, no controlados exclusivamente por
                alguna entidad.
              </li>
              <li>
                <strong>De libre licencia:</strong> No sujetos a restricciones de derechos de autor, patentes o marcas.
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
