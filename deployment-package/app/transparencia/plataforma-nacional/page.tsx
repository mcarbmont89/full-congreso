import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TransparencySubmenu from "@/components/transparency/submenu"
import Image from "next/image"

export default function PlataformaNacionalPage() {
  return (
    <>
      <Navbar />
      <TransparencySubmenu />
      <main className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Plataforma Nacional de Transparencia</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">¿Qué es la Plataforma Nacional de Transparencia?</h2>
            <p>
              La Plataforma Nacional de Transparencia (PNT) es una herramienta tecnológica desarrollada por el Instituto
              Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI), que facilita a
              la ciudadanía el ejercicio de los derechos de acceso a la información y de protección de datos personales.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">¿Qué puedes hacer en la PNT?</h3>
            <ul>
              <li>
                <strong>Solicitar información pública</strong> a cualquier sujeto obligado del país.
              </li>
              <li>
                <strong>Interponer recursos de revisión</strong> cuando no estés conforme con las respuestas recibidas.
              </li>
              <li>
                <strong>Consultar información pública</strong> que los sujetos obligados deben publicar de oficio.
              </li>
              <li>
                <strong>Ejercer tus derechos ARCO</strong> (Acceso, Rectificación, Cancelación y Oposición) sobre tus
                datos personales.
              </li>
              <li>
                <strong>Denunciar incumplimientos</strong> a las obligaciones de transparencia.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Información del Canal del Congreso en la PNT</h3>
            <p>
              En la Plataforma Nacional de Transparencia podrás encontrar toda la información pública del Canal del
              Congreso que debe ser publicada de acuerdo con las obligaciones establecidas en la Ley General de
              Transparencia y Acceso a la Información Pública.
            </p>
            <p>
              Esto incluye información sobre presupuesto, contratos, estructura orgánica, remuneraciones, normatividad,
              informes y más.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-100 p-5 rounded-lg text-center">
              <Image
                src="/mexican-transparency-portal.png"
                alt="Plataforma Nacional de Transparencia"
                width={400}
                height={200}
                className="w-full h-auto mb-4"
              />

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Accede a la Plataforma</h3>
                <p className="text-gray-700 mb-4">
                  Visita la Plataforma Nacional de Transparencia para consultar información pública o realizar
                  solicitudes de información.
                </p>
                <a
                  href="https://www.plataformadetransparencia.org.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium"
                >
                  Ir a la Plataforma
                </a>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">¿Necesitas ayuda?</h3>
                <p className="text-gray-700 mb-4">
                  Si tienes dudas sobre cómo utilizar la Plataforma Nacional de Transparencia, consulta los siguientes
                  recursos:
                </p>
                <div className="flex flex-col space-y-2">
                  <a href="#" className="text-blue-600 hover:underline">
                    Manual de usuario
                  </a>
                  <a href="#" className="text-blue-600 hover:underline">
                    Preguntas frecuentes
                  </a>
                  <a href="#" className="text-blue-600 hover:underline">
                    Videos tutoriales
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
