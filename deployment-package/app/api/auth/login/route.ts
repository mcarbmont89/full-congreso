
import { NextRequest, NextResponse } from 'next/server'
import { validateUser, getUserByUsername } from '@/lib/auth'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-for-development-only'

// Log environment info for debugging (remove in production)
console.log('Auth environment check:', {
  hasJwtSecret: !!process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  hasDatabaseUrl: !!process.env.DATABASE_URL
})

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    console.log('Login attempt for username:', username)
    const isValid = await validateUser(username, password)
    console.log('Validation result:', isValid)
    
    if (!isValid) {
      console.log('Login failed for username:', username)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Get user details from database
    const user = await getUserByUsername(username)
    if (!user) {
      console.log('User not found after validation:', username)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Set cookie with flexible security settings
    const cookieStore = await cookies()
    const isProduction = process.env.NODE_ENV === 'production'
    const isHttps = process.env.HTTPS === 'true' || process.env.NODE_ENV === 'production'
    
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: isHttps, // Only secure if HTTPS is available
      sameSite: isHttps ? 'strict' : 'lax', // More flexible for HTTP
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    console.log('Cookie set with settings:', {
      secure: isHttps,
      sameSite: isHttps ? 'strict' : 'lax',
      nodeEnv: process.env.NODE_ENV
    })

    return NextResponse.json({ 
      success: true, 
      user: { username, role: user.role }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
