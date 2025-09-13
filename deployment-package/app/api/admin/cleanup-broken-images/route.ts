
import { NextResponse } from 'next/server'
import { getDatabaseConnection } from '@/lib/database'
import { existsSync } from 'fs'
import { join } from 'path'

export async function POST() {
  try {
    const pool = getDatabaseConnection()
    if (!pool) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
    }

    // Get all news items with image URLs
    const newsResult = await pool.query(`
      SELECT id, title, image_url, image_url2, image_url3, image_url4, image_url5
      FROM news 
      WHERE image_url IS NOT NULL OR image_url2 IS NOT NULL OR image_url3 IS NOT NULL OR image_url4 IS NOT NULL OR image_url5 IS NOT NULL
    `)

    const brokenImages = []
    const fixedItems = []

    for (const item of newsResult.rows) {
      const imageFields = ['image_url', 'image_url2', 'image_url3', 'image_url4', 'image_url5']
      const updates: Record<string, any> = {}
      let hasUpdates = false

      for (const field of imageFields) {
        const imageUrl = item[field]
        if (imageUrl && imageUrl.startsWith('/uploads/')) {
          const imagePath = join(process.cwd(), 'public', imageUrl)
          if (!existsSync(imagePath)) {
            brokenImages.push({ id: item.id, title: item.title, field, url: imageUrl })
            updates[field] = null
            hasUpdates = true
          }
        }
      }

      // Update the database if there are broken images
      if (hasUpdates) {
        const updateFields = Object.keys(updates).map(field => `${field} = $${Object.keys(updates).indexOf(field) + 2}`).join(', ')
        const values = [item.id, ...Object.values(updates)]
        
        await pool.query(
          `UPDATE news SET ${updateFields} WHERE id = $1`,
          values
        )
        
        fixedItems.push({ id: item.id, title: item.title, updates })
      }
    }

    // Check programs
    const programsResult = await pool.query(`
      SELECT id, title, image_url 
      FROM programs 
      WHERE image_url IS NOT NULL
    `)

    for (const item of programsResult.rows) {
      if (item.image_url && item.image_url.startsWith('/uploads/')) {
        const imagePath = join(process.cwd(), 'public', item.image_url)
        if (!existsSync(imagePath)) {
          brokenImages.push({ id: item.id, title: item.title, field: 'image_url', url: item.image_url })
          
          await pool.query(
            'UPDATE programs SET image_url = NULL WHERE id = $1',
            [item.id]
          )
          
          fixedItems.push({ id: item.id, title: item.title, updates: { image_url: null } })
        }
      }
    }

    // Check organs
    const organsResult = await pool.query(`
      SELECT id, title, image_url 
      FROM organs 
      WHERE image_url IS NOT NULL
    `)

    for (const item of organsResult.rows) {
      if (item.image_url && item.image_url.startsWith('/uploads/')) {
        const imagePath = join(process.cwd(), 'public', item.image_url)
        if (!existsSync(imagePath)) {
          brokenImages.push({ id: item.id, title: item.title, field: 'image_url', url: item.image_url })
          
          await pool.query(
            'UPDATE organs SET image_url = NULL WHERE id = $1',
            [item.id]
          )
          
          fixedItems.push({ id: item.id, title: item.title, updates: { image_url: null } })
        }
      }
    }

    return NextResponse.json({
      success: true,
      brokenImages: brokenImages.length,
      fixedItems: fixedItems.length,
      details: {
        brokenImages,
        fixedItems
      }
    })

  } catch (error) {
    console.error('Error cleaning up broken images:', error)
    return NextResponse.json({ error: 'Failed to cleanup broken images' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const pool = getDatabaseConnection()
    if (!pool) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
    }

    // Just check for broken images without fixing them
    const newsResult = await pool.query(`
      SELECT id, title, image_url, image_url2, image_url3, image_url4, image_url5
      FROM news 
      WHERE image_url IS NOT NULL OR image_url2 IS NOT NULL OR image_url3 IS NOT NULL OR image_url4 IS NOT NULL OR image_url5 IS NOT NULL
    `)

    const brokenImages = []

    for (const item of newsResult.rows) {
      const imageFields = ['image_url', 'image_url2', 'image_url3', 'image_url4', 'image_url5']
      
      for (const field of imageFields) {
        const imageUrl = item[field]
        if (imageUrl && imageUrl.startsWith('/uploads/')) {
          const imagePath = join(process.cwd(), 'public', imageUrl)
          if (!existsSync(imagePath)) {
            brokenImages.push({ id: item.id, title: item.title, field, url: imageUrl })
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      brokenImages: brokenImages.length,
      details: brokenImages
    })

  } catch (error) {
    console.error('Error checking broken images:', error)
    return NextResponse.json({ error: 'Failed to check broken images' }, { status: 500 })
  }
}
