import Link from "next/link"
import Image from "next/image"
import { getLegislators, getParliamentaryGroups } from "@/lib/api"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default async function LegislatorsPage() {
  const [legislators, parliamentaryGroups] = await Promise.all([getLegislators(), getParliamentaryGroups()])

  // Get parliamentary group names for display
  const groupsMap = Object.fromEntries(parliamentaryGroups.map((group) => [group.id, group]))

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-100">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-[#3b0764] mb-6">Legisladores</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legislators.map((legislator) => (
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
        </div>
      </main>

      <Footer />
    </div>
  )
}
