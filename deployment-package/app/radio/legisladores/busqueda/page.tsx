import Link from "next/link"
import Image from "next/image"
import { getLegislators, getParliamentaryGroups } from "@/lib/api"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default async function LegislatorSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; group?: string }>
}) {
  const { name, group } = await searchParams
  const [legislators, parliamentaryGroups] = await Promise.all([getLegislators(), getParliamentaryGroups()])

  // Filter legislators based on search params
  const filteredLegislators = legislators.filter((legislator) => {
    let matchesName = true
    let matchesGroup = true

    if (name) {
      matchesName = legislator.name.toLowerCase().includes(name.toLowerCase())
    }

    if (group) {
      matchesGroup = legislator.parliamentaryGroupId === group
    }

    return matchesName && matchesGroup
  })

  // Get parliamentary group names for display
  const groupsMap = Object.fromEntries(parliamentaryGroups.map((group) => [group.id, group]))

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-100">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#3b0764] mb-2">Resultados de búsqueda</h1>
            <div className="text-gray-600">
              {name && <span>Nombre: {name}</span>}
              {name && group && <span className="mx-2">|</span>}
              {group && <span>Grupo Parlamentario: {groupsMap[group]?.name || "Desconocido"}</span>}
            </div>
          </div>

          {filteredLegislators.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">No se encontraron resultados</h2>
              <p className="text-gray-600 mb-4">
                Intenta con otros términos de búsqueda o consulta todos nuestros legisladores.
              </p>
              <Link href="/radio/legisladores" className="inline-block bg-[#3b0764] text-white px-4 py-2 rounded-md">
                Ver todos los legisladores
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLegislators.map((legislator) => (
                <div key={legislator.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="w-20 h-20 relative rounded-full overflow-hidden mr-4">
                      <Image
                        src={legislator.imageUrl || "/placeholder.svg?height=80&width=80&text=Legislador"}
                        alt={legislator.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">{legislator.name}</h2>
                      <p className="text-gray-600">{groupsMap[legislator.parliamentaryGroupId]?.name || "Sin grupo"}</p>
                      <p className="text-gray-600">{legislator.state}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 border-t">
                    <Link
                      href={`/radio/legisladores/${legislator.id}`}
                      className="text-[#3b0764] font-medium hover:underline"
                    >
                      Ver participaciones →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
