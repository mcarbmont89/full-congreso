import LegislatorSearch from "@/components/legislator-search"
import type { ParliamentaryGroup } from "@/lib/api"
import Image from 'next/image'

interface EncuentraParticipacionProps {
  parliamentaryGroups: any[]
}

export default function EncuentraParticipacion({
  parliamentaryGroups,
}: EncuentraParticipacionProps) {
  return (
    <section
      className="w-full py-12 md:py-16 bg-[#2e004f]"
      style={{
        backgroundImage:
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GQcG3uPDtVwAkBDw9QkggoZczNXgwf.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white uppercase tracking-wide">
              ENCUENTRA LA
              <br />
              <span className="text-[#FFD700] font-extrabold">PARTICIPACIÓN</span>
              <br />
              DE TUS LEGISLADORES:
            </h2>
          </div>
          <div>
            <LegislatorSearch parliamentaryGroups={parliamentaryGroups} />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {parliamentaryGroups.length > 0 ? (
            parliamentaryGroups.map((group) => (
              <div key={group.id} className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                  <Image
                    src={group.imageUrl || "/placeholder.svg"}
                    alt={group.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-xs font-medium text-gray-800">{group.abbreviation}</p>
              </div>
            ))
          ) : null}
        </div>
      </div>
    </section>
  )
}