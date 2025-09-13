
import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/database-env'

interface NavigationItem {
  id: string
  name: string
  href: string
  displayOrder: number
}

// Default navigation items as fallback
const defaultNavigation: NavigationItem[] = [
  { id: 'toma-tribuna', name: 'Toma Tribuna', href: '/radio/toma-tribuna', displayOrder: 0 },
  { id: 'entrevistas', name: 'Entrevistas', href: '/radio/entrevistas', displayOrder: 1 },
  { id: 'sitio-abierto', name: 'Sitio Abierto', href: '/radio/sitio-abierto', displayOrder: 2 },
  { id: 'noticias-congreso', name: 'Noticias del Congreso', href: '/radio/noticias-congreso', displayOrder: 3 }
]

export async function GET() {
  try {
    const pool = getDB()
    
    if (!pool) {
      console.warn('Database not available, returning default navigation')
      return NextResponse.json(defaultNavigation)
    }

    // First, ensure the table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS radio_navigation (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        href VARCHAR(255) NOT NULL,
        display_order INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Check if we have any navigation items
    const countResult = await pool.query('SELECT COUNT(*) as count FROM radio_navigation WHERE active = true')
    const count = parseInt(countResult.rows[0].count)

    // If no items exist, insert defaults
    if (count === 0) {
      console.log('No navigation items found, inserting defaults')
      for (const item of defaultNavigation) {
        await pool.query(`
          INSERT INTO radio_navigation (id, name, href, display_order, active)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO NOTHING
        `, [item.id, item.name, item.href, item.displayOrder, true])
      }
    }

    // Fetch current navigation items
    const result = await pool.query(`
      SELECT id, name, href, display_order as "displayOrder"
      FROM radio_navigation 
      WHERE active = true
      ORDER BY display_order ASC, name ASC
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching radio navigation:', error)
    return NextResponse.json(defaultNavigation)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const navigationItems: NavigationItem[] = await request.json()
    const pool = getDB()

    if (!pool) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    // Start a transaction
    await pool.query('BEGIN')

    try {
      // Mark all existing items as inactive
      await pool.query('UPDATE radio_navigation SET active = false')

      // Insert or update each navigation item
      for (const item of navigationItems) {
        await pool.query(`
          INSERT INTO radio_navigation (id, name, href, display_order, active, updated_at)
          VALUES ($1, $2, $3, $4, true, NOW())
          ON CONFLICT (id) 
          DO UPDATE SET 
            name = EXCLUDED.name,
            href = EXCLUDED.href,
            display_order = EXCLUDED.display_order,
            active = true,
            updated_at = NOW()
        `, [item.id, item.name, item.href, item.displayOrder])
      }

      await pool.query('COMMIT')

      // Fetch updated navigation
      const result = await pool.query(`
        SELECT id, name, href, display_order as "displayOrder"
        FROM radio_navigation 
        WHERE active = true
        ORDER BY display_order ASC
      `)

      return NextResponse.json(result.rows)
    } catch (error) {
      await pool.query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('Error updating radio navigation:', error)
    return NextResponse.json({ error: 'Failed to update navigation' }, { status: 500 })
  }
}
