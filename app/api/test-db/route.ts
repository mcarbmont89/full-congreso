
import { NextResponse } from 'next/server'
import { getLiveStreamsFromDB, getProgramsFromDB, getNewsFromDB } from '@/lib/api-database'

export async function GET() {
  try {
    // Test basic database operations
    const liveStreams = await getLiveStreamsFromDB()
    const programs = await getProgramsFromDB()
    const news = await getNewsFromDB()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully',
      data: {
        liveStreamsCount: liveStreams.length,
        programsCount: programs.length,
        newsCount: news.length
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
