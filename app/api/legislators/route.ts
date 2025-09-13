
import { NextRequest, NextResponse } from 'next/server'
import { getLegislatorsFromDB, createLegislatorInDB } from '@/lib/api-database'

export async function GET() {
  try {
    const legislators = await getLegislatorsFromDB()
    return NextResponse.json(legislators)
  } catch (error) {
    console.error('Error fetching legislators:', error)
    
    // Fallback to mock data
    const { getLegislators } = await import('@/lib/api')
    const mockLegislators = await getLegislators()
    return NextResponse.json(mockLegislators)
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const legislator = await createLegislatorInDB(data)
    return NextResponse.json(legislator, { status: 201 })
  } catch (error) {
    console.error('Error creating legislator:', error)
    return NextResponse.json(
      { error: 'Failed to create legislator' },
      { status: 500 }
    )
  }
}
