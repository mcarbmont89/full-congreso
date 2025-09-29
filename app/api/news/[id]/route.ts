import { NextRequest, NextResponse } from 'next/server'
import { updateNewsItemInDB, deleteNewsItemFromDB } from '@/lib/api-database'
import { parseAdminTimezoneDateTime } from '@/lib/timezone'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    
    // Parse datetime-local input as admin timezone time (NO CONVERSION) if publishedAt is provided
    if (data.publishedAt) {
      data.publishedAt = await parseAdminTimezoneDateTime(data.publishedAt)
    }
    
    const newsItem = await updateNewsItemInDB(id, data)

    if (!newsItem) {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 })
    }

    return NextResponse.json(newsItem)
  } catch (error) {
    console.error('Error updating news item:', error)
    return NextResponse.json({ error: 'Failed to update news item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = await deleteNewsItemFromDB(id)

    if (!success) {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting news item:', error)
    return NextResponse.json({ error: 'Failed to delete news item' }, { status: 500 })
  }
}