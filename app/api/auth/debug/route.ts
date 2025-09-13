
import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '@/lib/database'

export async function GET(request: NextRequest) {
  // Only allow in development or if specifically enabled
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DEBUG !== 'true') {
    return NextResponse.json({ error: 'Debug endpoint disabled in production' }, { status: 403 })
  }

  const diagnostics: any = {
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasPgHost: !!process.env.PGHOST,
      hasPgDatabase: !!process.env.PGDATABASE,
      hasPgUser: !!process.env.PGUSER,
      hasPgPassword: !!process.env.PGPASSWORD,
    },
    cookies: {
      authToken: !!request.cookies.get('auth-token'),
      allCookies: request.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
    },
    request: {
      host: request.headers.get('host'),
      protocol: request.nextUrl.protocol,
      userAgent: request.headers.get('user-agent'),
    }
  }

  // Test database connection
  try {
    const pool = getDatabaseConnection()
    if (pool) {
      const result = await pool.query('SELECT COUNT(*) FROM users')
      diagnostics.database = {
        connected: true,
        userCount: parseInt(result.rows[0].count)
      }
    } else {
      diagnostics.database = { connected: false, error: 'No connection pool' }
    }
  } catch (error) {
    diagnostics.database = { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }

  return NextResponse.json(diagnostics)
}
