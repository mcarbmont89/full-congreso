
import { NextResponse } from 'next/server'
import { createDatabaseConnectionFromEnv } from '@/lib/database-env'

export async function POST() {
  try {
    const pool = createDatabaseConnectionFromEnv()
    
    // Create programs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.end()

    return NextResponse.json({ 
      message: 'Programs table created successfully' 
    })
  } catch (error) {
    console.error('Error initializing programs table:', error)
    return NextResponse.json(
      { error: 'Failed to initialize programs table' },
      { status: 500 }
    )
  }
}
