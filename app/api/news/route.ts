import { NextRequest, NextResponse } from 'next/server'
import { getNewsFromDB, createNewsItemInDB } from '@/lib/api-database'
import { parseAdminTimezoneDateTime } from '@/lib/timezone'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category') || undefined
    
    const result = await getNewsFromDB(page, limit, category)
    console.log('API: News fetched from DB:', result.news.length, 'items', { page, limit, total: result.total })

    // Add detailed debug logging
    console.log('API: All news items:', result.news.map(item => ({ 
      id: item.id, 
      title: item.title?.substring(0, 30) + '...',
      imageUrl: item.imageUrl,
      hasImage: !!item.imageUrl,
      publishedAt: item.publishedAt,
      createdAt: item.createdAt 
    })))

    // Return with comprehensive no-cache headers to prevent deployment caching issues
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': new Date().toUTCString(),
        'Vary': 'Accept-Encoding',
      }
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Parse datetime-local input as admin timezone time (NO CONVERSION)
    const publishDate = await parseAdminTimezoneDateTime(data.publishedAt)
    const now = new Date()
    const status = data.status || (publishDate <= now ? 'published' : 'scheduled')

    const newsItem = await createNewsItemInDB({
      ...data,
      publishedAt: publishDate,
      status
    })
    return NextResponse.json(newsItem)
  } catch (error) {
    console.error('Error creating news item:', error)
    return NextResponse.json({ error: 'Failed to create news item' }, { status: 500 })
  }
}