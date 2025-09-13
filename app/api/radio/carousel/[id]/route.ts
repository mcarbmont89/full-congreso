
import { NextResponse, NextRequest } from 'next/server'
import { createDatabaseConnectionFromEnv } from '@/lib/database-env'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json()
    const resolvedParams = await params
    const categoryId = resolvedParams.id

    console.log('Carousel API: Updating category:', categoryId, 'with data:', data)

    const pool = createDatabaseConnectionFromEnv()

    if (!pool) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    // Update the category in the database
    const result = await pool.query(`
      UPDATE radio_categories 
      SET name = $1, description = $2, image_url = $3, updated_at = NOW()
      WHERE slug = $4 OR id::text = $4
      RETURNING id, name, slug, image_url, display_order, created_at
    `, [
      data.title,
      data.description || '',
      data.image && data.image.startsWith('/uploads/radio-categories/') 
        ? data.image 
        : '/images/placeholder.jpg',
      categoryId
    ])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const updatedCategory = {
      id: result.rows[0].slug,
      title: result.rows[0].name.toUpperCase(),
      image: result.rows[0].image_url,
      link: data.link || `/radio/${result.rows[0].slug}`
    }

    console.log('Carousel API: Category updated:', updatedCategory)
    return NextResponse.json(updatedCategory)

  } catch (error) {
    console.error('Carousel API: Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const categoryId = resolvedParams.id

    console.log('Carousel API: Deleting category:', categoryId)

    const pool = createDatabaseConnectionFromEnv()

    if (!pool) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    // Delete the category from the database
    const result = await pool.query(`
      DELETE FROM radio_categories 
      WHERE slug = $1 OR id::text = $1
      RETURNING id
    `, [categoryId])

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    console.log('Carousel API: Category deleted successfully')
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Carousel API: Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
