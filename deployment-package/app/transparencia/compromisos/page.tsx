import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import TransparencySubmenu from "@/components/transparency/submenu"

export default function CompromisosPage() {
  return (
    <>
      <Navbar />
      <TransparencySubmenu />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Compromisos con la Transparencia</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link
              href="/transparencia/compromisos/tu-canal"
              className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg shadow transition"
            >
              <h2 className="text-xl font-semibold mb-2">Tu Canal</h2>
              <p className="text-gray-600">Información sobre el Canal del Congreso</p>
            </Link>

            <Link
              href="/transparencia/compromisos/normatividad"
              className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg shadow transition"
            >
              <h2 className="text-xl font-semibold mb-2">Normatividad</h2>
              <p className="text-gray-600">Marco normativo aplicable</p>
            </Link>

            <Link
              href="/transparencia/compromisos/estructura"
              className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg shadow transition"
            >
              <h2 className="text-xl font-semibold mb-2">Estructura y Presupuesto</h2>
              <p className="text-gray-600">Organización y recursos financieros</p>
            </Link>

            <Link
              href="/transparencia/compromisos/informacion"
              className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg shadow transition"
            >
              <h2 className="text-xl font-semibold mb-2">Información Relevante</h2>
              <p className="text-gray-600">Información de utilidad pública</p>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Nuestro Compromiso con la Transparencia</h2>
            <p className="text-gray-700 mb-4">
              El Canal del Congreso está comprometido con la transparencia y el acceso a la información pública. En esta
              sección encontrarás toda la información relacionada con nuestras obligaciones de transparencia, estructura
              organizacional, normatividad y recursos públicos.
            </p>
            <p className="text-gray-700">
              Ponemos a tu disposición información clara y accesible sobre nuestro funcionamiento, con el objetivo de
              fomentar la rendición de cuentas y la participación ciudadana.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
