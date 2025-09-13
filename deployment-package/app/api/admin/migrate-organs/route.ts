
import { NextResponse } from 'next/server'
import { createDatabaseConnectionFromEnv } from '@/lib/database-env'

export async function POST() {
  try {
    const pool = createDatabaseConnectionFromEnv()
    if (!pool) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
    }

    // Add URL column to organs table if it doesn't exist
    await pool.query(`
      ALTER TABLE organs ADD COLUMN IF NOT EXISTS url TEXT;
    `)

    // Add updated_at column if it doesn't exist  
    await pool.query(`
      ALTER TABLE organs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `)

    // Create update trigger function if it doesn't exist
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `)

    // Add trigger for updated_at if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM pg_trigger WHERE tgname = 'update_organs_updated_at'
          ) THEN
              CREATE TRIGGER update_organs_updated_at 
              BEFORE UPDATE ON organs 
              FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
          END IF;
      END $$;
    `)

    return NextResponse.json({ 
      success: true, 
      message: 'Organs table migration completed successfully' 
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      error: 'Failed to migrate organs table', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
