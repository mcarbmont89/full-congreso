import { NextResponse, NextRequest } from 'next/server'
import { createDatabaseConnectionFromEnv } from '@/lib/database-env'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Carousel API: Updating category with ID:', params.id)
    const data = await request.json()
    console.log('Carousel API: Update data received:', data)

    // Validate required fields
    if (!data.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Try to update in database first
    try {
      const pool = createDatabaseConnectionFromEnv()

      if (pool) {
        console.log('Carousel API: Updating in database')

        // First check if the category exists
        const existingResult = await pool.query(`
          SELECT * FROM radio_categories WHERE slug = $1
        `, [params.id])

        if (existingResult.rows && existingResult.rows.length > 0) {
          // Update the existing category with the new image URL
          const imageUrl = data.image && data.image.startsWith('/uploads/') 
            ? data.image 
            : existingResult.rows[0].image_url

          const updateResult = await pool.query(`
            UPDATE radio_categories 
            SET name = $1, image_url = $2, updated_at = NOW()
            WHERE slug = $3
            RETURNING *
          `, [
            data.title,
            imageUrl,
            params.id
          ])

          if (updateResult.rows && updateResult.rows.length > 0) {
            const updatedCategory = {
              id: updateResult.rows[0].slug,
              title: updateResult.rows[0].name.toUpperCase(),
              image: updateResult.rows[0].image_url,
              link: data.link || `/radio/${updateResult.rows[0].slug}`
            }
            console.log('Carousel API: Category updated in database:', updatedCategory)
            return NextResponse.json(updatedCategory)
          }
        } else {
          console.log('Carousel API: Category not found in database, creating new one')
          // Create new category if it doesn't exist
          const createResult = await pool.query(`
            INSERT INTO radio_categories (name, slug, description, image_url, display_order, active)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
          `, [
            data.title,
            params.id,
            '',
            data.image || '/images/placeholder.jpg',
            0,
            true
          ])

          if (createResult.rows && createResult.rows.length > 0) {
            const newCategory = {
              id: createResult.rows[0].slug,
              title: createResult.rows[0].name.toUpperCase(),
              image: createResult.rows[0].image_url,
              link: data.link || `/radio/${createResult.rows[0].slug}`
            }
            console.log('Carousel API: Category created in database:', newCategory)
            return NextResponse.json(newCategory)
          }
        }
      }
    } catch (dbError) {
      console.warn('Carousel API: Database update failed:', dbError)
    }

    // Return error if database operations fail
    return NextResponse.json(
      { error: 'Failed to update category in database' },
      { status: 500 }
    )

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
  { params }: { params: { id: string } }
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