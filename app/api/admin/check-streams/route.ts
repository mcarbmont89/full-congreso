
import { NextResponse } from 'next/server'
import { getLiveStreamsFromDB } from '@/lib/api-database'

export async function GET() {
  try {
    const streams = await getLiveStreamsFromDB()
    
    console.log('=== DATABASE STREAMS DEBUG ===')
    console.log('Total streams found:', streams.length)
    
    streams.forEach((stream, index) => {
      console.log(`Stream ${index + 1}:`, {
        id: stream.id,
        title: stream.title,
        streamUrl: stream.streamUrl,
        createdAt: stream.createdAt
      })
    })
    
    // Separate updated vs old streams
    const updatedStreams = streams.filter(s => !s.streamUrl.includes('example.com'))
    const oldStreams = streams.filter(s => s.streamUrl.includes('example.com'))
    
    console.log('Updated streams (good):', updatedStreams.length)
    console.log('Old example streams (to delete):', oldStreams.length)
    
    return NextResponse.json({
      success: true,
      total: streams.length,
      updated: updatedStreams.length,
      oldExamples: oldStreams.length,
      updatedStreams: updatedStreams.map(stream => ({
        id: stream.id,
        title: stream.title,
        streamUrl: stream.streamUrl,
        createdAt: stream.createdAt
      })),
      oldStreams: oldStreams.map(stream => ({
        id: stream.id,
        title: stream.title,
        streamUrl: stream.streamUrl,
        createdAt: stream.createdAt
      }))
    })
  } catch (error) {
    console.error('Error checking streams:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check streams'
    }, { status: 500 })
  }
}
