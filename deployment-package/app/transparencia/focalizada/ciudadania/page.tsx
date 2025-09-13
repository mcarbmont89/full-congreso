import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TransparencySubmenu from "@/components/transparency/submenu"
import { MobileMenuProvider } from "@/components/mobile-menu-context"

export default function CiudadaniaCongresoPage() {
  return (
    <MobileMenuProvider>
      <Navbar />
      <TransparencySubmenu />
      <main className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">La Ciudadanía y el Congreso</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Participación Ciudadana</h2>
            <p>
              La participación ciudadana es fundamental para el fortalecimiento de la democracia. El Congreso de la
              Unión cuenta con diversos mecanismos para que la ciudadanía pueda involucrarse en el proceso legislativo y
              en la toma de decisiones.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Mecanismos de Participación</h3>
            <ul>
              <li>
                <strong>Iniciativa Ciudadana:</strong> Mecanismo que permite a los ciudadanos presentar propuestas de
                ley ante el Congreso.
              </li>
              <li>
                <strong>Consultas Públicas:</strong> Proceso mediante el cual se recogen opiniones y propuestas de la
                ciudadanía sobre temas específicos.
              </li>
              <li>
                <strong>Parlamento Abierto:</strong> Prácticas que promueven la transparencia, rendición de cuentas y
                participación ciudadana en la labor legislativa.
              </li>
              <li>
                <strong>Audiencias Públicas:</strong> Espacios de diálogo donde ciudadanos pueden expresar sus opiniones
                sobre iniciativas legislativas.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Cómo Participar</h3>
            <p>Si deseas participar en el proceso legislativo, puedes hacerlo a través de las siguientes vías:</p>
            <ol>
              <li>Contacta a tus representantes (diputados y senadores).</li>
              <li>Participa en las consultas públicas y audiencias convocadas por el Congreso.</li>
              <li>
                Presenta una iniciativa ciudadana (requiere el respaldo de al menos el 0.13% de la lista nominal de
                electores).
              </li>
              <li>Asiste a las sesiones públicas del Congreso.</li>
              <li>Sigue las actividades legislativas a través del Canal del Congreso.</li>
            </ol>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-100 p-5 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Próximos Eventos</h3>
              <ul className="space-y-4">
                <li className="border-b border-gray-200 pb-3">
                  <p className="font-medium">Audiencia Pública: Reforma Educativa</p>
                  <p className="text-gray-600">Fecha: 15 de mayo, 2024</p>
                  <p className="text-gray-600">Lugar: Cámara de Diputados</p>
                  <a href="#" className="text-blue-600 hover:underline text-sm">
                    Más información
                  </a>
                </li>
                <li className="border-b border-gray-200 pb-3">
                  <p className="font-medium">Consulta Ciudadana: Ley de Agua</p>
                  <p className="text-gray-600">Fecha: 22 de mayo, 2024</p>
                  <p className="text-gray-600">Modalidad: Virtual</p>
                  <a href="#" className="text-blue-600 hover:underline text-sm">
                    Más información
                  </a>
                </li>
                <li>
                  <p className="font-medium">Foro: Parlamento Abierto</p>
                  <p className="text-gray-600">Fecha: 5 de junio, 2024</p>
                  <p className="text-gray-600">Lugar: Senado de la República</p>
                  <a href="#" className="text-blue-600 hover:underline text-sm">
                    Más información
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold mb-3">Recursos para la Ciudadanía</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z"></path>
                      <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"></path>
                    </svg>
                    Guía para presentar una Iniciativa Ciudadana
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z"></path>
                      <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"></path>
                    </svg>
                    Proceso Legislativo Explicado
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z"></path>
                      <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"></path>
                    </svg>
                    Glosario Legislativo
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z"></path>
                      <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"></path>
                    </svg>
                    Calendario Legislativo
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </MobileMenuProvider>
  )
}
