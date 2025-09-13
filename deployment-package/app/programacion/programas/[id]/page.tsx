import Image from "next/image"
import Link from "next/link"
import { getPrograms } from "@/lib/api"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Calendar, Clock, Play } from "lucide-react"

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const programs = await getPrograms()
  const program = programs.find((p) => p.id === id)

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-gray-900 p-8 rounded-lg shadow-md max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Programa no encontrado</h1>
          <p className="text-gray-300 mb-6">El programa que estás buscando no existe o ha sido eliminado.</p>
          <Link href="/programacion/programas" className="bg-[#e91e63] text-white px-4 py-2 rounded hover:bg-[#f06292]">
            Volver a Programas
          </Link>
        </div>
      </div>
    )
  }

  // Episodios simulados
  const episodes = [
    {
      id: "1",
      title: "Episodio 1: Introducción",
      description: "Primer episodio de la temporada",
      duration: "28:45",
      date: "15 Mar 2023",
      thumbnail: program.imageUrl,
    },
    {
      id: "2",
      title: "Episodio 2: Desarrollo",
      description: "Segundo episodio de la temporada",
      duration: "32:10",
      date: "22 Mar 2023",
      thumbnail: program.imageUrl,
    },
    {
      id: "3",
      title: "Episodio 3: Conclusiones",
      description: "Tercer episodio de la temporada",
      duration: "30:22",
      date: "29 Mar 2023",
      thumbnail: program.imageUrl,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-black text-white">
        {/* Hero Section */}
        <section className="relative">
          <div className="w-full h-[50vh] relative">
            <Image
              src={program?.imageUrl || "/placeholder.svg?height=500&width=1000&text=No+Image"}
              alt={program?.title || "Program"}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          </div>

          <div className="container mx-auto px-4 relative -mt-32 z-10">
            <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{program.title}</h1>
                <p className="text-xl text-gray-300 mb-6">{program.description}</p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <button className="bg-[#e91e63] text-white px-6 py-3 rounded-full font-medium hover:bg-[#f06292] flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Ver último episodio
                  </button>
                  <button className="border border-gray-600 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800">
                    Ver todos los episodios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Episodes Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Episodios recientes</h2>

            <div className="space-y-6">
              {episodes.map((episode) => (
                <div key={episode.id} className="bg-gray-900 rounded-xl overflow-hidden flex flex-col md:flex-row">
                  <div className="relative w-full md:w-64 h-48 flex-shrink-0">
                    <Image
                      src={episode.thumbnail || "/placeholder.svg?height=192&width=384&text=No+Image"}
                      alt={episode.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors">
                      <button className="bg-[#e91e63] text-white rounded-full p-3 hover:bg-[#f06292]">
                        <Play className="w-8 h-8" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 flex-grow">
                    <h3 className="text-xl font-bold mb-2">{episode.title}</h3>
                    <p className="text-gray-300 mb-4">{episode.description}</p>

                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{episode.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{episode.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Link
                href="#"
                className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 flex items-center gap-2"
              >
                Ver más episodios
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
