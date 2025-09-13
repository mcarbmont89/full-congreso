import { Suspense } from "react"
import { getLiveStreams } from "@/lib/api"
import AutoScrollCarouselGiant from "@/components/auto-scroll-carousel-giant"

export const metadata = {
  title: "Programación - Canal del Congreso",
  description: "Consulta la programación del Canal del Congreso",
}

export default async function ProgramacionPage() {
  const liveStreams = await getLiveStreams()

  return (
    <main className="min-h-screen bg-[#3b0764]">
      <div className="container mx-auto py-40">
        <h1 className="text-[300px] font-bold text-white text-center mb-80">Programación</h1>

        <section className="mb-120">
          <Suspense
            fallback={<div className="text-white text-8xl text-center py-80">Cargando transmisiones en vivo...</div>}
          >
            <AutoScrollCarouselGiant items={liveStreams} />
          </Suspense>
        </section>
      </div>
    </main>
  )
}
