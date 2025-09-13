import NewsSubmenu from "@/components/news-submenu"
import NewsGrid from "@/components/news-grid"
import { getNewsByCategory } from "@/lib/api"
import { notFound } from "next/navigation"

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

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params

  // Validate the category
  if (!validCategories.includes(category)) {
    notFound()
  }

  // Get news for this category
  const news = await getNewsByCategory(categoryNames[category])

  return (
    <main className="min-h-screen bg-white">
      {/* Main header and navigation would be here */}

      {/* News Submenu */}
      <NewsSubmenu />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{categoryNames[category]}</h1>

        {/* News Grid */}
        <NewsGrid newsItems={news} hideSearch={true} />
      </div>
    </main>
  )
}
