
import { Pool } from 'pg'

export interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  ssl?: boolean
}

let pool: Pool | null = null

// Initialize database connection automatically if environment variables are available
function initializeConnection() {
  if (!pool && process.env.DATABASE_URL) {
    try {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      })
      console.log('Database connection initialized from DATABASE_URL')
    } catch (error) {
      console.error('Failed to initialize database connection:', error)
    }
  } else if (!pool && process.env.PGHOST) {
    try {
      pool = new Pool({
        host: process.env.PGHOST,
        port: parseInt(process.env.PGPORT || '5432'),
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        ssl: process.env.PGHOST.includes('localhost') ? false : { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      })
      console.log('Database connection initialized from PG environment variables')
    } catch (error) {
      console.error('Failed to initialize database connection:', error)
    }
  }
}

// Auto-initialize on module load
initializeConnection()

export function createDatabaseConnection(config: DatabaseConfig): Pool {
  if (pool) {
    pool.end()
  }
  
  pool = new Pool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.username,
    password: config.password,
    ssl: config.ssl ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })
  
  return pool
}

export function getDatabaseConnection(): Pool | null {
  if (!pool) {
    initializeConnection()
  }
  return pool
}

export { pool }

export async function testDatabaseConnection(config: DatabaseConfig): Promise<boolean> {
  try {
    const testPool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
    })
    
    const client = await testPool.connect()
    await client.query('SELECT 1')
    client.release()
    await testPool.end()
    
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

// Database schema creation functions
export async function createTables(pool: Pool): Promise<void> {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    // Live streams table
    await client.query(`
      CREATE TABLE IF NOT EXISTS live_streams (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        thumbnail_url TEXT,
        stream_url TEXT,
        is_live BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Programs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // News table
    await client.query(`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        summary TEXT,
        content TEXT,
        image_url TEXT,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Organs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Parliamentary groups table
    await client.query(`
      CREATE TABLE IF NOT EXISTS parliamentary_groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        abbreviation VARCHAR(10),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Legislators table
    await client.query(`
      CREATE TABLE IF NOT EXISTS legislators (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        parliamentary_group_id INTEGER REFERENCES parliamentary_groups(id),
        legislature VARCHAR(50),
        state VARCHAR(100),
        type VARCHAR(100),
        gender CHAR(1) CHECK (gender IN ('M', 'F')),
        status VARCHAR(20) DEFAULT 'Activo',
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Radio programs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS radio_programs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        audio_url TEXT,
        duration VARCHAR(20),
        category VARCHAR(50),
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Radio podcasts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS radio_podcasts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        description TEXT,
        duration INTEGER,
        status VARCHAR(20) DEFAULT 'active',
        type VARCHAR(50),
        publish_date DATE,
        publish_time TIME,
        audio_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Users table for authentication
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
