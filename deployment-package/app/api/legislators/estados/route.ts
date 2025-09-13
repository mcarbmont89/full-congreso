
import { NextResponse } from 'next/server'
import { getDatabaseConnection } from '@/lib/database'

export async function GET() {
  try {
    const pool = getDatabaseConnection()
    
    if (!pool) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
    }

    const result = await pool.query(`
      SELECT DISTINCT state 
      FROM legislators 
      WHERE state IS NOT NULL AND state != ''
      ORDER BY state
    `)

    const estados = result.rows.map(row => row.state)

    return NextResponse.json({
      estados,
      total: estados.length
    })
  } catch (error) {
    console.error('Error fetching estados:', error)
    return NextResponse.json({ error: 'Failed to fetch estados' }, { status: 500 })
  }
}
