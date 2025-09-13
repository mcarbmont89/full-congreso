import Link from "next/link"
import Image from "next/image"
import { getNewsFromDB, getLiveStreamsFromDB } from "@/lib/api-database"
import { Play } from "lucide-react"

// Importa los componentes
import Footer from "@/components/footer"
import TwitterFeed from "@/components/twitter-feed"

// Import rich text styles
import "@/styles/rich-text.css"

// Define the News interface with optional additional image URLs
interface News {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  imageUrl: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;
  category?: string;
  status?: string;
  publishedAt?: string;
  createdAt?: string;
}

export default async function NoticiaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let news: News[] = []
  let noticia: News | undefined
  let liveStreams: any[] = []

  try {
    const newsData = await getNewsFromDB()
    news = newsData.map(item => ({
      ...item,
      publishedAt: item.publishedAt ? item.publishedAt.toISOString() : undefined,
      createdAt: item.createdAt ? item.createdAt.toISOString() : undefined
    }))

    // Fetch live streams
    const streamsData = await getLiveStreamsFromDB()
    liveStreams = streamsData || []

    console.log(`Looking for news with ID: ${id}`)
    console.log(`Available news IDs: ${news.map(n => n.id).join(', ')}`)

    noticia = news.find((item) => item.id.toString() === id)

    if (!noticia) {
      console.log(`News item with ID ${id} not found`)
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Noticia no encontrada</h1>
            <p className="text-gray-600 mb-6">La noticia que estás buscando no existe o ha sido eliminada.</p>
            <Link href="/noticias" className="bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-800">
              Volver a Noticias
            </Link>
          </div>
        </div>
      )
    }

    console.log(`Found news item: ${noticia.title}`)
  } catch (error) {
    console.error('Error fetching news for detail page:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error al cargar la noticia</h1>
          <p className="text-gray-600 mb-6">Hubo un problema al cargar la noticia. Por favor intenta nuevamente.</p>
          <Link href="/noticias" className="bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-800">
            Volver a Noticias
          </Link>
        </div>
      </div>
    )
  }

  // Obtener noticias relacionadas (excluyendo la actual y solo publicadas)
  const now = new Date();
  const noticiasRelacionadas = news.filter((item) => {
    const publishedDate = new Date(item.publishedAt || item.createdAt || new Date());
    return item.id.toString() !== id && 
           (!item.status || item.status === 'published') && 
           publishedDate <= now;
  }).sort((a, b) => {
    // Sort by publishedAt date, most recent first
    const aDate = new Date(a.publishedAt || a.createdAt || Date.now());
    const bDate = new Date(b.publishedAt || b.createdAt || Date.now());
    return bDate.getTime() - aDate.getTime();
  }).slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Submenú de navegación */}
      <div className="bg-purple-900 border-t border-purple-800">
        <div className="container mx-auto overflow-x-auto">
          <div className="flex justify-center space-x-6 py-3 text-sm font-medium text-white">
            <Link href="/noticias" className="text-white hover:text-purple-200">
              Inicio
            </Link>
            <Link href="/noticias/categorias/foros-y-seminarios" className="text-white hover:text-purple-200">
              Foros y seminarios
            </Link>
            <Link href="/noticias/categorias/reformas-aprobadas" className="text-white hover:text-purple-200">
              Reformas aprobadas
            </Link>
            <Link href="/noticias/categorias/temas-de-actualidad" className="text-white hover:text-purple-200">
              Temas de actualidad
            </Link>
            <Link href="/noticias/categorias/trabajo-en-comisiones" className="text-white hover:text-purple-200">
              Trabajo en comisiones
            </Link>
            <Link href="/noticias/categorias/reformas-en-dof" className="text-white hover:text-purple-200">
              Reformas en DOF
            </Link>
            <Link href="/noticias/categorias/trabajo-en-pleno" className="text-white hover:text-purple-200">
              Trabajos en pleno
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-grow bg-gray-100">
        {/* Breadcrumbs */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center text-sm text-gray-500">
              <Link href="/" className="hover:text-purple-900">
                Inicio
              </Link>
              <span className="mx-2">/</span>
              <Link href="/noticias" className="hover:text-purple-900">
                Noticias
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700 truncate max-w-xs">{noticia.title}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article Content */}
            <article className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="relative h-96 w-full rounded-lg overflow-hidden flex items-center justify-center p-4"
                style={{
                  backgroundImage: "url(/images/purple-pattern-bg.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: "#7c3aed"
                }}
              >
                <Image
                  src={noticia.imageUrl || "/placeholder.svg?height=400&width=800&text=Sin+Imagen"}
                  alt={noticia.title}
                  width={600}
                  height={400}
                  className="object-contain rounded-[2rem] shadow-lg"
                  style={{
                    maxHeight: "calc(100% - 2rem)",
                    maxWidth: "calc(100% - 2rem)",
                    borderRadius: "44px"
                  }}
                  unoptimized={true}
                  priority
                />
                <div className="absolute bottom-0 left-0 bg-purple-900 text-white px-3 py-1 text-xs">
                  {new Date(noticia.publishedAt || noticia.createdAt || Date.now()).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>

              <div className="p-6 md:p-8">
                <h1 className="text-3xl font-bold mb-4">{noticia.title}</h1>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    {noticia.title.includes("Senado")
                      ? "Senado de la República"
                      : noticia.title.includes("Cámara")
                        ? "Cámara de Diputados"
                        : noticia.title.includes("México")
                          ? "México, Estados Unidos"
                          : "Noticias Generales"}
                  </span>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div 
                    className="rich-text-content text-lg text-gray-700 mb-6"
                    dangerouslySetInnerHTML={{ 
                      __html: (noticia.summary || "").replace(
                        /!\[([^\]]*)\]\(([^)]+)\)/g, 
                        '<img src="$2" alt="$1" class="rounded-lg shadow-md max-w-full h-auto my-4" />'
                      )
                    }}
                  />
                  <div className="rich-text-content text-gray-700 leading-relaxed">

                    {noticia.content ? (
                      <div 
                        className="rich-text-content public-view prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: noticia.content.includes('two-column-layout') 
                            ? noticia.content.replace(/class="([^"]*?)two-column-layout([^"]*?)"/g, 'class="$1two-column-layout$2"')
                            : noticia.content 
                        }}
                      />
                    ) : (
                      <>
                        <p>
                          El día de hoy, en el marco de las actividades legislativas, se llevó a cabo un importante
                          evento relacionado con {noticia.title.toLowerCase()}. Esta iniciativa representa un avance
                          significativo en la agenda legislativa del país.
                        </p>
                        <p>
                          Durante la sesión, diversos legisladores expresaron sus puntos de vista sobre la importancia
                          de esta medida y su impacto en la sociedad mexicana. Se destacó la necesidad de continuar
                          trabajando en un marco legal que responda a las necesidades actuales de la ciudadanía.
                        </p>
                        <p>
                          El presidente de la comisión encargada del tema señaló que "este es un paso importante para
                          fortalecer nuestras instituciones y garantizar el bienestar de todos los mexicanos". Asimismo,
                          se anunció que en las próximas semanas se continuará con el análisis y discusión de propuestas
                          relacionadas.
                        </p>
                        <p>
                          Esta noticia se suma a una serie de acciones que el Congreso ha implementado en los últimos
                          meses, reafirmando su compromiso con la transparencia y el fortalecimiento democrático del
                          país.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Additional Images Gallery */}
                {(noticia.imageUrl2 || noticia.imageUrl3 || noticia.imageUrl4 || noticia.imageUrl5) && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Galería de imágenes</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {noticia.imageUrl2 && (
                        <div className="relative aspect-square">
                          <Image
                            src={noticia.imageUrl2}
                            alt={`${noticia.title} - Imagen 2`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      {noticia.imageUrl3 && (
                        <div className="relative aspect-square">
                          <Image
                            src={noticia.imageUrl3}
                            alt={`${noticia.title} - Imagen 3`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      {noticia.imageUrl4 && (
                        <div className="relative aspect-square">
                          <Image
                            src={noticia.imageUrl4}
                            alt={`${noticia.title} - Imagen 4`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      {noticia.imageUrl5 && (
                        <div className="relative aspect-square">
                          <Image
                            src={noticia.imageUrl5}
                            alt={`${noticia.title} - Imagen 5`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Share Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-4">Compartir:</span>
                    <div className="flex space-x-2">
                      <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                        </svg>
                      </button>
                      <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56
 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"
                          />
                        </svg>
                      </button>
                      <button className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.9 17.1c-2.5 0-4.6-2-4.6-4.5s2-4.5 4.6-4.5c1.3 0 2.4.5 3.3 1.3l-1.3 1.3c-.5-.5-1.2-.8-2-.8-1.7 0-3.1 1.4-3.1 3.1s1.4 3.1 3.1 3.1c1.1 0 1.9-.5 2.3-1.2h-2.3v-1.7h4c.1.4.1.8.1 1.2 0 2.4-1.7 4.4-4.1 4.4zm9.1-4h-1.5v1.5h-1.5V13h-1.5v-1.5h1.5V10h1.5v1.5H18V13z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Noticias Relacionadas */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="bg-purple-900 text-white px-4 py-2 font-bold uppercase text-sm">
                  Noticias Relacionadas
                </h2>
                <div className="p-4 space-y-4">
                  {noticiasRelacionadas.map((item) => (
                    <div key={item.id} className="flex space-x-3">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.imageUrl || "/placeholder.svg?height=80&width=80"}
                          alt={item.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
                        <Link
                          href={`/noticias/${item.id}`}
                          className="text-purple-900 text-xs font-medium hover:underline"
                        >
                          Leer más →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}