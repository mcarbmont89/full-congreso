
import { NextResponse } from 'next/server'
import { getDB } from '@/lib/database-env'
import { getMexicoCityNowForSQL, formatMexicoCityTime } from '@/lib/timezone'

export async function POST() {
  try {
    const pool = getDB()
    
    // First, check which items will be published (using Mexico City timezone)
    const mexicoCityNow = getMexicoCityNowForSQL()
    const checkResult = await pool.query(`
      SELECT id, title, published_at, status
      FROM news 
      WHERE status = 'scheduled' AND published_at <= $1::timestamp
    `, [mexicoCityNow])
    
    console.log(`Found ${checkResult.rows.length} scheduled items ready to publish (Mexico City time: ${formatMexicoCityTime(new Date())}):`, 
      checkResult.rows.map(row => ({
        id: row.id,
        title: row.title?.substring(0, 30) + '...',
        publishedAt: row.published_at,
        currentStatus: row.status
      }))
    )
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json({ 
        success: true, 
        publishedCount: 0,
        message: 'No scheduled items ready to publish'
      })
    }
    
    // Update scheduled news items that should now be published (using Mexico City timezone)
    const result = await pool.query(`
      UPDATE news 
      SET status = 'published' 
      WHERE status = 'scheduled' AND published_at <= $1::timestamp
      RETURNING id, title, published_at
    `, [mexicoCityNow])

    console.log(`Successfully published ${result.rows.length} scheduled news items`)
    
    return NextResponse.json({ 
      success: true, 
      publishedCount: result.rows.length,
      publishedItems: result.rows.map(row => ({
        id: row.id,
        title: row.title,
        publishedAt: row.published_at
      }))
    })
  } catch (error) {
    console.error('Error publishing scheduled news:', error)
    return NextResponse.json({ error: 'Failed to publish scheduled news' }, { status: 500 })
  }
}
