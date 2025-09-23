import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/database-env'

export async function GET(request: NextRequest) {
  try {
    const db = getDB()
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    
    let query = `
      SELECT id, section, title, content, image_url, file_url, metadata, display_order, is_active, created_at, updated_at
      FROM defensoria_content
      WHERE is_active = true
    `
    const params: any[] = []
    
    if (section) {
      query += ` AND section = $1`
      params.push(section)
    }
    
    query += ` ORDER BY display_order ASC, created_at DESC`
    
    console.log('Querying defensoria content from database...', { section })
    const result = await db.query(query, params)
    
    console.log('Defensoria content fetched from DB:', result.rows.length, 'items')
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching defensoria content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch defensoria content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDB()
    const body = await request.json()
    
    const {
      section,
      title,
      content,
      image_url,
      file_url,
      metadata,
      display_order = 0
    } = body
    
    if (!section) {
      return NextResponse.json(
        { error: 'Section is required' },
        { status: 400 }
      )
    }
    
    console.log('Creating defensoria content:', { section, title })
    
    const result = await db.query(`
      INSERT INTO defensoria_content (section, title, content, image_url, file_url, metadata, display_order, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
      RETURNING *
    `, [section, title, content, image_url, file_url, JSON.stringify(metadata), display_order])
    
    console.log('Defensoria content created:', result.rows[0])
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating defensoria content:', error)
    return NextResponse.json(
      { error: 'Failed to create defensoria content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = getDB()
    const body = await request.json()
    
    const {
      id,
      section,
      title,
      content,
      image_url,
      file_url,
      metadata,
      display_order,
      is_active
    } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }
    
    console.log('Updating defensoria content:', { id, section, title })
    
    const result = await db.query(`
      UPDATE defensoria_content 
      SET section = COALESCE($2, section),
          title = COALESCE($3, title),
          content = COALESCE($4, content),
          image_url = COALESCE($5, image_url),
          file_url = COALESCE($6, file_url),
          metadata = COALESCE($7, metadata),
          display_order = COALESCE($8, display_order),
          is_active = COALESCE($9, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id, section, title, content, image_url, file_url, JSON.stringify(metadata), display_order, is_active])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Defensoria content not found' },
        { status: 404 }
      )
    }
    
    console.log('Defensoria content updated:', result.rows[0])
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating defensoria content:', error)
    return NextResponse.json(
      { error: 'Failed to update defensoria content' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = getDB()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }
    
    console.log('Deleting defensoria content:', { id })
    
    const result = await db.query(`
      DELETE FROM defensoria_content 
      WHERE id = $1
      RETURNING *
    `, [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Defensoria content not found' },
        { status: 404 }
      )
    }
    
    console.log('Defensoria content deleted:', result.rows[0])
    
    return NextResponse.json({ message: 'Defensoria content deleted successfully' })
  } catch (error) {
    console.error('Error deleting defensoria content:', error)
    return NextResponse.json(
      { error: 'Failed to delete defensoria content' },
      { status: 500 }
    )
  }
}