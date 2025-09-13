import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, JWT_SECRET) as any

    return NextResponse.json({ 
      authenticated: true, 
      user: { username: decoded.username, role: decoded.role }
    })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}