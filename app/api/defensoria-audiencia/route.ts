import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/database-env'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-key-for-development-only'
)

// Helper function to verify authentication
async function verifyAuth(request: NextRequest): Promise<{ success: boolean; error?: string }> {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return { success: false, error: 'Authentication token not found' }
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    // Additional security check: ensure the token has required fields
    if (!payload.username || !payload.role) {
      return { success: false, error: 'Invalid token payload' }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Invalid or expired token' }
  }
}

// Helper function to verify admin role
async function verifyAdminAuth(request: NextRequest): Promise<{ success: boolean; error?: string }> {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return { success: false, error: 'Authentication token not found' }
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    // Additional security check: ensure the token has required fields and admin role
    if (!payload.username || !payload.role) {
      return { success: false, error: 'Invalid token payload' }
    }

    if (payload.role !== 'admin') {
      return { success: false, error: 'Admin role required' }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Invalid or expired token' }
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = getDB()

    // Ensure defensoria_content table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS defensoria_content (
        id SERIAL PRIMARY KEY,
        section VARCHAR(100) NOT NULL,
        title VARCHAR(255),
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

    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const includeInactive = searchParams.get('admin') === 'true' // Admin can see all

    // Check if admin access is requested
    let isAdminRequest = false
    if (includeInactive) {
      // Admin access requested - verify authentication and authorization
      const authResult = await verifyAdminAuth(request)
      if (!authResult.success) {
        return NextResponse.json(
          { error: authResult.error || 'Unauthorized' },
          { status: authResult.error === 'Admin role required' ? 403 : 401 }
        )
      }
      isAdminRequest = true // Admin authenticated successfully
    }

    let query = `
      SELECT id, section, title, content, image_url, file_url, metadata, display_order, is_active, created_at, updated_at
      FROM defensoria_content
    `
    const params: any[] = []
    let whereClause = ''

    // If not admin request, filter only active content
    if (!isAdminRequest) {
      whereClause = 'WHERE is_active = true'
    }

    if (section) {
      if (whereClause) {
        whereClause += ` AND section = $${params.length + 1}`
      } else {
        whereClause = `WHERE section = $${params.length + 1}`
      }
      params.push(section)
    }

    query += whereClause
    query += ` ORDER BY display_order ASC, created_at DESC`

    console.log('Querying defensoria content from database...', { section })
    const result = await db.query(query, params)

    console.log('Defensoria content fetched from DB:', result.rows.length, 'items')

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching defensoria content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch defensoria content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Verify admin authentication for write operations
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error || 'Unauthorized' },
      { status: authResult.error === 'Admin role required' ? 403 : 401 }
    )
  }

  try {
    const db = getDB()
    const formData = await request.formData()
    const section = formData.get('section') as string
    const title = formData.get('title') as string | undefined
    const content = formData.get('content') as string | undefined
    const file = formData.get('file') as File | undefined
    const metadata = formData.get('metadata') ? JSON.parse(formData.get('metadata') as string) : {}
    const display_order = formData.get('display_order') ? parseInt(formData.get('display_order') as string, 10) : 0
    const is_active = formData.get('is_active') ? formData.get('is_active') === 'true' : true

    if (!section) {
      return NextResponse.json(
        { error: 'Section is required' },
        { status: 400 }
      )
    }

    let file_url = null
    if (file) {
      // In a real application, you would upload the file to a storage service (e.g., S3, Cloudinary)
      // and get a URL back. For this example, we'll just log the file info.
      console.log('Received file:', file.name, 'Type:', file.type, 'Size:', file.size)
      // Placeholder for actual file upload and URL generation
      // file_url = await uploadFileToStorage(file); 
      file_url = `/uploads/${file.name}`; // Example URL
    }

    console.log('Creating defensoria content:', { section, title, file_url })

    const result = await db.query(`
      INSERT INTO defensoria_content (section, title, content, image_url, file_url, metadata, display_order, is_active, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
      RETURNING *
    `, [section, title, content, null, file_url, JSON.stringify(metadata), display_order, is_active])

    console.log('Defensoria content created:', result.rows[0])

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating defensoria content:', error)
    return NextResponse.json(
      { error: 'Failed to create defensoria content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  // Verify admin authentication for write operations
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error || 'Unauthorized' },
      { status: authResult.error === 'Admin role required' ? 403 : 401 }
    )
  }

  try {
    const db = getDB()
    const formData = await request.formData()
    const id = formData.get('id') as string
    const section = formData.get('section') as string | undefined
    const title = formData.get('title') as string | undefined
    const content = formData.get('content') as string | undefined
    const file = formData.get('file') as File | undefined
    const metadata = formData.get('metadata') ? JSON.parse(formData.get('metadata') as string) : undefined
    const display_order = formData.get('display_order') ? parseInt(formData.get('display_order') as string, 10) : undefined
    const is_active = formData.get('is_active') ? formData.get('is_active') === 'true' : undefined


    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    let file_url = undefined;
    if (file) {
      console.log('Received file for update:', file.name, 'Type:', file.type, 'Size:', file.size);
      // Placeholder for actual file upload and URL generation
      // file_url = await uploadFileToStorage(file);
      file_url = `/uploads/${file.name}`; // Example URL
    }


    console.log('Updating defensoria content:', { id, section, title, file_url })

    const result = await db.query(`
      UPDATE defensoria_content 
      SET section = COALESCE($2, section),
          title = COALESCE($3, title),
          content = COALESCE($4, content),
          image_url = COALESCE($5, image_url),
          file_url = COALESCE($6, file_url),
          metadata = COALESCE($7, metadata),
          display_order = COALESCE($8, display_order),
          is_active = COALESCE($9, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id, section, title, content, null, file_url, JSON.stringify(metadata), display_order, is_active])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Defensoria content not found' },
        { status: 404 }
      )
    }

    console.log('Defensoria content updated:', result.rows[0])

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating defensoria content:', error)
    return NextResponse.json(
      { error: 'Failed to update defensoria content' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  // Verify admin authentication for write operations
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error || 'Unauthorized' },
      { status: authResult.error === 'Admin role required' ? 403 : 401 }
    )
  }

  try {
    const db = getDB()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    console.log('Deleting defensoria content:', { id })

    const result = await db.query(`
      DELETE FROM defensoria_content 
      WHERE id = $1
      RETURNING *
    `, [id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Defensoria content not found' },
        { status: 404 }
      )
    }

    console.log('Defensoria content deleted:', result.rows[0])

    return NextResponse.json({ message: 'Defensoria content deleted successfully' })
  } catch (error) {
    console.error('Error deleting defensoria content:', error)
    return NextResponse.json(
      { error: 'Failed to delete defensoria content' },
      { status: 500 }
    )
  }
}