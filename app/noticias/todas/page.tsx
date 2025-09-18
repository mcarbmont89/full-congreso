"use client"

import Link from "next/link"
import Image from "next/image"
import SocialBar from "@/components/social-bar"
import Footer from "@/components/footer"
import NewsSubmenu from "@/components/news-submenu"
import ChannelBar from "@/components/channel-bar"
import NewsGrid from "@/components/news-grid"
import { useState, useEffect } from "react"

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


function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function AllNewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNews = async (page: number) => {
    try {
      setLoading(true)
      
      // Note: Auto-publish moved to server-side for security

      const response = await fetch(`/api/news?page=${page}&limit=20`, {
        cache: 'no-store'
      })

      if (response.ok) {
        const data = await response.json()
        const newsData = data.news || data // Handle both formats
        
        setNewsItems(newsData)
        setTotal(data.total || newsData.length)
        setTotalPages(data.totalPages || 1)
        setCurrentPage(page)
      } else {
        console.error('Failed to fetch news:', response.status)
        setNewsItems([])
      }
    } catch (error) {
      console.error('Failed to load news:', error)
      setNewsItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews(1)
  }, [])

  const handlePageChange = (page: number) => {
    fetchNews(page)
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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">Cargando noticias...</span>
            </div>
          ) : (
            <NewsGrid 
              newsItems={newsItems} 
              hideSearch={false}
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              onPageChange={handlePageChange}
            />
          )}

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
