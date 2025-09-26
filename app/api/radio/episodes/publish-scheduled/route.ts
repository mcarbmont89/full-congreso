
import { NextResponse } from 'next/server'
import { getDB } from '@/lib/database-env'
import { formatConfiguredTime, getCurrentTimezone } from '@/lib/timezone'

export async function POST() {
  try {
    const pool = getDB()
    
    // First, check which episodes will be published (using Mexico City timezone)
    const checkResult = await pool.query(`
      SELECT id, title, publish_date, published
      FROM radio_episodes 
      WHERE published = false AND publish_date <= CURRENT_TIMESTAMP
    `)
    
    const currentTimezone = await getCurrentTimezone()
    const currentTime = await formatConfiguredTime(new Date())
    
    console.log(`Found ${checkResult.rows.length} scheduled radio episodes ready to publish (${currentTimezone} time: ${currentTime}):`, 
      checkResult.rows.map(row => ({
        id: row.id,
        title: row.title?.substring(0, 30) + '...',
        publishDate: row.publish_date,
        currentStatus: row.published
      }))
    )
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json({ 
        success: true, 
        publishedCount: 0,
        message: 'No scheduled radio episodes ready to publish'
      })
    }
    
    // Update scheduled radio episodes that should now be published (using Mexico City timezone)
    const result = await pool.query(`
      UPDATE radio_episodes 
      SET published = true, updated_at = CURRENT_TIMESTAMP
      WHERE published = false AND publish_date <= CURRENT_TIMESTAMP
      RETURNING id, title, publish_date
    `)

    console.log(`Successfully published ${result.rows.length} scheduled radio episodes`)
    
    return NextResponse.json({ 
      success: true, 
      publishedCount: result.rows.length,
      publishedItems: result.rows.map(row => ({
        id: row.id,
        title: row.title,
        publishDate: row.publish_date
      }))
    })
  } catch (error) {
    console.error('Error publishing scheduled radio episodes:', error)
    return NextResponse.json({ error: 'Failed to publish scheduled radio episodes' }, { status: 500 })
  }
}
