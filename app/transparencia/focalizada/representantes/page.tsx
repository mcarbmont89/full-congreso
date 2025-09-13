import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TransparencySubmenu from "@/components/transparency/submenu"

export default function RepresentantesPage() {
  return (
    <>
      <Navbar />
      <TransparencySubmenu />
      <main className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Tus Representantes</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Busca a tus Representantes</h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="estado" className="block text-gray-700 mb-2">
                  Estado:
                </label>
                <select
                  id="estado"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona un estado</option>
                  <option value="cdmx">Ciudad de México</option>
                  <option value="jalisco">Jalisco</option>
                  <option value="nuevo-leon">Nuevo León</option>
                  {/* More options would go here */}
                </select>
              </div>

              <div>
                <label htmlFor="distrito" className="block text-gray-700 mb-2">
                  Distrito:
                </label>
                <select
                  id="distrito"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona un distrito</option>
                  {/* Districts would be populated based on selected state */}
                </select>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Legisladores por Grupo Parlamentario</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Group 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-blue-600 text-white text-center">
                <h3 className="font-semibold">Grupo Parlamentario A</h3>
              </div>
              <div className="p-4">
                <p className="text-center mb-3 font-medium">Total: 45 legisladores</p>
                <div className="text-center">
                  <button className="text-blue-600 hover:underline">Ver detalles</button>
                </div>
              </div>
            </div>

            {/* Group 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-red-600 text-white text-center">
                <h3 className="font-semibold">Grupo Parlamentario B</h3>
              </div>
              <div className="p-4">
                <p className="text-center mb-3 font-medium">Total: 32 legisladores</p>
                <div className="text-center">
                  <button className="text-blue-600 hover:underline">Ver detalles</button>
                </div>
              </div>
            </div>

            {/* Group 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-green-600 text-white text-center">
                <h3 className="font-semibold">Grupo Parlamentario C</h3>
              </div>
              <div className="p-4">
                <p className="text-center mb-3 font-medium">Total: 28 legisladores</p>
                <div className="text-center">
                  <button className="text-blue-600 hover:underline">Ver detalles</button>
                </div>
              </div>
            </div>

            {/* Group 4 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-yellow-600 text-white text-center">
                <h3 className="font-semibold">Grupo Parlamentario D</h3>
              </div>
              <div className="p-4">
                <p className="text-center mb-3 font-medium">Total: 21 legisladores</p>
                <div className="text-center">
                  <button className="text-blue-600 hover:underline">Ver detalles</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
