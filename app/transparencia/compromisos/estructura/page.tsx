import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TransparencySubmenu from "@/components/transparency/submenu"
import Image from "next/image"
import { MobileMenuProvider } from "@/components/mobile-menu-context"

export default function EstructuraPage() {
  return (
    <MobileMenuProvider>
      <Navbar />
      <TransparencySubmenu />
      <main className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Estructura y Presupuesto</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Estructura Organizacional</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <Image
                src="/hierarchical-org-chart.png"
                alt="Estructura Organizacional"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Presupuesto Anual</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Año</th>
                    <th className="py-2 px-4 border-b">Presupuesto Asignado</th>
                    <th className="py-2 px-4 border-b">Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">2023</td>
                    <td className="py-2 px-4 border-b">$XXX,XXX,XXX.00</td>
                    <td className="py-2 px-4 border-b">
                      <a href="#" className="text-blue-600 hover:underline">
                        Ver detalle
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">2022</td>
                    <td className="py-2 px-4 border-b">$XXX,XXX,XXX.00</td>
                    <td className="py-2 px-4 border-b">
                      <a href="#" className="text-blue-600 hover:underline">
                        Ver detalle
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </MobileMenuProvider>
  )
}
