import Image from "next/image";
import Link from "next/link";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

export default function CongressChannel() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-purple-900 text-white">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Congress Channel Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            <span className="font-semibold text-lg">Congreso</span>
          </div>
          <nav className="hidden md:flex space-x-6 uppercase text-sm font-medium">
            <Link href="/" className="hover:text-purple-200">
              Inicio
            </Link>
            <Link href="/programacion" className="hover:text-purple-200">
              Programación
            </Link>
            <Link href="/noticias" className="hover:text-purple-200">
              Noticias
            </Link>
            <Link href="/transmisiones" className="hover:text-purple-200">
              Transmisiones
            </Link>
            <Link href="/contacto" className="hover:text-purple-200">
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Live Now Section */}
        <section className="bg-purple-900 text-white py-4">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-4 text-center">
              EN VIVO AHORA
            </h2>
            <div className="relative">
              <div className="flex overflow-x-auto space-x-4 py-2 scrollbar-hide">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex-shrink-0 w-64 relative group">
                    <div className="relative h-36 w-full bg-purple-800 rounded-lg overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=144&width=256`}
                        alt={`Live stream ${item}`}
                        width={256}
                        height={144}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-purple-700 bg-opacity-70 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1 z-10">
                <ChevronLeft className="w-6 h-6 text-purple-900" />
              </button>
              <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1 z-10">
                <ChevronRight className="w-6 h-6 text-purple-900" />
              </button>
            </div>
          </div>
        </section>

        {/* Our Programs Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-900">
              NUESTROS PROGRAMAS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {["Agenda", "Noticias", "Congreso", "Mesa de", "Contacto"].map(
                (program, index) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden shadow-md bg-gray-100"
                  >
                    <div className="relative h-32">
                      <Image
                        src={`/placeholder.svg?height=128&width=200`}
                        alt={program}
                        width={200}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-2 text-center font-medium text-sm">
                      {program}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-900">
              NOTICIAS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-lg overflow-hidden shadow-md"
                >
                  <div className="relative h-48">
                    <Image
                      src={`/placeholder.svg?height=192&width=384`}
                      alt={`News ${item}`}
                      width={384}
                      height={192}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit
                    </h3>
                    <p className="text-xs text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Find Participation Section */}
        <section className="py-8 bg-purple-900 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">
                  ENCUENTRA LA PARTICIPACIÓN
                  <br />
                  DE TUS LEGISLADORES:
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-purple-800 p-3 rounded">
                    <p className="text-sm">Lorem ipsum dolor sit amet</p>
                  </div>
                  <div className="bg-purple-800 p-3 rounded">
                    <p className="text-sm">Lorem ipsum dolor sit amet</p>
                  </div>
                  <div className="bg-purple-800 p-3 rounded">
                    <p className="text-sm">Lorem ipsum dolor sit amet</p>
                  </div>
                  <div className="bg-purple-800 p-3 rounded">
                    <p className="text-sm">Lorem ipsum dolor sit amet</p>
                  </div>
                </div>
                <button className="bg-yellow-500 text-purple-900 px-4 py-2 rounded font-bold">
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Congress Channel Organs Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-900">
              ÓRGANOS DEL CANAL DEL CONGRESO
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-lg overflow-hidden">
                  <div className="relative h-40">
                    <Image
                      src={`/placeholder.svg?height=160&width=320`}
                      alt={`Organ ${item}`}
                      width={320}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-sm">
                      {item === 1
                        ? "DEFENSORÍA DE AUDIENCIA"
                        : item === 2
                          ? "COMISIÓN BICAMERAL"
                          : "Consejo Consultivo"}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Download App Section */}
        <section className="py-8 bg-purple-900 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
              DESCARGA NUESTRA APP
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center">
                <Image
                  src="/placeholder.svg?height=120&width=120"
                  alt="QR Code"
                  width={120}
                  height={120}
                  className="mx-auto mb-2 bg-white p-2"
                />
                <p className="text-sm">Android</p>
              </div>
              <div className="text-center">
                <Image
                  src="/placeholder.svg?height=120&width=120"
                  alt="QR Code"
                  width={120}
                  height={120}
                  className="mx-auto mb-2 bg-white p-2"
                />
                <p className="text-sm">iOS</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold mb-2">Contacto</h3>
              <p className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Enlaces</h3>
              <ul className="text-sm space-y-1">
                <li>
                  <Link href="#" className="hover:underline">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Programación
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Noticias
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Redes Sociales</h3>
              <div className="flex space-x-4">
                <Link href="#" className="hover:text-purple-200">
                  FB
                </Link>
                <Link href="#" className="hover:text-purple-200">
                  TW
                </Link>
                <Link href="#" className="hover:text-purple-200">
                  IG
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-purple-800 text-center text-sm">
            <p>© 2023 Canal del Congreso. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
