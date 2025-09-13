
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Import database pool dynamically
    const { pool } = await import('@/lib/database')

    if (!pool) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    const { id } = await params
    const data = await request.json()
    const { title, description, schedule, imageUrl, isActive, displayOrder } = data

    if (!title || !description || !schedule) {
      return NextResponse.json(
        { error: 'Title, description, and schedule are required' },
        { status: 400 }
      )
    }

    const result = await pool.query(`
      UPDATE featured_programs 
      SET title = $1, description = $2, schedule = $3, image_url = $4, 
          is_active = $5, display_order = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `, [title, description, schedule, imageUrl || null, isActive !== false, displayOrder || 0, id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Featured program not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating featured program:', error)
    return NextResponse.json(
      { error: 'Failed to update featured program' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Import database pool dynamically
    const { pool } = await import('@/lib/database')

    if (!pool) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    const { id } = await params
    const result = await pool.query(`
      DELETE FROM featured_programs WHERE id = $1
      RETURNING id
    `, [id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Featured program not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Featured program deleted successfully' })
  } catch (error) {
    console.error('Error deleting featured program:', error)
    return NextResponse.json(
      { error: 'Failed to delete featured program' },
      { status: 500 }
    )
  }
}
