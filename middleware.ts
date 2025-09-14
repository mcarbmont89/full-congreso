import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-for-development-only'

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value
    console.log('Middleware: Checking /admin access, token present:', !!token)
    console.log('Middleware: JWT_SECRET available:', !!JWT_SECRET)

    if (!token) {
      console.log('Middleware: No token found, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Proper JWT verification with signature validation
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
      console.log('Middleware: Token decoded successfully:', { username: decoded.username, role: decoded.role })
      
      // Additional security check: ensure the token has required fields
      if (!decoded.username || !decoded.role) {
        console.log('Middleware: Token missing required fields')
        throw new Error('Invalid token payload')
      }

      console.log('Middleware: Access granted to /admin')
      return NextResponse.next()
    } catch (error) {
      // Token is invalid (expired, malformed, or signature doesn't match)
      console.log('Middleware: Token verification failed:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}