
import { NextRequest, NextResponse } from 'next/server'

// This would normally come from your database
let pageContent = [
  {
    id: '1',
    page: 'transparencia',
    section: 'main',
    title: 'Transparencia - Página Principal',
    content: `Hero section content...`,
    metadata: { hero: true },
    updated_at: new Date().toISOString(),
  },
  // More pages...
]

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const id = params.id
    
    const page = pageContent.find(p => p.id === id)
    
    if (!page) {
      return NextResponse.json({ error: 'Página no encontrada' }, { status: 404 })
    }
    
    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const id = params.id
    const data = await request.json()
    
    const pageIndex = pageContent.findIndex(p => p.id === id)
    
    if (pageIndex === -1) {
      return NextResponse.json({ error: 'Página no encontrada' }, { status: 404 })
    }
    
    pageContent[pageIndex] = {
      ...pageContent[pageIndex],
      title: data.title,
      content: data.content,
      metadata: data.metadata,
      updated_at: new Date().toISOString(),
    }
    
    return NextResponse.json(pageContent[pageIndex])
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const id = params.id
    
    const pageIndex = pageContent.findIndex(p => p.id === id)
    
    if (pageIndex === -1) {
      return NextResponse.json({ error: 'Página no encontrada' }, { status: 404 })
    }
    
    pageContent.splice(pageIndex, 1)
    
    return NextResponse.json({ message: 'Página eliminada correctamente' })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
