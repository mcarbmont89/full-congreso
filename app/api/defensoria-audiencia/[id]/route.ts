
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params

    const result = await query(`
      SELECT * FROM defensoria_content WHERE id = $1
    `, [id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Content not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching defensoria content:', error)
    return NextResponse.json(
      { error: 'Error fetching content' }, 
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params
    const body = await request.json()
    const { section, title, content, file_url, metadata } = body

    const result = await query(`
      UPDATE defensoria_content 
      SET section = $1, title = $2, content = $3, file_url = $4, metadata = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [section, title, content, file_url || null, JSON.stringify(metadata || {}), id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Content not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating defensoria content:', error)
    return NextResponse.json(
      { error: 'Error updating content' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params

    await query('DELETE FROM defensoria_content WHERE id = $1', [id])
    
    return NextResponse.json({ message: 'Content deleted successfully' })
  } catch (error) {
    console.error('Error deleting defensoria content:', error)
    return NextResponse.json(
      { error: 'Error deleting content' }, 
      { status: 500 }
    )
  }
}
