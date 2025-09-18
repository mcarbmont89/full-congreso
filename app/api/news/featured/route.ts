import { NextResponse } from 'next/server'
import { getFeaturedNewsFromDB } from '@/lib/api-database'

export async function GET() {
  try {
    const featuredNews = await getFeaturedNewsFromDB(3) // Get top 3 featured news
    return NextResponse.json({ 
      success: true,
      news: featuredNews 
    })
  } catch (error) {
    console.error('Error fetching featured news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured news' }, 
      { status: 500 }
    )
  }
}