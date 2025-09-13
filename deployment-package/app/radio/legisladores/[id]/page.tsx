import Link from "next/link"
import Image from "next/image"
import { getLegislatorById, getParliamentaryGroupById } from "@/lib/api"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default async function LegislatorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const legislator = await getLegislatorById(id)

  if (!legislator) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Legislador no encontrado</h1>
            <Link href="/radio/legisladores" className="text-[#3b0764] hover:underline">
              Volver al listado de legisladores
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const parliamentaryGroup = await getParliamentaryGroupById(legislator.parliamentaryGroupId)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-100">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Link href="/radio/legisladores" className="text-[#3b0764] hover:underline mb-4 inline-block">
              ← Volver al listado de legisladores
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 p-6 flex justify-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden">
                  <Image
                    src={legislator.imageUrl || "/placeholder.svg?height=192&width=192&text=Legislador"}
                    alt={legislator.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <h1 className="text-3xl font-bold text-[#3b0764] mb-2">{legislator.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h3 className="font-semibold text-gray-600">Grupo Parlamentario</h3>
                    <p>{parliamentaryGroup?.name || "No disponible"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600">Legislatura</h3>
                    <p>{legislator.legislature || "No disponible"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600">Estado</h3>
                    <p>{legislator.state || "No disponible"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600">Tipo</h3>
                    <p>{legislator.type || "No disponible"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600">Género</h3>
                    <p>{legislator.gender === "M" ? "Masculino" : "Femenino"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600">Estado</h3>
                    <p>{legislator.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-[#3b0764] mb-4">Participaciones</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-center py-8">No hay participaciones registradas para este legislador.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
