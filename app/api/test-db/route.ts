
import { NextResponse } from 'next/server'
import { getLiveStreamsFromDB, getProgramsFromDB, getNewsFromDB } from '@/lib/api-database'
import type { LiveStream, Program, NewsItem } from '@/lib/api'

export async function GET() {
  try {
    // Test basic database operations
    const liveStreams: LiveStream[] = await getLiveStreamsFromDB()
    const programs: Program[] = await getProgramsFromDB()
    const news: {news: NewsItem[], total: number, totalPages: number} = await getNewsFromDB()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully',
      data: {
        liveStreamsCount: liveStreams.length,
        programsCount: programs.length,
        newsCount: news.news.length
      }
    })
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
