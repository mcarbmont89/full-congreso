
import { NextRequest, NextResponse } from 'next/server'
import { updateProgramOrderInDB } from '@/lib/api-database'

export async function PUT(request: NextRequest) {
  try {
    const { programId, direction } = await request.json()
    
    if (!programId || !direction || !['up', 'down'].includes(direction)) {
      return NextResponse.json(
        { error: 'Invalid request. Need programId and direction (up/down)' },
        { status: 400 }
      )
    }

    const success = await updateProgramOrderInDB(programId, direction)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update program order' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
