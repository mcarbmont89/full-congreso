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

export async function initializeDatabase(): Promise<boolean> {
  const pool = getDB()
  if (!pool) {
    console.error('Database connection not available')
    return false
  }

  try {
    // Test the connection first
    await pool.query('SELECT 1')

    // Create defensoria_content table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS defensoria_content (
        id SERIAL PRIMARY KEY,
        section VARCHAR(50) NOT NULL,
        title TEXT,
        content TEXT,
        image_url TEXT,
        file_url TEXT,
        metadata JSONB,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_defensoria_section ON defensoria_content(section)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_defensoria_active ON defensoria_content(is_active)')

    console.log('Database connection and defensoria tables initialized successfully')
    return true
  } catch (error) {
    console.error('Database initialization failed:', error)
    return false
  }
}