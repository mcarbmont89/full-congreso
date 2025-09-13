import Image from "next/image"
import Link from "next/link"
import { getPrograms } from "@/lib/api"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default async function ProgramasPage() {
  const programs = await getPrograms()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-black">
        {/* Hero Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-6 text-center text-[#e91e63]">NUESTROS PROGRAMAS</h1>
            <p className="text-xl max-w-3xl mx-auto text-center text-white mb-12">
              Descubre nuestra programación exclusiva del Canal del Congreso
            </p>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {programs.map((program) => (
                <Link
                  key={program.id}
                  href={`/programacion/programas/${program.id}`}
                  className="rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={program.imageUrl || "/placeholder.svg?height=192&width=384&text=No+Image"}
                      alt={program.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 bg-gray-900">
                    <h3 className="font-bold text-white">{program.title}</h3>
                    <p className="text-gray-300 text-sm">{program.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700"
                >
                  Anterior
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-[#e91e63] text-sm font-medium text-white"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700"
                >
                  2
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700"
                >
                  Siguiente
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
