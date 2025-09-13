import Image from "next/image"
import Link from "next/link"
import SocialBar from "@/components/social-bar"
import Footer from "@/components/footer"
import ChannelBar from "@/components/channel-bar"
import VideoGrid from "@/components/video-grid"

// Fetch video news from database
async function getVideoNewsFromDB() {
  // Skip API calls during build time
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_APP_URL) {
    console.log('Skipping API call during build time')
    return []
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/video-news/all`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      console.error('Failed to fetch video news:', response.statusText)
      return []
    }

    const data = await response.json()
    return data.map((item: any) => ({
      id: parseInt(item.id),
      title: item.title,
      imageUrl: item.thumbnailUrl || '/placeholder.svg',
      videoUrl: item.videoUrl || '#',
    }))
  } catch (error) {
    console.error('Error fetching video news:', error)
    return []
  }
}

const videoItems = await getVideoNewsFromDB()

export default function EnVivoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Header */}
      <header className="bg-purple-900 text-white">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/placeholder.svg?height=40&width=40&text=CC"
              alt="Canal del Congreso Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            <span className="font-semibold text-lg">Canal del Congreso</span>
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
            <Link href="/noticias/en-vivo" className="text-white font-bold border-b-2 border-white">
              En Vivo
            </Link>
            <Link href="/transparencia" className="hover:text-purple-200">
              Transparencia
            </Link>
            <Link href="/contacto" className="hover:text-purple-200">
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <ChannelBar />

        {/* Video Grid Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 relative">
            {/* Left Arrow */}
            <button className="absolute left-4 top-1/2 -translate-y-1/2 z-10" aria-label="Previous videos">
              <Image src="/images/flecha-izq.png" alt="Previous" width={60} height={60} />
            </button>

            {/* Right Arrow */}
            <button className="absolute right-4 top-1/2 -translate-y-1/2 z-10" aria-label="Next videos">
              <Image src="/images/flecha-der.png" alt="Next" width={60} height={60} />
            </button>

            <VideoGrid videos={videoItems} />

            {/* Ver más button */}
            <div className="flex flex-col items-center mt-10">
              <Link
                href="/videos"
                className="flex flex-col items-center text-pink-600 hover:text-pink-500 transition-colors"
              >
                <span className="text-xl font-bold">Ver más</span>
                <div className="w-16 h-16 flex items-center justify-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-pink-600"
                  >
                    <path
                      d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Social Bar */}
      <SocialBar />
    </div>
  )
}