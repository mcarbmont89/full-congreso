import { NextResponse } from 'next/server'
import { createLiveStreamInDB } from '@/lib/api-database'

// No mock data - this endpoint now only cleans up existing mock streams
const mockLiveStreams: any[] = []

export async function POST() {
  try {
    // If there are no streams to create, just return success
    if (mockLiveStreams.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No mock streams to create - database ready for real data',
        data: []
      })
    }

    const results = []

    for (const streamData of mockLiveStreams) {
      const result = await createLiveStreamInDB(streamData)
      results.push(result)
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully created ${results.length} live streams`,
      data: results
    })
  } catch (error) {
    console.error('Error seeding live streams:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to seed live streams',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}