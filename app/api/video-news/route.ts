import { NextRequest, NextResponse } from 'next/server'
import { getVideoNewsFromDB, createVideoNewsInDB } from '@/lib/api-database'

export async function GET() {
  try {
    const videoNews = await getVideoNewsFromDB()
    console.log('API: Video news fetched from DB:', videoNews.length, 'items')

    return new Response(JSON.stringify(videoNews), {
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
    console.error('Error fetching video news:', error)
    return NextResponse.json({ error: 'Failed to fetch video news' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Determine status based on publish date
    const publishDate = new Date(data.publishedAt)
    const now = new Date()
    const status = data.status || (publishDate <= now ? 'published' : 'scheduled')

    const videoNews = await createVideoNewsInDB({
      ...data,
      status
    })
    return NextResponse.json(videoNews)
  } catch (error) {
    console.error('Error creating video news:', error)
    return NextResponse.json({ error: 'Failed to create video news' }, { status: 500 })
  }
}