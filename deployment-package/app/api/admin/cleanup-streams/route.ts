
import { NextResponse } from 'next/server'
import { createDatabaseConnectionFromEnv } from '@/lib/database-env'

export async function POST() {
  try {
    const pool = createDatabaseConnectionFromEnv()
    
    // Get all streams
    const result = await pool.query(`
      SELECT id, title, stream_url, created_at 
      FROM live_streams 
      ORDER BY created_at DESC
    `)
    
    console.log('=== CLEANUP OPERATION ===')
    console.log('All streams found:', result.rows.length)
    
    console.log('All streams found:', result.rows.length)
    
    if (result.rows.length > 0) {
      console.log('Deleting ALL streams:')
      
      // Delete ALL streams
      await pool.query(`DELETE FROM live_streams`)
      
      for (const stream of result.rows) {
        console.log(`✓ Deleted: ${stream.id} - ${stream.title} (${stream.stream_url})`)
      }
      
      console.log('All streams have been deleted')
      
      return NextResponse.json({
        success: true,
        message: `Deleted all ${result.rows.length} streams`,
        deleted: result.rows.length,
        remaining: 0,
        remainingStreams: []
      })
    } else {
      return NextResponse.json({
        success: true,
        message: 'No streams found to delete',
        totalStreams: 0
      })
    }
    
  } catch (error) {
    console.error('Error cleaning up streams:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to cleanup streams'
    }, { status: 500 })
  }
}
