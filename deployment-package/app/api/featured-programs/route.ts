
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Import database pool dynamically
    const { pool } = await import('@/lib/database')

    if (!pool) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    const result = await pool.query(`
      SELECT 
        id,
        title,
        description,
        schedule,
        image_url as "imageUrl",
        is_active as "isActive",
        display_order as "displayOrder",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM featured_programs 
      ORDER BY display_order ASC, created_at ASC
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching featured programs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured programs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Import database pool dynamically
    const { pool } = await import('@/lib/database')

    if (!pool) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    const data = await request.json()
    const { title, description, schedule, imageUrl, isActive, displayOrder } = data

    if (!title || !description || !schedule) {
      return NextResponse.json(
        { error: 'Title, description, and schedule are required' },
        { status: 400 }
      )
    }

    const result = await pool.query(`
      INSERT INTO featured_programs (title, description, schedule, image_url, is_active, display_order)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, description, schedule, imageUrl || null, isActive !== false, displayOrder || 0])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating featured program:', error)
    return NextResponse.json(
      { error: 'Failed to create featured program' },
      { status: 500 }
    )
  }
}
