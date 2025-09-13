
import Link from "next/link"
import Image from "next/image"
import SocialBar from "@/components/social-bar"
import Footer from "@/components/footer"
import NewsSubmenu from "@/components/news-submenu"
import ChannelBar from "@/components/channel-bar"
import NewsGrid from "@/components/news-grid"
import { getAllNewsFromDB } from "@/lib/api-database"

interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  imageUrl: string
  category?: string
  publishedAt: Date
  createdAt: Date
  status?: string
}

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default async function AllNewsPage() {
  // Automatically publish any scheduled news that should now be live
  try {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/news/publish-scheduled`, {
      method: 'POST',
      cache: 'no-store'
    })
  } catch (error) {
    console.error('Error auto-publishing scheduled news:', error)
  }

  // Fetch all news from API route (including published and scheduled)
  let newsItems: NewsItem[] = []

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/news/all`, {
      cache: 'no-store'
    })

    if (response.ok) {
      const allNews = await response.json()
      // Filter to only show published news and sort chronologically
      newsItems = allNews
        .filter((item: NewsItem) => !item.status || item.status === 'published')
        .sort((a: NewsItem, b: NewsItem) => {
          const dateA = new Date(a.publishedAt || a.createdAt)
          const dateB = new Date(b.publishedAt || b.createdAt)
          return dateB.getTime() - dateA.getTime() // Most recent first
        })
    } else {
      console.error('Failed to fetch news:', response.status, response.statusText)
      newsItems = []
    }
  } catch (error) {
    console.error('Failed to load news:', error)
    newsItems = []
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow bg-[url('/images/light-hexagon-pattern.png')] bg-repeat">
        <ChannelBar />
        <NewsSubmenu />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Todas las Noticias
            </h1>
            <p className="text-gray-600 text-lg">
              Todas las noticias del Congreso ordenadas cronológicamente desde la más reciente
            </p>
            <div className="h-1 w-20 bg-[#e11d48] mt-4"></div>
          </div>

          

          {/* News Grid */}
          <NewsGrid newsItems={newsItems} hideSearch={false} />

          {newsItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hay noticias disponibles
              </h3>
              <p className="text-gray-500">
                Las noticias aparecerán aquí cuando estén disponibles.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Social Bar */}
      <SocialBar />
    </div>
  )
}
