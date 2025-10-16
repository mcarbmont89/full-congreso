import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/database-env'
import { clearTimezoneCache } from '@/lib/timezone'

export async function GET() {
  try {
    const pool = getDB()

    let result
    try {
      result = await pool.query(`
        SELECT * FROM timezone_config 
        WHERE is_active = true 
        ORDER BY updated_at DESC 
        LIMIT 1
      `)
    } catch (dbError: any) {
      if (dbError.code === '42703') {
        result = await pool.query(`
          SELECT * FROM timezone_config 
          ORDER BY updated_at DESC 
          LIMIT 1
        `)
      } else {
        throw dbError
      }
    }

    if (result.rows.length === 0) {
      return NextResponse.json({
        timezone: 'America/Mexico_City',
        displayName: 'Ciudad de México (CST/CDT)',
        isActive: true
      })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching timezone config:', error)
    return NextResponse.json({
      timezone: 'America/Mexico_City',
      displayName: 'Ciudad de México (CST/CDT)',
      isActive: true
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const clearCache = url.searchParams.get('clearCache')

    // If this is just a cache clear request
    if (clearCache === 'true') {
      clearTimezoneCache()
      return NextResponse.json({ success: true, message: 'Cache cleared' })
    }

    const { timezone, displayName } = await request.json()

    if (!timezone || !displayName) {
      return NextResponse.json({ error: 'Timezone and display name are required' }, { status: 400 })
    }

    const pool = getDB()

    // Try to deactivate existing configurations (if is_active column exists)
    try {
      await pool.query('UPDATE timezone_config SET is_active = false')
    } catch (deactivateError: any) {
      if (deactivateError.code !== '42703') {
        throw deactivateError
      }
    }

    // Insert new configuration
    let result
    try {
      result = await pool.query(`
        INSERT INTO timezone_config (timezone, display_name, is_active, created_at, updated_at)
        VALUES ($1, $2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `, [timezone, displayName])
    } catch (insertError: any) {
      if (insertError.code === '42703') {
        result = await pool.query(`
          INSERT INTO timezone_config (timezone, display_name, created_at, updated_at)
          VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          RETURNING *
        `, [timezone, displayName])
      } else {
        throw insertError
      }
    }

    // Clear the cache so the new timezone takes effect immediately
    clearTimezoneCache()

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

    // Try to deactivate all configurations first (if is_active column exists)
    try {
      await pool.query('UPDATE timezone_config SET is_active = false')
    } catch (deactivateError: any) {
      if (deactivateError.code !== '42703') {
        throw deactivateError
      }
    }

    // Update and activate the specified configuration
    let result
    try {
      result = await pool.query(`
        UPDATE timezone_config 
        SET timezone = $1, display_name = $2, is_active = true, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
      `, [timezone, displayName, id])
    } catch (updateError: any) {
      if (updateError.code === '42703') {
        result = await pool.query(`
          UPDATE timezone_config 
          SET timezone = $1, display_name = $2, updated_at = CURRENT_TIMESTAMP
          WHERE id = $3
          RETURNING *
        `, [timezone, displayName, id])
      } else {
        throw updateError
      }
    }

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Timezone configuration not found' }, { status: 404 })
    }

    // Clear the cache so the new timezone takes effect immediately
    clearTimezoneCache()

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating timezone config:', error)
    return NextResponse.json({ error: 'Failed to update timezone config' }, { status: 500 })
  }
}