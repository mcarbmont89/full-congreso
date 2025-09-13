
import { NextResponse } from 'next/server'
import { getAllLiveStreamsFromDB } from '@/lib/api-database'

export async function GET() {
  try {
    const liveStreams = await getAllLiveStreamsFromDB()
    console.log('API: All live streams fetched from DB:', liveStreams.length, 'items')

    return new Response(JSON.stringify(liveStreams), {
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
    console.error('Error fetching all live streams:', error)
    return NextResponse.json({ error: 'Failed to fetch live streams' }, { status: 500 })
  }
}
