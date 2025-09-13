import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-for-development-only'

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Proper JWT verification with signature validation
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
      
      // Additional security check: ensure the token has required fields
      if (!decoded.username || !decoded.role) {
        throw new Error('Invalid token payload')
      }

      return NextResponse.next()
    } catch (error) {
      // Token is invalid (expired, malformed, or signature doesn't match)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}