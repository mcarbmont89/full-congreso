
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET() {
  try {
    const result = await query(`
      SELECT * FROM documents 
      ORDER BY created_at DESC
    `)
    
    return NextResponse.json(result.rows || [])
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Error fetching documents' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, fileName, fileUrl, fileSize, category } = body

    const result = await query(`
      INSERT INTO documents (title, description, file_name, file_url, file_size, category)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, description, fileName, fileUrl, fileSize, category])

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error saving document:', error)
    return NextResponse.json(
      { error: 'Error saving document' }, 
      { status: 500 }
    )
  }
}
