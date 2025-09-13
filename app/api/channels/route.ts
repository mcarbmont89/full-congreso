
import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '@/lib/database'

interface ChannelConfig {
  id: string
  name: string
  number: string
  logo: string
  backgroundColor: string
  textColor: string
  transmisionesLink: string
  isActive: boolean
  order: number
  createdAt?: Date
  updatedAt?: Date
}

// Create table if it doesn't exist
async function ensureChannelTable() {
  const pool = getDatabaseConnection()
  if (!pool) {
    throw new Error('Database connection not available')
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS channel_config (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        number VARCHAR(10) NOT NULL,
        logo TEXT,
        background_color VARCHAR(7) NOT NULL,
        text_color VARCHAR(7) DEFAULT '#ffffff',
        transmisiones_link TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        order_position INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Insert default channels if table is empty
    const result = await pool.query('SELECT COUNT(*) FROM channel_config')
    const count = parseInt(result.rows[0].count)

    if (count === 0) {
      await pool.query(`
        INSERT INTO channel_config (name, number, logo, background_color, text_color, transmisiones_link, is_active, order_position)
        VALUES 
        ('C+', '45.1', '/images/channel-c-logo.png', '#4a4a4a', '#ffffff', '/transmisiones?stream=1', true, 1),
        ('S+', '45.2', '/images/channel-g-logo.png', '#b91c1c', '#ffffff', '/transmisiones?stream=3', true, 2),
        ('D+', '45.3', '/images/channel-d-logo.png', '#15803d', '#ffffff', '/transmisiones?stream=2', true, 3)
      `)
    }
  } catch (error) {
    console.error('Error ensuring channel table:', error)
  }
}

export async function GET() {
  const pool = getDatabaseConnection()
  if (!pool) {
    return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
  }

  try {
    await ensureChannelTable()
    
    const result = await pool.query(`
      SELECT 
        id,
        name,
        number,
        logo,
        background_color as "backgroundColor",
        text_color as "textColor",
        transmisiones_link as "transmisionesLink",
        is_active as "isActive",
        order_position as "order",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM channel_config 
      ORDER BY order_position ASC, id ASC
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching channels:', error)
    return NextResponse.json({ error: 'Error al obtener los canales' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const pool = getDatabaseConnection()
  if (!pool) {
    return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { name, number, logo, backgroundColor, textColor, transmisionesLink, isActive, order } = body

    if (!name || !number || !backgroundColor || !transmisionesLink) {
      return NextResponse.json(
        { error: 'Campos requeridos: name, number, backgroundColor, transmisionesLink' },
        { status: 400 }
      )
    }

    await ensureChannelTable()

    const result = await pool.query(`
      INSERT INTO channel_config 
      (name, number, logo, background_color, text_color, transmisiones_link, is_active, order_position)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING 
        id,
        name,
        number,
        logo,
        background_color as "backgroundColor",
        text_color as "textColor",
        transmisiones_link as "transmisionesLink",
        is_active as "isActive",
        order_position as "order"
    `, [name, number, logo || '', backgroundColor, textColor || '#ffffff', transmisionesLink, isActive ?? true, order || 0])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating channel:', error)
    return NextResponse.json({ error: 'Error al crear el canal' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const pool = getDatabaseConnection()
  if (!pool) {
    return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID de canal requerido' }, { status: 400 })
    }

    const body = await request.json()
    const { name, number, logo, backgroundColor, textColor, transmisionesLink, isActive, order } = body

    if (!name || !number || !backgroundColor || !transmisionesLink) {
      return NextResponse.json(
        { error: 'Campos requeridos: name, number, backgroundColor, transmisionesLink' },
        { status: 400 }
      )
    }

    const result = await pool.query(`
      UPDATE channel_config 
      SET 
        name = $1,
        number = $2,
        logo = $3,
        background_color = $4,
        text_color = $5,
        transmisiones_link = $6,
        is_active = $7,
        order_position = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING 
        id,
        name,
        number,
        logo,
        background_color as "backgroundColor",
        text_color as "textColor",
        transmisiones_link as "transmisionesLink",
        is_active as "isActive",
        order_position as "order"
    `, [name, number, logo || '', backgroundColor, textColor || '#ffffff', transmisionesLink, isActive ?? true, order || 0, id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Canal no encontrado' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating channel:', error)
    return NextResponse.json({ error: 'Error al actualizar el canal' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const pool = getDatabaseConnection()
  if (!pool) {
    return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID de canal requerido' }, { status: 400 })
    }

    const result = await pool.query('DELETE FROM channel_config WHERE id = $1', [id])
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Canal no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Canal eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting channel:', error)
    return NextResponse.json({ error: 'Error al eliminar el canal' }, { status: 500 })
  }
}
