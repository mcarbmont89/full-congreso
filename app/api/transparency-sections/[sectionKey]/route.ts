import { NextRequest, NextResponse } from 'next/server'
import { getTransparencySectionByKeyFromDB, updateTransparencySectionInDB } from '@/lib/api-database'

export async function GET(
  request: NextRequest,
  { params }: { params: { sectionKey: string } }
) {
  try {
    const section = await getTransparencySectionByKeyFromDB(params.sectionKey)
    
    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }
    
    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching transparency section:', error)
    return NextResponse.json({ error: 'Failed to fetch transparency section' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { sectionKey: string } }
) {
  try {
    const data = await request.json()
    const updatedSection = await updateTransparencySectionInDB(params.sectionKey, data)
    
    if (!updatedSection) {
      return NextResponse.json({ error: 'Section not found or no changes made' }, { status: 404 })
    }
    
    return NextResponse.json(updatedSection)
  } catch (error) {
    console.error('Error updating transparency section:', error)
    return NextResponse.json({ error: 'Failed to update transparency section' }, { status: 500 })
  }
}
