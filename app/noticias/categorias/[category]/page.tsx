"use client"

import NewsSubmenu from "@/components/news-submenu"
import NewsGrid from "@/components/news-grid"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

// Define valid categories to match our menu items
const validCategories = [
  "foros-y-seminarios",
  "reformas-aprobadas",
  "temas-de-actualidad",
  "trabajo-en-comisiones",
  "reformas-en-dof",
  "trabajos-en-pleno",
]

// Map slugs to display names
const categoryNames: Record<string, string> = {
  "foros-y-seminarios": "Foros y seminarios",
  "reformas-aprobadas": "Reformas aprobadas",
  "temas-de-actualidad": "Temas de actualidad",
  "trabajo-en-comisiones": "Trabajo en comisiones",
  "reformas-en-dof": "Reformas en DOF",
  "trabajos-en-pleno": "Trabajo en pleno",
}

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

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as string
  
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Validate the category
  useEffect(() => {
    if (!validCategories.includes(category)) {
      router.replace('/404')
      return
    }
  }, [category, router])

  const fetchNews = async (page: number) => {
    // Don't fetch if category is invalid
    if (!validCategories.includes(category)) {
      return
    }
    
    try {
      setLoading(true)
      
      const response = await fetch(`/api/news?page=${page}&limit=20&category=${encodeURIComponent(categoryNames[category])}`, {
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
  }, [category])

  const handlePageChange = (page: number) => {
    fetchNews(page)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Main header and navigation would be here */}

      {/* News Submenu */}
      <NewsSubmenu />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{categoryNames[category]}</h1>

        {/* News Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-gray-600">Cargando noticias...</span>
          </div>
        ) : (
          <NewsGrid 
            newsItems={newsItems} 
            hideSearch={true}
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </main>
  )
}
