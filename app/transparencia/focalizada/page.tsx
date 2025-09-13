import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import TransparencySubmenu from "@/components/transparency/submenu"

export default function TransparenciaFocalizadaPage() {
  return (
    <>
      <Navbar />
      <TransparencySubmenu />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Transparencia Focalizada</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link
              href="/transparencia/focalizada/tu-congreso"
              className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg shadow transition"
            >
              <h2 className="text-xl font-semibold mb-2">Tu Congreso</h2>
              <p className="text-gray-600">Información sobre el funcionamiento del Congreso</p>
            </Link>

            <Link
              href="/transparencia/focalizada/representantes"
              className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg shadow transition"
            >
              <h2 className="text-xl font-semibold mb-2">Tus Representantes</h2>
              <p className="text-gray-600">Información sobre legisladores y grupos parlamentarios</p>
            </Link>

            <Link
              href="/transparencia/focalizada/ciudadania"
              className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg shadow transition"
            >
              <h2 className="text-xl font-semibold mb-2">La Ciudadanía y el Congreso</h2>
              <p className="text-gray-600">Participación ciudadana en el proceso legislativo</p>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">¿Qué es la Transparencia Focalizada?</h2>
            <p className="text-gray-700 mb-4">
              La Transparencia Focalizada es una estrategia que busca identificar y publicar información específica que
              responde a las necesidades de la ciudadanía, presentada de manera clara y accesible.
            </p>
            <p className="text-gray-700">
              En esta sección encontrarás información relevante sobre el Congreso, tus representantes y los mecanismos
              de participación ciudadana, organizada de manera que puedas acceder fácilmente a los temas de tu interés.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
