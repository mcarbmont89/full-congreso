
import { NextResponse } from 'next/server'

// Generate sitemap dynamically
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  // Static pages
  const staticPages = [
    '',
    '/noticias',
    '/noticias/todas',
    '/noticias/en-vivo',
    '/radio',
    '/transmisiones',
    '/transparencia',
    '/transparencia/focalizada',
    '/transparencia/focalizada/tu-congreso',
    '/transparencia/focalizada/representantes',
    '/transparencia/focalizada/ciudadania',
    '/transparencia/datos-abiertos',
    '/transparencia/compromisos',
    '/transparencia/compromisos/estructura',
    '/transparencia/compromisos/informacion',
    '/transparencia/compromisos/normatividad',
    '/transparencia/plataforma-nacional',
    '/programacion',
    '/programacion/programas',
    '/radio/legisladores',
    '/radio/legisladores/busqueda',
    '/contacto'
  ]

  // News categories
  const newsCategories = ['politica', 'economia', 'sociedad', 'actualidad']

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
  })

  // Add news category pages
  newsCategories.forEach(category => {
    sitemap += `  <url>
    <loc>${baseUrl}/noticias/categorias/${category}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
`
  })

  try {
    // Fetch news articles
    const newsResponse = await fetch(`${baseUrl}/api/news/all`, {
      cache: 'no-store'
    })
    
    if (newsResponse.ok) {
      const news = await newsResponse.json()
      news.forEach((article: any) => {
        sitemap += `  <url>
    <loc>${baseUrl}/noticias/${article.id}</loc>
    <lastmod>${new Date(article.updatedAt || article.createdAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`
      })
    }

    // Fetch radio programs
    const programsResponse = await fetch(`${baseUrl}/api/radio/programs`, {
      cache: 'no-store'
    })
    
    if (programsResponse.ok) {
      const programs = await programsResponse.json()
      programs.forEach((program: any) => {
        if (program.slug) {
          sitemap += `  <url>
    <loc>${baseUrl}/radio/${program.slug}</loc>
    <lastmod>${new Date(program.updatedAt || program.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`
          sitemap += `  <url>
    <loc>${baseUrl}/radio/${program.slug}/episodios</loc>
    <lastmod>${new Date(program.updatedAt || program.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`
        }
      })
    }

    // Fetch legislators
    const legislatorsResponse = await fetch(`${baseUrl}/api/legislators`, {
      cache: 'no-store'
    })
    
    if (legislatorsResponse.ok) {
      const legislators = await legislatorsResponse.json()
      legislators.forEach((legislator: any) => {
        sitemap += `  <url>
    <loc>${baseUrl}/radio/legisladores/${legislator.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`
      })
    }

    // Fetch programs (main programs)
    const mainProgramsResponse = await fetch(`${baseUrl}/api/programs`, {
      cache: 'no-store'
    })
    
    if (mainProgramsResponse.ok) {
      const mainPrograms = await mainProgramsResponse.json()
      mainPrograms.forEach((program: any) => {
        sitemap += `  <url>
    <loc>${baseUrl}/programacion/programas/${program.id}</loc>
    <lastmod>${new Date(program.updatedAt || program.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`
      })
    }

  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  sitemap += `</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
