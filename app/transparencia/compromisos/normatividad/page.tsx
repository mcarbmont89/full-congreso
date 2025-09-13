import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TransparencySubmenu from "@/components/transparency/submenu"
import Link from "next/link"

export default function NormatividadPage() {
  return (
    <>
      <Navbar />
      <TransparencySubmenu />
      <main className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Normatividad</h1>
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">Marco Normativo</h2>
          <ul className="space-y-3">
            <li>
              <Link href="#" className="text-blue-600 hover:underline">
                Constitución Política de los Estados Unidos Mexicanos
              </Link>
            </li>
            <li>
              <Link href="#" className="text-blue-600 hover:underline">
                Ley Orgánica del Congreso General de los Estados Unidos Mexicanos
              </Link>
            </li>
            <li>
              <Link href="#" className="text-blue-600 hover:underline">
                Reglamento del Canal de Televisión del Congreso General
              </Link>
            </li>
            {/* More items would go here */}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  )
}
