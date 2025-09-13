
import { NextRequest, NextResponse } from 'next/server'
import { updateLiveStreamInDB, deleteLiveStreamFromDB } from '@/lib/api-database'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const updatedStream = await updateLiveStreamInDB(id, data)
    
    if (!updatedStream) {
      return NextResponse.json({ error: 'Live stream not found' }, { status: 404 })
    }

    return NextResponse.json(updatedStream)
  } catch (error) {
    console.error('Error updating live stream:', error)
    return NextResponse.json({ error: 'Failed to update live stream' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = await deleteLiveStreamFromDB(id)
    
    if (!deleted) {
      return NextResponse.json({ error: 'Live stream not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Live stream deleted successfully' })
  } catch (error) {
    console.error('Error deleting live stream:', error)
    return NextResponse.json({ error: 'Failed to delete live stream' }, { status: 500 })
  }
}
