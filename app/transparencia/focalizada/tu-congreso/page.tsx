import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TransparencySubmenu from "@/components/transparency/submenu"
import Image from "next/image"

export default function TuCongresoPage() {
  return (
    <>
      <Navbar />
      <TransparencySubmenu />
      <main className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Tu Congreso</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">¿Qué es el Congreso de la Unión?</h2>
            <p>
              El Congreso de la Unión es el órgano depositario del Poder Legislativo federal de México. Está compuesto
              por dos cámaras: la Cámara de Diputados y la Cámara de Senadores.
            </p>
            <p>
              La Cámara de Diputados está integrada por 500 diputados electos cada tres años, mientras que la Cámara de
              Senadores está compuesta por 128 senadores electos cada seis años.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Funciones del Congreso</h3>
            <ul>
              <li>Crear, reformar, adicionar, y derogar leyes y decretos</li>
              <li>Aprobar el Presupuesto de Egresos de la Federación</li>
              <li>Ratificar nombramientos realizados por el Ejecutivo Federal</li>
              <li>Fiscalizar el uso de recursos públicos</li>
              <li>Representar a la ciudadanía</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Cámara de Diputados</h3>
              <Image
                src="/Mexican-Deputies-Debate.png"
                alt="Cámara de Diputados"
                width={400}
                height={200}
                className="w-full h-auto mb-3"
              />
              <p className="text-gray-700">
                La Cámara de Diputados se renueva en su totalidad cada tres años y representa a la población de manera
                proporcional.
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Senado de la República</h3>
              <Image
                src="/Mexican-Senate-Chamber.png"
                alt="Senado de la República"
                width={400}
                height={200}
                className="w-full h-auto mb-3"
              />
              <p className="text-gray-700">
                El Senado se compone de 128 senadores, quienes permanecen en el cargo por seis años y representan a las
                entidades federativas.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
