
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET() {
  try {
    const result = await query(`
      SELECT * FROM datasets 
      WHERE is_active = true
      ORDER BY display_order ASC, created_at DESC
    `)
    
    return NextResponse.json(result.rows || [])
  } catch (error) {
    console.error('Error fetching datasets:', error)
    return NextResponse.json(
      { error: 'Error fetching datasets' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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
      INSERT INTO datasets (
        title, 
        description, 
        category,
        update_frequency,
        last_updated,
        formats,
        file_url,
        file_name,
        file_size,
        file_type,
        display_order,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
      displayOrder || 0,
      isActive !== false
    ])

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating dataset:', error)
    return NextResponse.json(
      { error: 'Error creating dataset' }, 
      { status: 500 }
    )
  }
}
