// Types for our content
export interface LiveStream {
  id: string
  title: string
  thumbnailUrl: string
  streamUrl: string
  channel: string
  isLive: boolean
  status: string
  createdAt: Date
}

// Removed duplicate Program type - using interface at bottom of file



export type Organ = {
  id: string
  title: string
  description: string
  imageUrl: string
  url?: string
  createdAt: Date
}

// All data is now sourced from the database
// All data is now sourced from the database
// All data is now sourced from the database
// All data is now sourced from the database
// All data is now sourced from the database
// All data is now sourced from the database
// All data is now sourced from the database
// All data is now sourced from the database
// All data is now sourced from the database
// All data is now sourced from the database
// All data is now sourced from the database

// All data is now sourced from the database

// All organs data is now sourced from the database

// Añadir estos tipos al archivo api.ts existente

export interface ParliamentaryGroup {
  id: string
  name: string
  abbreviation: string
  imageUrl: string
  colorHex?: string
  description?: string
  legislatorCount?: number
  createdAt: Date
}

export type Legislator = {
  id: string
  name: string
  parliamentaryGroupId: string
  legislature: string
  state: string
  type: string
  gender: "M" | "F"
  status: "Activo" | "Inactivo"
  imageUrl: string
  email?: string
  biography?: string
  createdAt: Date
}



export interface VideoNews {
  id: string
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  category?: string
  duration?: string
  publishedAt: Date
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  createdAt: Date
  updatedAt: Date
}

// Parliamentary groups functionality
export async function getParliamentaryGroups(): Promise<ParliamentaryGroup[]> {
  try {
    const { getParliamentaryGroupsFromDB } = await import('./api-database')
    return await getParliamentaryGroupsFromDB()
  } catch (error) {
    console.error('Database error in getParliamentaryGroups:', error)
    return []
  }
}

// All legislators data is now sourced from the database



// Añadir estos tipos y funciones al archivo api.ts existente

export type RadioProgram = {
  id: string
  title: string
  description: string
  imageUrl: string
  audioUrl: string
  duration: string
  publishedAt: Date
  category: "programa" | "entrevista" | "conferencia" | "podcast"
  createdAt: Date
}

// All radio programs data is now sourced from the database

// API functions
export async function getLiveStreams(): Promise<LiveStream[]> {
  // On client side, call the API endpoint
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/api/live-streams', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (!response.ok) {
        console.warn(`API response not ok: ${response.status} ${response.statusText}`)
        return []
      }
      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error fetching streams from API:', error)
      return []
    }
  }

  // On server side, try to connect to database
  try {
    const { getLiveStreamsFromDB } = await import('./api-database')
    const dbStreams = await getLiveStreamsFromDB()
    return Array.isArray(dbStreams) ? dbStreams : []
  } catch (error) {
    console.error('Database error in getLiveStreams:', error)
    return []
  }
}

export async function getPrograms(): Promise<Program[]> {
  // Only try to connect to database on server side
  if (typeof window === 'undefined') {
    try {
      // Try to fetch from database first
      const { getProgramsFromDB } = await import('./api-database')
      const dbPrograms = await getProgramsFromDB()
      return dbPrograms || []
    } catch (error) {
      console.error('Database error:', error)
      return []
    }
  } else {
    // On client side, return empty array since data should come from API
    return []
  }
}

// API functions para programas de radio - removed duplicate, using database version below

export async function getRadioProgramsByCategory(category: string): Promise<RadioProgram[]> {
  try {
    const programs = await getRadioPrograms()
    return programs.filter((program) => program.category === category)
  } catch (error) {
    console.error('Database error in getRadioProgramsByCategory:', error)
    return []
  }
}

export async function getRadioProgramById(id: string): Promise<RadioProgram | null> {
  try {
    const programs = await getRadioPrograms()
    return programs.find((program) => program.id === id) || null
  } catch (error) {
    console.error('Database error in getRadioProgramById:', error)
    return null
  }
}

// API functions para grupos parlamentarios
export async function createParliamentaryGroup(data: Omit<ParliamentaryGroup, "id" | "createdAt">): Promise<ParliamentaryGroup> {
  try {
    const { createParliamentaryGroupInDB } = await import('./api-database')
    return await createParliamentaryGroupInDB(data)
  } catch (error) {
    console.error('Database error in createParliamentaryGroup:', error)
    throw error
  }
}

// Parliamentary groups functionality removed

export async function getParliamentaryGroupById(id: string): Promise<ParliamentaryGroup | null> {
  try {
    const groups = await getParliamentaryGroups()
    return groups.find((group) => group.id === id) || null
  } catch (error) {
    console.error('Database error in getParliamentaryGroupById:', error)
    return null
  }
}

// API functions para legisladores
export async function getLegislators(): Promise<Legislator[]> {
  try {
    const { getLegislatorsFromDB } = await import('./api-database')
    return await getLegislatorsFromDB()
  } catch (error) {
    console.error('Database error in getLegislators:', error)
    return []
  }
}

export async function getLegislatorById(id: string): Promise<Legislator | null> {
  try {
    const legislators = await getLegislators()
    return legislators.find((legislator) => legislator.id === id) || null
  } catch (error) {
    console.error('Database error in getLegislatorById:', error)
    return null
  }
}

// CRUD operations for live streams using API endpoints
export async function createLiveStream(data: Omit<LiveStream, "id" | "createdAt">): Promise<LiveStream> {
  const response = await fetch('/api/live-streams', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create live stream')
  }

  return await response.json()
}

export async function updateLiveStream(id: string, data: Partial<Omit<LiveStream, "id" | "createdAt">>): Promise<LiveStream> {
  const response = await fetch(`/api/live-streams?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to update live stream: ${response.status} ${errorText}`)
  }

  return await response.json()
}

export async function deleteLiveStream(id: string): Promise<void> {
  const response = await fetch(`/api/live-streams?id=${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete live stream')
  }
}

export async function getNews(page: number = 1, limit: number = 20) {
  try {
    const { getNewsFromDB } = await import('./api-database')
    return await getNewsFromDB(page, limit)
  } catch (error) {
    console.error('Database error in getNews:', error)
    return { news: [], total: 0, totalPages: 0 }
  }
}

export async function getNewsByCategory(category: string, page: number = 1, limit: number = 20) {
  try {
    const { getNewsFromDB } = await import('./api-database')
    const result = await getNewsFromDB()
    // Filter by category from all news, then apply pagination
    const categoryNews = result.news.filter((item) => item.category === category)
    const total = categoryNews.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedNews = categoryNews.slice(offset, offset + limit)
    
    return { news: paginatedNews, total, totalPages }
  } catch (error) {
    console.error('Database error in getNewsByCategory:', error)
    return { news: [], total: 0, totalPages: 0 }
  }
}

export async function getNewsById(id: string) {
  try {
    const { getNewsFromDB } = await import('./api-database')
    const result = await getNewsFromDB(1, 1000) // Get a large number to search through all
    return result.news.find((item) => item.id === id) || null
  } catch (error) {
    console.error('Database error in getNewsById:', error)
    return null
  }
}

export async function getOrgans(): Promise<Organ[]> {
  try {
    const { getOrgans } = await import('./api-database')
    return await getOrgans()
  } catch (error) {
    console.error('Database error in getOrgans:', error)
    return []
  }
}
export interface Program {
  id: string
  title: string
  description: string
  imageUrl: string
  url?: string
  imageFileName?: string
  orderIndex?: number
  createdAt: Date
}

export interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  imageUrl: string
  imageUrl2?: string
  imageUrl3?: string
  imageUrl4?: string
  imageUrl5?: string
  status?: string
  category?: string
  publishedAt: Date
  createdAt: Date
  isFeatured?: boolean
  featuredRank?: number | null
}
// Radio Programs Management
export async function getRadioPrograms() {
  try {
    const { createDatabaseConnectionFromEnv } = await import('./database-env')
    const pool = createDatabaseConnectionFromEnv()

    if (!pool) {
      console.warn('Database pool not available, returning empty array')
      return []
    }

    const result = await pool.query(`
      SELECT 
        id,
        title,
        description,
        image_url as "imageUrl",
        latest_episode_title,
        latest_episode_date,
        latest_episode_duration,
        latest_episode_description,
        program_link as "programLink",
        episodes_link as "episodesLink",
        category,
        display_order,
        featured,
        created_at as "createdAt"
      FROM radio_programs 
      WHERE published = true
      ORDER BY display_order ASC, created_at DESC
    `)

    return result.rows.map(row => ({
      ...row,
      programLink: row.programLink || row.program_link || '#',
      episodesLink: row.episodesLink || row.episodes_link || '#',
      link: row.programLink || row.program_link || '#',
      latestEpisode: {
        title: row.latest_episode_title || '',
        date: row.latest_episode_date || '',
        duration: row.latest_episode_duration || '',
        description: row.latest_episode_description || ''
      }
    })).filter(program => program.id && program.title && program.programLink && program.episodesLink)
  } catch (error) {
    console.error('Error fetching radio programs:', error)
    // Return empty array instead of throwing in production
    return []
  }
}

export async function createRadioProgram(data: any) {
  try {
    const { createDatabaseConnectionFromEnv } = await import('./database-env')
    const pool = createDatabaseConnectionFromEnv()

    if (!pool) {
      throw new Error('Database connection not available. Please check your database configuration.')
    }

    // Validate required fields
    if (!data.title?.trim()) {
      throw new Error('Program title is required')
    }
    if (!data.description?.trim()) {
      throw new Error('Program description is required')
    }

    const result = await pool.query(`
      INSERT INTO radio_programs (
        title, description, image_url, latest_episode_title, 
        latest_episode_date, latest_episode_duration, latest_episode_description,
        program_link, episodes_link, category, published, display_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      data.title.trim(),
      data.description.trim(),
      data.imageUrl || null,
      data.latestEpisode?.title?.trim() || '',
      data.latestEpisode?.date?.trim() || '',
      data.latestEpisode?.duration?.trim() || '',
      data.latestEpisode?.description?.trim() || '',
      data.programLink?.trim() || '',
      data.episodesLink?.trim() || '',
      data.category?.trim() || 'General',
      data.published !== false,
      data.displayOrder || 0
    ])

    if (!result.rows[0]) {
      throw new Error('Failed to create radio program - no data returned')
    }

    return result.rows[0]
  } catch (error) {
    console.error('Error creating radio program:', error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        throw new Error('A program with this name already exists')
      }
      if (error.message.includes('connection')) {
        throw new Error('Database connection failed. Please try again.')
      }
      throw error
    }

    throw new Error('Unknown error occurred while creating radio program')
  }
}

export async function updateRadioProgram(id: string, data: any) {
  try {
    const { createDatabaseConnectionFromEnv } = await import('./database-env')
    const pool = createDatabaseConnectionFromEnv()

    if (!pool) {
      throw new Error('Database connection not available')
    }

    // Build dynamic query based on provided fields
    const fields: string[] = []
    const values: any[] = []
    let valueIndex = 1

    if (data.title !== undefined) {
      fields.push(`title = $${valueIndex}`)
      values.push(data.title.trim())
      valueIndex++
    }

    if (data.description !== undefined) {
      fields.push(`description = $${valueIndex}`)
      values.push(data.description.trim())
      valueIndex++
    }

    if (data.imageUrl !== undefined) {
      fields.push(`image_url = $${valueIndex}`)
      values.push(data.imageUrl)
      valueIndex++
    }

    if (data.latestEpisode) {
      if (data.latestEpisode.title !== undefined) {
        fields.push(`latest_episode_title = $${valueIndex}`)
        values.push(data.latestEpisode.title.trim())
        valueIndex++
      }
      if (data.latestEpisode.date !== undefined) {
        fields.push(`latest_episode_date = $${valueIndex}`)
        values.push(data.latestEpisode.date.trim())
        valueIndex++
      }
      if (data.latestEpisode.duration !== undefined) {
        fields.push(`latest_episode_duration = $${valueIndex}`)
        values.push(data.latestEpisode.duration.trim())
        valueIndex++
      }
      if (data.latestEpisode.description !== undefined) {
        fields.push(`latest_episode_description = $${valueIndex}`)
        values.push(data.latestEpisode.description.trim())
        valueIndex++
      }
    }

    if (data.programLink !== undefined) {
      fields.push(`program_link = $${valueIndex}`)
      values.push(data.programLink.trim())
      valueIndex++
    }

    if (data.episodesLink !== undefined) {
      fields.push(`episodes_link = $${valueIndex}`)
      values.push(data.episodesLink.trim())
      valueIndex++
    }

    if (data.category !== undefined) {
      fields.push(`category = $${valueIndex}`)
      values.push(data.category.trim())
      valueIndex++
    }

    if (data.displayOrder !== undefined) {
      fields.push(`display_order = $${valueIndex}`)
      values.push(data.displayOrder)
      valueIndex++
    }

    if (data.published !== undefined) {
      fields.push(`published = $${valueIndex}`)
      values.push(data.published)
      valueIndex++
    }

    if (data.featured !== undefined) {
      fields.push(`featured = $${valueIndex}`)
      values.push(data.featured)
      valueIndex++
    }

    // Always update the updated_at timestamp
    fields.push(`updated_at = NOW()`)

    if (fields.length === 1) { // Only updated_at field
      throw new Error('No fields to update')
    }

    values.push(id) // Add ID for WHERE clause
    const query = `
      UPDATE radio_programs 
      SET ${fields.join(', ')} 
      WHERE id = $${valueIndex}
      RETURNING *
    `

    console.log('Updating radio program with query:', query)
    console.log('Values:', values)

    const result = await pool.query(query, values)

    if (!result.rows[0]) {
      return null // Program not found
    }

    return result.rows[0]
  } catch (error) {
    console.error('Error updating radio program:', error)
    throw error
  }
}

export async function deleteRadioProgram(id: string) {
  try {
    const { createDatabaseConnectionFromEnv } = await import('./database-env')
    const pool = createDatabaseConnectionFromEnv()

    if (!pool) {
      throw new Error('Database connection not available')
    }

    await pool.query('DELETE FROM radio_programs WHERE id = $1', [id])
    return { success: true }
  } catch (error) {
    console.error('Error deleting radio program:', error)
    throw error
  }
}

// Radio Categories Management  
export async function getRadioCategories() {
  try {
    const { createDatabaseConnectionFromEnv } = await import('./database-env')
    const pool = createDatabaseConnectionFromEnv()

    if (!pool) {
      console.warn('Database pool not available, returning empty array')
      return []
    }

    const result = await pool.query(`
      SELECT 
        id,
        name,
        slug,
        description,
        image_url as "imageUrl",
        display_order as "displayOrder",
        created_at as "createdAt"
      FROM radio_categories 
      WHERE active = true
      ORDER BY display_order ASC, name ASC
    `)

    return result.rows
  } catch (error) {
    console.error('Error fetching radio categories:', error)
    throw error
  }
}

export async function createRadioCategory(data: any) {
  try {
    const { pool } = await import('./database')

    if (!pool) {
      throw new Error('Database connection not available')
    }

    const result = await pool.query(`
      INSERT INTO radio_categories (name, slug, description, image_url, display_order, active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      data.name,
      data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      data.description || '',
      data.imageUrl || '',
      data.displayOrder || 0,
      data.active !== false
    ])

    return result.rows[0]
  } catch (error) {
    console.error('Error creating radio category:', error)
    throw error
  }
}

// Radio Episodes Management
export async function getRadioEpisodes(programId?: string) {
  try {
    const { createDatabaseConnectionFromEnv } = await import('./database-env')
    const pool = createDatabaseConnectionFromEnv()

    if (!pool) {
      console.warn('Database pool not available, returning empty array')
      return []
    }

    let query = `
      SELECT 
        re.id,
        re.title,
        re.description,
        re.audio_url as "audioUrl",
        re.duration,
        re.publish_date as "publishDate", 
        re.publish_date as "published_date",
        re.image_url as "imageUrl",
        re.program_id as "programId",
        re.created_at as "createdAt",
        rp.title as "programTitle",
        rp.image_url as "programImageUrl",
        CASE WHEN re.published IS NULL THEN true ELSE re.published END as published
      FROM radio_episodes re
      LEFT JOIN radio_programs rp ON re.program_id = rp.id
    `

    const params: any[] = []
    let whereClause = ''
    
    // For public API calls, only show published episodes
    // For admin calls, show all episodes
    const isAdminCall = process.env.NODE_ENV === 'development' || programId === 'admin'
    
    if (!isAdminCall && programId !== 'admin') {
      whereClause = 'WHERE (re.published IS NULL OR re.published = true)'
    }

    if (programId && programId !== 'all' && programId !== 'undefined' && programId !== undefined && programId !== 'admin') {
      // Convert programId to integer since program_id column is integer type
      const condition = ' re.program_id = $' + (params.length + 1)
      if (whereClause) {
        whereClause += ' AND' + condition
      } else {
        whereClause = 'WHERE' + condition
      }
      params.push(parseInt(programId, 10))
    }

    query += ` ${whereClause} ORDER BY re.publish_date DESC, re.created_at DESC`

    console.log('Episodes query:', query)
    console.log('Episodes params:', params)

    const result = await pool.query(query, params)
    console.log('Episodes query result count:', result.rows.length)

    if (result.rows.length > 0) {
      console.log('First episode:', result.rows[0])
    }

    return result.rows
  } catch (error) {
    console.error('Error fetching radio episodes:', error)
    // Return empty array instead of throwing to prevent page crashes
    return []
  }
}

export async function createRadioEpisode(data: any) {
  try {
    const { createDatabaseConnectionFromEnv } = await import('./database-env')
    const pool = createDatabaseConnectionFromEnv()

    if (!pool) {
      throw new Error('Database connection not available')
    }

    const result = await pool.query(`
      INSERT INTO radio_episodes (
        title, description, audio_url, duration, 
        publish_date, image_url, program_id, published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      data.title,
      data.description,
      data.audioUrl,
      data.duration,
      data.publishDate,
      data.imageUrl,
      data.programId,
      data.published !== false
    ])

    return result.rows[0]
  } catch (error) {
    console.error('Error creating radio episode:', error)
    throw error
  }
}

export async function deleteRadioEpisode(id: string) {
  try {
    const { pool } = await import('./database')

    if (!pool) {
      throw new Error('Database connection not available')
    }

    const result = await pool.query(
      'DELETE FROM radio_episodes WHERE id = $1 RETURNING id',
      [id]
    )

    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error('Error deleting radio episode:', error)
    throw error
  }
}

// Additional utility functions for complex operations
export async function searchLegislators(query: string) {
  try {
    const { pool } = await import('./database')

    if (!pool) {
      console.warn('Database pool not available, returning empty array')
      return []
    }

    const result = await pool.query(
      `SELECT * FROM legislators 
       WHERE LOWER(name) LIKE LOWER($1) 
       OR LOWER(political_party) LIKE LOWER($1)
       ORDER BY name`,
      [`%${query}%`]
    )
    return result.rows
  } catch (error) {
    console.error('Error searching legislators:', error)
    throw error
  }
}