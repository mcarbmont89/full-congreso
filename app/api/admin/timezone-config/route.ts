
import { NextResponse } from 'next/server'
import { getDB } from '@/lib/database-env'

export async function GET() {
  try {
    const pool = getDB()
    
    const result = await pool.query(`
      SELECT * FROM timezone_config 
      WHERE is_active = true 
      ORDER BY updated_at DESC 
      LIMIT 1
    `)
    
    if (result.rows.length === 0) {
      // Return default timezone if none configured
      return NextResponse.json({
        timezone: 'America/Mexico_City',
        displayName: 'Ciudad de México (CST/CDT)',
        isActive: true
      })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching timezone config:', error)
    return NextResponse.json({ error: 'Failed to fetch timezone config' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { timezone, displayName } = await request.json()
    
    if (!timezone || !displayName) {
      return NextResponse.json({ error: 'Timezone and display name are required' }, { status: 400 })
    }
    
    const pool = getDB()
    
    // Deactivate existing configurations
    await pool.query('UPDATE timezone_config SET is_active = false')
    
    // Insert new configuration
    const result = await pool.query(`
      INSERT INTO timezone_config (timezone, display_name, is_active, created_at, updated_at)
      VALUES ($1, $2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `, [timezone, displayName])
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error saving timezone config:', error)
    return NextResponse.json({ error: 'Failed to save timezone config' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, timezone, displayName } = await request.json()
    
    if (!id || !timezone || !displayName) {
      return NextResponse.json({ error: 'ID, timezone and display name are required' }, { status: 400 })
    }
    
    const pool = getDB()
    
    // Deactivate all configurations first
    await pool.query('UPDATE timezone_config SET is_active = false')
    
    // Update and activate the specified configuration
    const result = await pool.query(`
      UPDATE timezone_config 
      SET timezone = $1, display_name = $2, is_active = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [timezone, displayName, id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Timezone configuration not found' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating timezone config:', error)
    return NextResponse.json({ error: 'Failed to update timezone config' }, { status: 500 })
  }
}
