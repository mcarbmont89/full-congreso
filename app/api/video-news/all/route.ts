import { NextResponse } from 'next/server'
import { getAllVideoNewsFromDB } from '@/lib/api-database'

export async function GET() {
  try {
    const videoNews = await getAllVideoNewsFromDB()
    console.log('API: All video news fetched from DB:', videoNews.length, 'items')

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
    console.error('Error fetching all video news:', error)
    return NextResponse.json({ error: 'Failed to fetch video news' }, { status: 500 })
  }
}