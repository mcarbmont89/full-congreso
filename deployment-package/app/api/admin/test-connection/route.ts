
import { NextRequest, NextResponse } from 'next/server'
import { createDatabaseConnectionFromEnv } from '@/lib/database-env'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Test connection using environment variables
    if (body.useEnvVars) {
      try {
        const pool = createDatabaseConnectionFromEnv()
        
        // Test the connection
        const client = await pool.connect()
        await client.query('SELECT 1')
        client.release()
        await pool.end()
        
        return NextResponse.json({ 
          success: true, 
          message: 'Database connection successful using environment variables' 
        })
      } catch (error) {
        console.error('Database connection test failed:', error)
        return NextResponse.json(
          { 
            success: false, 
            error: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
          },
          { status: 500 }
        )
      }
    }
    
    // Original logic for manual config (not currently used)
    return NextResponse.json(
      { success: false, error: 'Manual configuration not supported in this version' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Database connection test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to parse request' 
      },
      { status: 500 }
    )
  }
}
