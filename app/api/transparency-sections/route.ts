import { NextResponse } from 'next/server'
import { getAllTransparencySectionsFromDB } from '@/lib/api-database'

export async function GET() {
  try {
    const sections = await getAllTransparencySectionsFromDB()
    
    return new Response(JSON.stringify(sections), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error('Error fetching transparency sections:', error)
    return NextResponse.json({ error: 'Failed to fetch transparency sections' }, { status: 500 })
  }
}
