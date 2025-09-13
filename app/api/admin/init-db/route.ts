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
        url TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Add order_index column if it doesn't exist (for existing tables)
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'programs' AND column_name = 'order_index'
        ) THEN
          ALTER TABLE programs ADD COLUMN order_index INTEGER DEFAULT 0;
        END IF;
      END $$;
    `)

    // Add url column if it doesn't exist (for existing tables)
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'programs' AND column_name = 'url'
        ) THEN
          ALTER TABLE programs ADD COLUMN url TEXT;
        END IF;
      END $$;
    `)

    console.log('Programs table url column check completed')

    // Update existing programs with proper order_index values if they're null or 0
    await pool.query(`
      WITH ordered_programs AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 as new_order
        FROM programs 
        WHERE order_index IS NULL OR order_index = 0
      )
      UPDATE programs 
      SET order_index = ordered_programs.new_order
      FROM ordered_programs 
      WHERE programs.id = ordered_programs.id
    `)

    // Create live_streams table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS live_streams (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        thumbnail_url TEXT,
        stream_url TEXT NOT NULL,
        is_live BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create news table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        summary TEXT,
        content TEXT,
        image_url TEXT,
        category VARCHAR(100),
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Add category column if it doesn't exist (for existing tables)
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'news' AND column_name = 'category'
        ) THEN
          ALTER TABLE news ADD COLUMN category VARCHAR(100);
        END IF;
      END $$;
    `)

    // Create video_news table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS video_news (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        video_url TEXT NOT NULL,
        thumbnail_url TEXT,
        category VARCHAR(100),
        duration VARCHAR(20),
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create organs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS organs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create radio_episodes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS radio_episodes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        audio_url TEXT NOT NULL,
        duration VARCHAR(50),
        publish_date DATE,
        image_url TEXT,
        program_id INTEGER REFERENCES radio_programs(id) ON DELETE CASCADE,
        published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Verify tables were created
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    
    const createdTables = tablesResult.rows.map(row => row.table_name)
    
    await pool.end()

    return NextResponse.json({ 
      message: 'All database tables created successfully',
      tables: ['programs', 'live_streams', 'news', 'organs'],
      actualTables: createdTables
    })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database tables', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}