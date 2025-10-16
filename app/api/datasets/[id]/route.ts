
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { 
      title, 
      description, 
      category,
      updateFrequency,
      lastUpdated,
      formats,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      displayOrder,
      isActive 
    } = body

    const result = await query(`
      UPDATE datasets 
      SET 
        title = $1,
        description = $2,
        category = $3,
        update_frequency = $4,
        last_updated = $5,
        formats = $6,
        file_url = $7,
        file_name = $8,
        file_size = $9,
        file_type = $10,
        display_order = $11,
        is_active = $12,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING *
    `, [
      title, 
      description, 
      category,
      updateFrequency,
      lastUpdated,
      formats,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      displayOrder,
      isActive,
      id
    ])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating dataset:', error)
    return NextResponse.json(
      { error: 'Error updating dataset' }, 
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

    await query('DELETE FROM datasets WHERE id = $1', [id])
    
    return NextResponse.json({ message: 'Dataset deleted successfully' })
  } catch (error) {
    console.error('Error deleting dataset:', error)
    return NextResponse.json(
      { error: 'Error deleting dataset' }, 
      { status: 500 }
    )
  }
}
