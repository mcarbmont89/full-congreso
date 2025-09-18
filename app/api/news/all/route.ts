import { NextResponse } from 'next/server'
import { getAllNewsFromDB } from '@/lib/api-database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const result = await getAllNewsFromDB(page, limit)
    console.log('API: All news fetched from DB:', result.news.length, 'items', { page, limit, total: result.total })

    // News are already sorted by publishedAt (then createdAt) DESC in database query
    const response = {
      ...result,
      news: result.news
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error('Error fetching all news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}