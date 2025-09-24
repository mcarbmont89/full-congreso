import { NextResponse, NextRequest } from 'next/server'
import { createDatabaseConnectionFromEnv } from '@/lib/database-env'

export async function GET() {
  try {
    // Connect to the real database
    const pool = createDatabaseConnectionFromEnv()

    if (pool) {
      try {
        const result = await pool.query(`
          SELECT id, name as title, slug, image_url as image, 
                 COALESCE(link_url, CONCAT('/radio/', slug)) as link, display_order, updated_at
          FROM radio_categories 
          WHERE active = true 
          ORDER BY display_order ASC, name ASC
        `)

        if (result.rows && result.rows.length > 0) {
          // Use database images directly - they should be up to date from the CMS
          const carouselData = result.rows.map(row => ({
            id: row.slug,
            title: row.title.toUpperCase(),
            image: row.image && row.image !== '/images/placeholder.jpg' 
              ? `${row.image}?t=${new Date(row.updated_at).getTime()}` // Add timestamp to prevent caching
              : '/images/placeholder.jpg',
            link: row.link,
            displayOrder: row.display_order
          }))

          console.log('Using database carousel data:', carouselData)
          return NextResponse.json(carouselData)
        }
      } catch (dbError) {
        console.error('Database query failed:', dbError)
      }
    }

    // Return empty array if no categories exist
    console.log('No carousel data found, returning empty array')
    return NextResponse.json([])
  } catch (error) {
    console.error('Error in carousel API:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Carousel API: Creating new category')
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.link) {
      return NextResponse.json(
        { error: 'Title and link are required' },
        { status: 400 }
      )
    }

    // Try to create in database
    try {
      const pool = createDatabaseConnectionFromEnv()

      if (pool) {
        console.log('Carousel API: Creating category in database')
        const slug = data.id || data.title.toLowerCase().replace(/\s+/g, '-')

        const result = await pool.query(`
          INSERT INTO radio_categories (name, slug, description, image_url, display_order, active)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `, [
          data.title,
          slug,
          data.description || '',
          data.image && data.image.startsWith('/uploads/radio-categories/') 
            ? data.image 
            : '/images/placeholder.jpg',
          data.displayOrder || 0,
          true
        ])

        if (result.rows && result.rows.length > 0) {
          const newCategory = {
            id: result.rows[0].slug,
            title: result.rows[0].name.toUpperCase(),
            image: result.rows[0].image_url,
            link: data.link
          }
          console.log('Carousel API: Category created in database:', newCategory)
          return NextResponse.json(newCategory)
        }
      }
    } catch (dbError) {
      console.warn('Carousel API: Database creation failed:', dbError)
    }

    // If database fails, return error
    return NextResponse.json(
      { error: 'Failed to create category in database' },
      { status: 500 }
    )

  } catch (error) {
    console.error('Carousel API: Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}