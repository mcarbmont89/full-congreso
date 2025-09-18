import { Pool } from 'pg'
import { createDatabaseConnectionFromEnv } from './database-env'
import type { LiveStream, Program, NewsItem, Organ, ParliamentaryGroup, Legislator, RadioProgram } from './api'

let pool: Pool | null = null

// Helper function to get database connection
function getDB(): Pool {
  if (!pool) {
    try {
      pool = createDatabaseConnectionFromEnv()
      if (!pool) {
        throw new Error('Failed to create database connection from environment')
      }
    } catch (error) {
      console.error('Database connection error:', error)
      throw new Error('Database connection failed. Please check your DATABASE_URL environment variable.')
    }
  }
  return pool
}

// Live Streams API functions
// Parliamentary Groups functions
export async function getParliamentaryGroupsFromDB(): Promise<ParliamentaryGroup[]> {
  const pool = getDB()
  if (!pool) {
    throw new Error('Database connection not available')
  }

  try {
    const result = await pool.query(`
      SELECT 
        pg.id,
        pg.name,
        pg.abbreviation,
        pg.image_url as "imageUrl",
        pg.color_hex as "colorHex",
        pg.description,
        pg.created_at as "createdAt",
        COUNT(l.id) as "legislatorCount"
      FROM parliamentary_groups pg
      LEFT JOIN legislators l ON pg.id = l.parliamentary_group_id
      GROUP BY pg.id, pg.name, pg.abbreviation, pg.image_url, pg.color_hex, pg.description, pg.created_at
      ORDER BY pg.name
    `)

    return result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      abbreviation: row.abbreviation,
      imageUrl: row.imageUrl || '/placeholder.svg?height=100&width=100&text=' + row.abbreviation,
      colorHex: row.colorHex,
      description: row.description,
      legislatorCount: parseInt(row.legislatorCount) || 0,
      createdAt: new Date(row.createdAt)
    }))
  } catch (error) {
    console.error('Error fetching parliamentary groups from database:', error)
    throw error
  }
}

export async function createParliamentaryGroupInDB(data: Omit<ParliamentaryGroup, "id" | "createdAt">): Promise<ParliamentaryGroup> {
  const pool = getDB()
  if (!pool) {
    throw new Error('Database connection not available')
  }

  try {
    const result = await pool.query(`
      INSERT INTO parliamentary_groups (name, abbreviation, image_url, color_hex, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        id,
        name,
        abbreviation,
        image_url as "imageUrl",
        color_hex as "colorHex", 
        description,
        created_at as "createdAt"
    `, [data.name, data.abbreviation, data.imageUrl, data.colorHex || null, data.description || null])

    const row = result.rows[0]
    return {
      id: row.id.toString(),
      name: row.name,
      abbreviation: row.abbreviation,
      imageUrl: row.imageUrl,
      colorHex: row.colorHex,
      description: row.description,
      createdAt: new Date(row.createdAt)
    }
  } catch (error) {
    console.error('Error creating parliamentary group:', error)
    throw error
  }
}

// Live streams management
export async function getLiveStreamsFromDB(): Promise<LiveStream[]> {
  try {
    const pool = getDB()

    if (!pool) {
      console.error('Database connection not available')
      return []
    }

    const result = await pool.query(`
      SELECT id, title, thumbnail_url as "thumbnailUrl", stream_url as "streamUrl", 
             channel, is_live as "isLive", created_at as "createdAt"
      FROM live_streams 
      ORDER BY created_at DESC
    `)

    return result.rows.map(row => ({
      ...row,
      id: row.id.toString(),
      createdAt: new Date(row.createdAt)
    }))
  } catch (error) {
    console.error('Error fetching live streams from database:', error)
    return []
  }
}

export async function createLiveStreamInDB(data: {
  title: string
  thumbnailUrl: string
  streamUrl: string
  channel: string
  isLive: boolean
  status?: string
}): Promise<LiveStream> {
  const pool = getDB()
  const result = await pool.query(
      `INSERT INTO live_streams (title, thumbnail_url, stream_url, channel, is_live, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, title, thumbnail_url as "thumbnailUrl", stream_url as "streamUrl", 
                 channel, is_live as "isLive", status, created_at as "createdAt"`,
      [data.title, data.thumbnailUrl, data.streamUrl, data.channel, data.isLive, data.status || 'offline']
    )

  const row = result.rows[0]
  return {
    ...row,
    id: row.id.toString(),
    createdAt: new Date(row.createdAt)
  }
}

// Organs database functions
export async function getOrgans(): Promise<Organ[]> {
  const pool = getDB()

  // Check if url column exists
  const columnCheck = await pool.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_name = 'organs' AND column_name = 'url'
  `)

  let query;
  if (columnCheck.rows.length > 0) {
    // URL column exists
    query = `
      SELECT id, title, description, image_url as "imageUrl", url,
             created_at as "createdAt", updated_at as "updatedAt"
      FROM organs 
      ORDER BY created_at DESC
    `;
  } else {
    // URL column doesn't exist
    query = `
      SELECT id, title, description, image_url as "imageUrl",
             created_at as "createdAt", updated_at as "updatedAt"
      FROM organs 
      ORDER BY created_at DESC
    `;
  }

  const result = await pool.query(query)

  return result.rows.map(row => ({
    ...row,
    id: row.id.toString(),
    url: row.url || null,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt)
  }))
}

export async function createOrganInDB(data: Omit<Organ, "id" | "createdAt" | "updatedAt">): Promise<Organ> {
  const pool = getDB()

  // Check if url column exists
  const columnCheck = await pool.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_name = 'organs' AND column_name = 'url'
  `)

  let result;
  if (columnCheck.rows.length > 0) {
    // URL column exists
    result = await pool.query(`
      INSERT INTO organs (title, description, image_url, url)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, description, image_url as "imageUrl", url,
                created_at as "createdAt", updated_at as "updatedAt"
    `, [data.title, data.description, data.imageUrl, data.url || null])
  } else {
    // URL column doesn't exist
    result = await pool.query(`
      INSERT INTO organs (title, description, image_url)
      VALUES ($1, $2, $3)
      RETURNING id, title, description, image_url as "imageUrl",
                created_at as "createdAt", updated_at as "updatedAt"
    `, [data.title, data.description, data.imageUrl])
  }

  const row = result.rows[0]
  return {
    ...row,
    id: row.id.toString(),
    url: row.url || null,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt)
  }
}

export async function updateOrganInDB(
  id: string,
  data: Partial<Omit<Organ, "id" | "createdAt" | "updatedAt">>
): Promise<Organ | null> {
  const pool = getDB()
  const fields = []
  const values = []
  let paramCount = 1

  if (data.title !== undefined) {
    fields.push(`title = $${paramCount}`)
    values.push(data.title)
    paramCount++
  }
  if (data.description !== undefined) {
    fields.push(`description = $${paramCount}`)
    values.push(data.description)
    paramCount++
  }
  if (data.imageUrl !== undefined) {
    fields.push(`image_url = $${paramCount}`)
    values.push(data.imageUrl)
    paramCount++
  }
  if (data.url !== undefined) {
    fields.push(`url = $${paramCount}`)
    values.push(data.url)
    paramCount++
  }

  if (fields.length === 0) return null

  fields.push(`updated_at = CURRENT_TIMESTAMP`)
  values.push(id)

  const result = await pool.query(`
    UPDATE organs 
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, title, description, image_url as "imageUrl", url,
              created_at as "createdAt", updated_at as "updatedAt"
  `, values)

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  return {
    ...row,
    id: row.id.toString(),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt)
  }
}

export async function deleteOrganInDB(id: string): Promise<boolean> {
  const pool = getDB()
  const result = await pool.query('DELETE FROM organs WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}

// Export alias for consistency with the route import
export const deleteOrganFromDB = deleteOrganInDB

export async function updateLiveStreamInDB(
  id: string,
  data: Partial<Omit<LiveStream, "id" | "createdAt">>
): Promise<LiveStream | null> {
  const pool = getDB()

  const fields = []
  const values = []
  let paramIndex = 1

  if (data.title !== undefined) {
    fields.push(`title = $${paramIndex++}`)
    values.push(data.title)
  }
  if (data.thumbnailUrl !== undefined) {
    fields.push(`thumbnail_url = $${paramIndex++}`)
    values.push(data.thumbnailUrl)
  }
  if (data.streamUrl !== undefined) {
    fields.push(`stream_url = $${paramIndex++}`)
    values.push(data.streamUrl)
  }
  if (data.channel !== undefined) {
    fields.push(`channel = $${paramIndex++}`)
    values.push(data.channel)
  }
  if (data.status !== undefined) {
    fields.push(`status = $${paramIndex++}`)
    values.push(data.status)

    // Automatically set is_live based on status
    if (data.status === 'live' || data.status === 'signal_open') {
      fields.push(`is_live = $${paramIndex++}`)
      values.push(true)
    } else if (data.status === 'recess' || data.status === 'offline') {
      fields.push(`is_live = $${paramIndex++}`)
      values.push(false)
    }
  }
  if (data.isLive !== undefined && data.status === undefined) {
    fields.push(`is_live = $${paramIndex++}`)
    values.push(data.isLive)
  }

  if (fields.length === 0) return null

  values.push(id)

  const result = await pool.query(`
    UPDATE live_streams 
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, title, thumbnail_url as "thumbnailUrl", stream_url as "streamUrl", 
              channel, is_live as "isLive", status, created_at as "createdAt"
  `, values)

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  return {
    ...row,
    id: row.id.toString(),
    createdAt: new Date(row.createdAt)
  }
}

export async function deleteLiveStreamFromDB(id: string): Promise<boolean> {
  const pool = getDB()
  const result = await pool.query('DELETE FROM live_streams WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}

export async function getAllLiveStreamsFromDB(): Promise<LiveStream[]> {
  try {
    const pool = getDB()
    console.log('Querying all live streams from database...')

    const result = await pool.query(`
      SELECT id, title, thumbnail_url as "thumbnailUrl", stream_url as "streamUrl", 
             channel, is_live as "isLive", created_at as "createdAt"
      FROM live_streams 
      ORDER BY created_at DESC, id DESC
    `)

    return result.rows.map(row => ({
      ...row,
      id: row.id.toString(),
      createdAt: new Date(row.createdAt)
    }))
  } catch (error) {
    console.error('Error fetching all live streams from database:', error)
    return []
  }
}

// Programs API functions
export async function getProgramsFromDB(): Promise<Program[]> {
  try {
    const pool = getDB()
    if (!pool) {
      console.log('Database not connected, using mock data')
      const { getPrograms } = await import('./api')
      return await getPrograms()
    }

    const result = await pool.query(`
      SELECT id, title, description, image_url as "imageUrl", url,
             order_index as "orderIndex", created_at as "createdAt"
      FROM programs 
      ORDER BY order_index ASC, created_at DESC
    `)

    return result.rows.map(row => ({
      ...row,
      id: row.id.toString(),
      orderIndex: row.orderIndex || 0,
      createdAt: new Date(row.createdAt)
    }))
  } catch (error) {
    console.error('Error fetching programs from database:', error)
    console.log('Falling back to mock data')
    const { getPrograms } = await import('./api')
    return await getPrograms()
  }
}

export async function createProgramInDB(data: Omit<Program, "id" | "createdAt">): Promise<Program> {
  const pool = getDB()

  // Get the current max order_index
  const maxOrderResult = await pool.query('SELECT COALESCE(MAX(order_index), -1) as max_order FROM programs')
  const nextOrder = maxOrderResult.rows[0].max_order + 1

  const result = await pool.query(`
    INSERT INTO programs (title, description, image_url, url, order_index)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, title, description, image_url as "imageUrl", url,
              order_index as "orderIndex", created_at as "createdAt"
  `, [data.title, data.description, data.imageUrl, data.url || null, nextOrder])

  const row = result.rows[0]
  return {
    ...row,
    id: row.id.toString(),
    orderIndex: row.orderIndex || 0,
    createdAt: new Date(row.createdAt)
  }
}

export async function updateProgramInDB(
  id: string,
  data: Partial<Omit<Program, "id" | "createdAt">>
): Promise<Program | null> {
  const pool = getDB()

  const fields = []
  const values = []
  let paramIndex = 1

  if (data.title !== undefined) {
    fields.push(`title = $${paramIndex++}`)
    values.push(data.title)
  }
  if (data.description !== undefined) {
    fields.push(`description = $${paramIndex++}`)
    values.push(data.description)
  }
  if (data.imageUrl !== undefined) {
    fields.push(`image_url = $${paramIndex++}`)
    values.push(data.imageUrl)
  }
  if (data.url !== undefined) {
    fields.push(`url = $${paramIndex++}`)
    values.push(data.url)
  }

  if (fields.length === 0) return null

  values.push(id)

  const result = await pool.query(`
    UPDATE programs 
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, title, description, image_url as "imageUrl", url, created_at as "createdAt"
  `, values)

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  return {
    ...row,
    id: row.id.toString(),
    createdAt: new Date(row.createdAt)
  }
}

export async function deleteProgramFromDB(id: string): Promise<boolean> {
  const pool = getDB()
  const result = await pool.query('DELETE FROM programs WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}

export async function updateProgramOrderInDB(id: string, direction: 'up' | 'down'): Promise<boolean> {
  const pool = getDB()

  try {
    await pool.query('BEGIN')

    // Get current program's order
    const currentResult = await pool.query(
      'SELECT order_index FROM programs WHERE id = $1',
      [id]
    )

    if (currentResult.rows.length === 0) {
      await pool.query('ROLLBACK')
      return false
    }

    const currentOrder = currentResult.rows[0].order_index

    if (direction === 'up') {
      // Find the program with the next lower order_index
      const targetResult = await pool.query(`
        SELECT id, order_index FROM programs 
        WHERE order_index < $1 
        ORDER BY order_index DESC 
        LIMIT 1
      `, [currentOrder])

      if (targetResult.rows.length === 0) {
        await pool.query('ROLLBACK')
        return false // Already at the top
      }

      const targetProgram = targetResult.rows[0]

      // Swap the order_index values
      await pool.query('UPDATE programs SET order_index = $1 WHERE id = $2', [targetProgram.order_index, id])
      await pool.query('UPDATE programs SET order_index = $1 WHERE id = $2', [currentOrder, targetProgram.id])

    } else if (direction === 'down') {
      // Find the program with the next higher order_index
      const targetResult = await pool.query(`
        SELECT id, order_index FROM programs 
        WHERE order_index > $1 
        ORDER BY order_index ASC 
        LIMIT 1
      `, [currentOrder])

      if (targetResult.rows.length === 0) {
        await pool.query('ROLLBACK')
        return false // Already at the bottom
      }

      const targetProgram = targetResult.rows[0]

      // Swap the order_index values
      await pool.query('UPDATE programs SET order_index = $1 WHERE id = $2', [targetProgram.order_index, id])
      await pool.query('UPDATE programs SET order_index = $1 WHERE id = $2', [currentOrder, targetProgram.id])
    }

    await pool.query('COMMIT')
    return true

  } catch (error) {
    await pool.query('ROLLBACK')
    console.error('Error updating program order:', error)
    return false
  }
}

// News API functions
export async function getNewsFromDB(page: number = 1, limit: number = 20, category?: string): Promise<{news: NewsItem[], total: number, totalPages: number}> {
  try {
    const pool = getDB()
    console.log('Querying news from database with pagination...', { page, limit, category })

    // Build WHERE clauses
    let whereClause = "(COALESCE(status, 'published') = 'published' OR (COALESCE(status, 'published') = 'scheduled' AND published_at <= NOW()))"
    const params = []
    
    if (category) {
      whereClause += " AND category = $1"
      params.push(category)
    }

    // First get the total count
    const countResult = await pool.query(`
      SELECT COUNT(*) as total
      FROM news
      WHERE ${whereClause}
    `, params)
    
    const total = parseInt(countResult.rows[0].total)
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit

    // Then get the paginated results
    const paginatedParams = [...params, limit, offset]
    const limitOffset = category ? '$2 OFFSET $3' : '$1 OFFSET $2'
    
    const result = await pool.query(`
      SELECT id, title, summary, content, image_url, 
             category, published_at as "publishedAt", created_at as "createdAt", 
             COALESCE(status, 'published') as status,
             is_featured as "isFeatured", featured_rank as "featuredRank"
      FROM news
      WHERE ${whereClause}
      ORDER BY COALESCE(published_at, created_at) DESC, id DESC
      LIMIT ${limitOffset}
    `, paginatedParams)

    console.log('Raw database result:', result.rows.length, 'rows', { total, totalPages, page })

    if (result.rows.length > 0) {
      console.log('Sample news item from DB:', {
        id: result.rows[0].id,
        title: result.rows[0].title?.substring(0, 50) + '...',
        imageUrl: result.rows[0].image_url,
        hasImage: !!result.rows[0].image_url
      })
    }

    const news = result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      summary: row.summary,
      content: row.content,
      imageUrl: row.image_url,
      category: row.category,
      publishedAt: new Date(row.publishedAt),
      createdAt: new Date(row.createdAt),
      status: row.status,
      isFeatured: row.isFeatured ?? false,
      featuredRank: row.featuredRank ?? null
    }))

    return { news, total, totalPages }
  } catch (error) {
    console.error('Error fetching news from database:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    return { news: [], total: 0, totalPages: 0 } // Return empty result instead of throwing
  }
}

export async function getAllNewsFromDB(page: number = 1, limit: number = 20): Promise<{news: NewsItem[], total: number, totalPages: number}> {
  try {
    const pool = getDB()
    console.log('Querying all news from database with pagination...', { page, limit })

    // First get the total count
    const countResult = await pool.query(`
      SELECT COUNT(*) as total
      FROM news
    `)
    
    const total = parseInt(countResult.rows[0].total)
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit

    // Then get the paginated results
    const result = await pool.query(`
      SELECT id, title, summary, content, image_url as "imageUrl", 
             category, published_at as "publishedAt", created_at as "createdAt", 
             COALESCE(status, 'published') as status,
             is_featured as "isFeatured", featured_rank as "featuredRank"
      FROM news
      ORDER BY COALESCE(published_at, created_at) DESC, id DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset])

    const news = result.rows.map(row => ({
      ...row,
      id: row.id.toString(),
      publishedAt: new Date(row.publishedAt),
      createdAt: new Date(row.createdAt),
      isFeatured: row.isFeatured ?? false,
      featuredRank: row.featuredRank ?? null
    }))

    return { news, total, totalPages }
  } catch (error) {
    console.error('Error fetching all news from database:', error)
    return { news: [], total: 0, totalPages: 0 }
  }
}

export async function createNewsItemInDB(data: Omit<NewsItem, 'id' | 'createdAt'> & { status?: string; isFeatured?: boolean; featuredRank?: number | null }): Promise<NewsItem> {
  try {
    const pool = getDB()

    // Insert with all new fields including featured fields
    const result = await pool.query(`
      INSERT INTO news (title, summary, content, image_url, category, published_at, status, is_featured, featured_rank)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, title, summary, content, image_url as "imageUrl", 
                category, published_at as "publishedAt", created_at as "createdAt", 
                COALESCE(status, 'published') as status,
                is_featured as "isFeatured", featured_rank as "featuredRank"
    `, [
      data.title, 
      data.summary, 
      data.content, 
      data.imageUrl, 
      data.category, 
      data.publishedAt, 
      data.status || 'draft',
      data.isFeatured || false,
      data.featuredRank || null
    ])

    const row = result.rows[0]
    return {
      ...row,
      id: row.id.toString(),
      publishedAt: new Date(row.publishedAt),
      createdAt: new Date(row.createdAt),
      status: row.status || 'published',
      isFeatured: row.isFeatured ?? false,
      featuredRank: row.featuredRank ?? null
    }
  } catch (error) {
    console.error('Error creating news item:', error)
    throw error
  }
}

export async function updateNewsItemInDB(
  id: string,
  data: Partial<Omit<NewsItem, "id" | "createdAt"> & { isFeatured?: boolean; featuredRank?: number | null }>
): Promise<NewsItem | null> {
  const pool = getDB()

  const fields = []
  const values = []
  let paramIndex = 1

  if (data.title !== undefined) {
    fields.push(`title = $${paramIndex++}`)
    values.push(data.title)
  }
  if (data.summary !== undefined) {
    fields.push(`summary = $${paramIndex++}`)
    values.push(data.summary)
  }
  if (data.content !== undefined) {
    fields.push(`content = $${paramIndex++}`)
    values.push(data.content)
  }
  if (data.imageUrl !== undefined) {
    fields.push(`image_url = $${paramIndex++}`)
    values.push(data.imageUrl)
  }
  if (data.category !== undefined) {
    fields.push(`category = $${paramIndex++}`)
    values.push(data.category)
  }
  if (data.publishedAt !== undefined) {
    fields.push(`published_at = $${paramIndex++}`)
    values.push(data.publishedAt)
  }
  if (data.isFeatured !== undefined) {
    fields.push(`is_featured = $${paramIndex++}`)
    values.push(data.isFeatured)
  }
  if (data.featuredRank !== undefined) {
    fields.push(`featured_rank = $${paramIndex++}`)
    values.push(data.featuredRank)
  }

  if (fields.length === 0) return null

  values.push(id)

  const result = await pool.query(`
    UPDATE news 
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, title, summary, content, image_url as "imageUrl", 
              category, published_at as "publishedAt", created_at as "createdAt",
              COALESCE(status, 'published') as status,
              is_featured as "isFeatured", featured_rank as "featuredRank"
  `, values)

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  return {
    ...row,
    id: row.id.toString(),
    publishedAt: new Date(row.publishedAt),
    createdAt: new Date(row.createdAt),
    status: row.status ?? 'published',
    isFeatured: row.isFeatured ?? false,
    featuredRank: row.featuredRank ?? null
  }
}

export async function getFeaturedNewsFromDB(limit: number = 1): Promise<NewsItem[]> {
  try {
    const pool = getDB()
    console.log('Querying featured news from database...', { limit })

    const result = await pool.query(`
      SELECT id, title, summary, content, image_url as "imageUrl", 
             category, published_at as "publishedAt", created_at as "createdAt", 
             COALESCE(status, 'published') as status,
             is_featured as "isFeatured", featured_rank as "featuredRank"
      FROM news
      WHERE is_featured = true 
        AND (COALESCE(status, 'published') = 'published' OR (COALESCE(status, 'published') = 'scheduled' AND published_at <= NOW()))
        AND image_url IS NOT NULL
      ORDER BY (featured_rank IS NULL), featured_rank ASC, COALESCE(published_at, created_at) DESC, id DESC
      LIMIT $1
    `, [limit])

    const news = result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      summary: row.summary,
      content: row.content,
      imageUrl: row.imageUrl,
      category: row.category,
      publishedAt: new Date(row.publishedAt),
      createdAt: new Date(row.createdAt),
      status: row.status,
      isFeatured: row.isFeatured ?? false,
      featuredRank: row.featuredRank ?? null
    }))

    console.log('Featured news fetched from DB:', news.length, 'items')
    return news
  } catch (error) {
    console.error('Error fetching featured news from database:', error)
    return []
  }
}

export async function deleteNewsItemFromDB(id: string): Promise<boolean> {
  const pool = getDB()
  const result = await pool.query('DELETE FROM news WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}

// Add similar functions for other entities (Organs, Parliamentary Groups, Legislators, Radio Programs, etc.)
// Following the same pattern...

export async function getOrgansFromDB(): Promise<Organ[]> {
  const pool = getDB()
  const result = await pool.query(`
    SELECT id, title, description, image_url as "imageUrl", url, created_at as "createdAt"
    FROM organs 
    ORDER BY created_at DESC
  `)

  return result.rows.map(row => ({
    ...row,
    id: row.id.toString(),
    createdAt: new Date(row.createdAt)
  }))
}

// Legislators database functions
export async function getLegislatorsFromDB(): Promise<Legislator[]> {
  const pool = getDB()
  const result = await pool.query(`
    SELECT 
      id,
      name,
      parliamentary_group_id as "parliamentaryGroupId",
      legislature,
      state,
      type,
      gender,
      status,
      image_url as "imageUrl",
      email,
      biography,
      created_at as "createdAt"
    FROM legislators 
    ORDER BY name
  `)

  return result.rows.map(row => ({
    ...row,
    id: row.id.toString(),
    createdAt: new Date(row.createdAt)
  }))
}

export async function createLegislatorInDB(data: Omit<Legislator, "id" | "createdAt">): Promise<Legislator> {
  const pool = getDB()
  const result = await pool.query(`
    INSERT INTO legislators (
      name, parliamentary_group_id, legislature, state, type, 
      gender, status, image_url, email, biography
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING 
      id,
      name,
      parliamentary_group_id as "parliamentaryGroupId",
      legislature,
      state,
      type,
      gender,
      status,
      image_url as "imageUrl",
      email,
      biography,
      created_at as "createdAt"
  `, [
    data.name,
    data.parliamentaryGroupId,
    data.legislature || null,
    data.state || null,
    data.type || null,
    data.gender || null,
    data.status || 'Activo',
    data.imageUrl || null,
    data.email || null,
    data.biography || null
  ])

  const row = result.rows[0]
  return {
    ...row,
    id: row.id.toString(),
    createdAt: new Date(row.createdAt)
  }
}

export async function updateLegislatorInDB(
  id: string,
  data: Partial<Omit<Legislator, "id" | "createdAt">>
): Promise<Legislator | null> {
  const pool = getDB()
  const fields = []
  const values = []
  let paramCount = 1

  if (data.name !== undefined) {
    fields.push(`name = $${paramCount}`)
    values.push(data.name)
    paramCount++
  }
  if (data.parliamentaryGroupId !== undefined) {
    fields.push(`parliamentary_group_id = $${paramCount}`)
    values.push(data.parliamentaryGroupId)
    paramCount++
  }
  if (data.legislature !== undefined) {
    fields.push(`legislature = $${paramCount}`)
    values.push(data.legislature)
    paramCount++
  }
  if (data.state !== undefined) {
    fields.push(`state = $${paramCount}`)
    values.push(data.state)
    paramCount++
  }
  if (data.type !== undefined) {
    fields.push(`type = $${paramCount}`)
    values.push(data.type)
    paramCount++
  }
  if (data.gender !== undefined) {
    fields.push(`gender = $${paramCount}`)
    values.push(data.gender)
    paramCount++
  }
  if (data.status !== undefined) {
    fields.push(`status = $${paramCount}`)
    values.push(data.status)
    paramCount++
  }
  if (data.imageUrl !== undefined) {
    fields.push(`image_url = $${paramCount}`)
    values.push(data.imageUrl)
    paramCount++
  }
  if (data.email !== undefined) {
    fields.push(`email = $${paramCount}`)
    values.push(data.email)
    paramCount++
  }
  if (data.biography !== undefined) {
    fields.push(`biography = $${paramCount}`)
    values.push(data.biography)
    paramCount++
  }

  if (fields.length === 0) return null

  fields.push(`updated_at = CURRENT_TIMESTAMP`)
  values.push(id)

  const result = await pool.query(`
    UPDATE legislators 
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING 
      id,
      name,
      parliamentary_group_id as "parliamentaryGroupId",
      legislature,
      state,
      type,
      gender,
      status,
      image_url as "imageUrl",
      email,
      biography,
      created_at as "createdAt"
  `, values)

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  return {
    ...row,
    id: row.id.toString(),
    createdAt: new Date(row.createdAt)
  }
}

export async function deleteLegislatorFromDB(id: string): Promise<boolean> {
  const pool = getDB()
  const result = await pool.query('DELETE FROM legislators WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}

// Homepage configuration functions
export async function getHomepageConfigFromDB(): Promise<any[]> {
  const pool = getDB()

  // Check if table exists first
  const tableCheck = await pool.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'homepage_config'
    )
  `)

  if (!tableCheck.rows[0].exists) {
    console.log('homepage_config table does not exist, returning empty array')
    return []
  }

  const result = await pool.query(`
    SELECT 
      id,
      section, 
      title,
      description,
      background_image_url as "backgroundImageUrl",
      hero_image_url as "heroImageUrl",
      logo_url as "logoUrl",
      additional_images as "additionalImages",
      config_data as "configData",
      is_active as "isActive",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM homepage_config
    WHERE is_active = true
    ORDER BY section
  `)

  return result.rows
}

export async function createHomepageConfigInDB(data: any): Promise<any> {
  const pool = getDB()

  console.log('DB: Creating homepage config with data:', JSON.stringify(data, null, 2))
  console.log('DB: Parameters:', [
    data.section,
    data.title || null,
    data.description || null,
    data.backgroundImageUrl || null,
    data.heroImageUrl || null,
    data.mobileImageUrl || null,
    data.logoUrl || null,
    data.additionalImages || null,
    data.configData || null,
    data.isActive !== undefined ? data.isActive : true
  ])

  const result = await pool.query(`
    INSERT INTO homepage_config (
      section, title, description, background_image_url, hero_image_url, logo_url, 
      additional_images, config_data, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING 
      id,
      section,
      title,
      description,
      background_image_url as "backgroundImageUrl",
      hero_image_url as "heroImageUrl",
      logo_url as "logoUrl",
      additional_images as "additionalImages",
      config_data as "configData",
      is_active as "isActive",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `, [
    data.section,
    data.title || null,
    data.description || null,
    data.backgroundImageUrl || null,
    data.heroImageUrl || null,
    data.mobileImageUrl || null,
    data.logoUrl || null,
    data.additionalImages || null,
    data.configData || null,
    data.isActive !== undefined ? data.isActive : true
  ])

  const row = result.rows[0]
  return {
    ...row,
    id: row.id.toString(),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt)
  }
}

export async function updateHomepageConfigInDB(section: string, data: any): Promise<any | null> {
  const pool = getDB()

  // Build the SET clause dynamically
  const fields: string[] = []
  const values: any[] = []
  let paramCount = 1

  if (data.title !== undefined) {
    fields.push(`title = $${paramCount}`)
    values.push(data.title)
    paramCount++
  }

  if (data.description !== undefined) {
    fields.push(`description = $${paramCount}`)
    values.push(data.description)
    paramCount++
  }

  if (data.backgroundImageUrl !== undefined) {
    fields.push(`background_image_url = $${paramCount}`)
    values.push(data.backgroundImageUrl)
    paramCount++
  }

  if (data.heroImageUrl !== undefined) {
    fields.push(`hero_image_url = $${paramCount}`)
    values.push(data.heroImageUrl)
    paramCount++
  }

  // mobileImageUrl removed - column does not exist in database

  if (data.logoUrl !== undefined) {
    fields.push(`logo_url = $${paramCount}`)
    values.push(data.logoUrl)
    paramCount++
  }

  if (data.additionalImages !== undefined) {
    fields.push(`additional_images = $${paramCount}`)
    values.push(data.additionalImages)
    paramCount++
  }

  if (data.configData !== undefined) {
    fields.push(`config_data = $${paramCount}`)
    values.push(JSON.stringify(data.configData))
    paramCount++
  }

  if (data.isActive !== undefined) {
    fields.push(`is_active = $${paramCount}`)
    values.push(data.isActive)
    paramCount++
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`)
  values.push(section)

  const result = await pool.query(`
    UPDATE homepage_config 
    SET ${fields.join(', ')}
    WHERE section = $${paramCount}
    RETURNING 
      id,
      section,
      title,
      description,
      background_image_url as "backgroundImageUrl",
      hero_image_url as "heroImageUrl",
      logo_url as "logoUrl",
      additional_images as "additionalImages", 
      config_data as "configData",
      is_active as "isActive",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `, values)

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  return {
    ...row,
    id: row.id.toString(),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt)
  }
}

// Video News database functions
export async function getVideoNewsFromDB(): Promise<any[]> {
  try {
    const pool = getDB()
    console.log('Querying video news from database...')

    const result = await pool.query(`
      SELECT id, title, description, video_url, thumbnail_url, 
             category, duration, published_at as "publishedAt", 
             created_at as "createdAt", 
             COALESCE(status, 'published') as status
      FROM video_news
      WHERE (COALESCE(status, 'published') = 'published' OR (COALESCE(status, 'published') = 'scheduled' AND published_at <= NOW()))
      ORDER BY COALESCE(published_at, created_at) DESC, id DESC
    `)

    console.log('Raw video news database result:', result.rows.length, 'rows')

    return result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      videoUrl: row.video_url,
      thumbnailUrl: row.thumbnail_url,
      category: row.category,
      duration: row.duration,
      publishedAt: new Date(row.publishedAt),
      createdAt: new Date(row.createdAt),
      status: row.status
    }))
  } catch (error) {
    console.error('Error fetching video news from database:', error)
    return []
  }
}

export async function getAllVideoNewsFromDB(): Promise<any[]> {
  try {
    const pool = getDB()
    console.log('Querying all video news from database...')

    const result = await pool.query(`
      SELECT id, title, description, video_url as "videoUrl", thumbnail_url as "thumbnailUrl", 
             category, duration, published_at as "publishedAt", created_at as "createdAt", 
             COALESCE(status, 'published') as status
      FROM video_news
      ORDER BY COALESCE(published_at, created_at) DESC, id DESC
    `)

    return result.rows.map(row => ({
      ...row,
      id: row.id.toString(),
      publishedAt: new Date(row.publishedAt),
      createdAt: new Date(row.createdAt)
    }))
  } catch (error) {
    console.error('Error fetching all video news from database:', error)
    return []
  }
}

export async function createVideoNewsInDB(data: any): Promise<any> {
  try {
    const pool = getDB()

    const result = await pool.query(`
      INSERT INTO video_news (title, description, video_url, thumbnail_url, category, duration, published_at, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, title, description, video_url as "videoUrl", thumbnail_url as "thumbnailUrl", 
                category, duration, published_at as "publishedAt", created_at as "createdAt", 
                COALESCE(status, 'published') as status
    `, [data.title, data.description, data.videoUrl, data.thumbnailUrl, data.category, data.duration, data.publishedAt, data.status || 'published'])

    const row = result.rows[0]
    return {
      ...row,
      id: row.id.toString(),
      publishedAt: new Date(row.publishedAt),
      createdAt: new Date(row.createdAt)
    }
  } catch (error) {
    console.error('Error creating video news:', error)
    throw error
  }
}

export async function updateVideoNewsInDB(id: string, data: any): Promise<any | null> {
  const pool = getDB()

  const fields = []
  const values = []
  let paramIndex = 1

  if (data.title !== undefined) {
    fields.push(`title = $${paramIndex++}`)
    values.push(data.title)
  }
  if (data.description !== undefined) {
    fields.push(`description = $${paramIndex++}`)
    values.push(data.description)
  }
  if (data.videoUrl !== undefined) {
    fields.push(`video_url = $${paramIndex++}`)
    values.push(data.videoUrl)
  }
  if (data.thumbnailUrl !== undefined) {
    fields.push(`thumbnail_url = $${paramIndex++}`)
    values.push(data.thumbnailUrl)
  }
  if (data.category !== undefined) {
    fields.push(`category = $${paramIndex++}`)
    values.push(data.category)
  }
  if (data.duration !== undefined) {
    fields.push(`duration = $${paramIndex++}`)
    values.push(data.duration)
  }
  if (data.publishedAt !== undefined) {
    fields.push(`published_at = $${paramIndex++}`)
    values.push(data.publishedAt)
  }
  if (data.status !== undefined) {
    fields.push(`status = $${paramIndex++}`)
    values.push(data.status)
  }

  if (fields.length === 0) return null

  fields.push(`updated_at = CURRENT_TIMESTAMP`)
  values.push(id)

  const result = await pool.query(`
    UPDATE video_news 
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, title, description, video_url as "videoUrl", thumbnail_url as "thumbnailUrl", 
              category, duration, published_at as "publishedAt", created_at as "createdAt", status
  `, values)

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  return {
    ...row,
    id: row.id.toString(),
    publishedAt: new Date(row.publishedAt),
    createdAt: new Date(row.createdAt)
  }
}

export async function deleteVideoNewsFromDB(id: string): Promise<boolean> {
  const pool = getDB()
  const result = await pool.query('DELETE FROM video_news WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}