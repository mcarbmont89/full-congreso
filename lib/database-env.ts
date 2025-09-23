
import { Pool } from 'pg'

let pool: Pool | null = null

export function getDB(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432'),
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    })
    
    // Set Mexico City timezone for all database connections
    pool.on('connect', async (client) => {
      try {
        await client.query("SET timezone = 'America/Mexico_City'")
        console.log('Database timezone set to Mexico City')
      } catch (error) {
        console.error('Error setting database timezone:', error)
      }
    })
  }
  return pool
}

export function createDatabaseConnectionFromEnv(): Pool {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false }
  })
  
  // Set Mexico City timezone for all database connections
  pool.on('connect', async (client) => {
    try {
      await client.query("SET timezone = 'America/Mexico_City'")
      console.log('Database timezone set to Mexico City')
    } catch (error) {
      console.error('Error setting database timezone:', error)
    }
  })
  
  return pool
}

export async function initializeDatabase() {
  const pool = createDatabaseConnectionFromEnv()
  
  try {
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
        status VARCHAR(20) DEFAULT 'published',
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

    // Add status column if it doesn't exist (for existing tables)
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'news' AND column_name = 'status'
        ) THEN
          ALTER TABLE news ADD COLUMN status VARCHAR(20) DEFAULT 'published';
        END IF;
      END $$;
    `)

    // Add is_featured column if it doesn't exist (for existing tables)
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'news' AND column_name = 'is_featured'
        ) THEN
          ALTER TABLE news ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
        END IF;
      END $$;
    `)

    // Add featured_rank column if it doesn't exist (for existing tables)
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'news' AND column_name = 'featured_rank'
        ) THEN
          ALTER TABLE news ADD COLUMN featured_rank INTEGER NULL;
        END IF;
      END $$;
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

    // Create defensoria_content table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS defensoria_content (
        id SERIAL PRIMARY KEY,
        section VARCHAR(100) NOT NULL,
        title VARCHAR(255),
        content TEXT,
        image_url VARCHAR(500),
        file_url VARCHAR(500),
        metadata JSONB,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    return {
      message: 'All tables created successfully',
      tables: ['programs', 'live_streams', 'news', 'organs', 'defensoria_content']
    }
  } finally {
    await pool.end()
  }
}
