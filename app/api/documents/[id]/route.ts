
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params

    await query('DELETE FROM documents WHERE id = $1', [id])
    
    return NextResponse.json({ message: 'Document deleted successfully' })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Error deleting document' }, 
      { status: 500 }
    )
  }
}
