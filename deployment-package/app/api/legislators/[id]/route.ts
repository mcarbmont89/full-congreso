
import { NextRequest, NextResponse } from 'next/server'
import { updateLegislatorInDB, deleteLegislatorFromDB } from '@/lib/api-database'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const legislator = await updateLegislatorInDB(id, data)
    
    if (!legislator) {
      return NextResponse.json(
        { error: 'Legislator not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(legislator)
  } catch (error) {
    console.error('Error updating legislator:', error)
    return NextResponse.json(
      { error: 'Failed to update legislator' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = await deleteLegislatorFromDB(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Legislator not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting legislator:', error)
    return NextResponse.json(
      { error: 'Failed to delete legislator' },
      { status: 500 }
    )
  }
}
