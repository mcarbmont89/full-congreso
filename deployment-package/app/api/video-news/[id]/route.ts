import { NextRequest, NextResponse } from 'next/server'
import { updateVideoNewsInDB, deleteVideoNewsFromDB } from '@/lib/api-database'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const videoNews = await updateVideoNewsInDB(id, data)

    if (!videoNews) {
      return NextResponse.json({ error: 'Video news not found' }, { status: 404 })
    }

    return NextResponse.json(videoNews)
  } catch (error) {
    console.error('Error updating video news:', error)
    return NextResponse.json({ error: 'Failed to update video news' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = await deleteVideoNewsFromDB(id)

    if (!success) {
      return NextResponse.json({ error: 'Video news not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting video news:', error)
    return NextResponse.json({ error: 'Failed to delete video news' }, { status: 500 })
  }
}