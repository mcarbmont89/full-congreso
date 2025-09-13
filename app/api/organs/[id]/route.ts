import { NextRequest, NextResponse } from 'next/server'
import { deleteOrganFromDB, updateOrganInDB } from '@/lib/api-database'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const updatedOrgan = await updateOrganInDB(id, data)

    if (!updatedOrgan) {
      return NextResponse.json({ error: 'Organ not found' }, { status: 404 })
    }

    return NextResponse.json(updatedOrgan)
  } catch (error) {
    console.error('Error updating organ:', error)
    return NextResponse.json({ error: 'Failed to update organ' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = await deleteOrganFromDB(id)

    if (!success) {
      return NextResponse.json({ error: 'Organ not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Organ deleted successfully' })
  } catch (error) {
    console.error('Error deleting organ:', error)
    return NextResponse.json({ error: 'Failed to delete organ' }, { status: 500 })
  }
}