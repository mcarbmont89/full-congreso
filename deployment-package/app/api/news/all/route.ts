import { NextResponse } from 'next/server'
import { getAllNewsFromDB } from '@/lib/api-database'

export async function GET() {
  try {
    const news = await getAllNewsFromDB()
    console.log('API: All news fetched from DB:', news.length, 'items')

    // Sort by creation date (newest first)
    const sortedNews = news.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return new Response(JSON.stringify(sortedNews), {
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