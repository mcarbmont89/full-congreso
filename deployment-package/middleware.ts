import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-for-development-only'

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value
    console.log('Middleware - checking token for:', request.nextUrl.pathname)
    console.log('Middleware - token found:', !!token)
    console.log('Middleware - all cookies:', request.cookies.getAll().map(c => c.name))
    console.log('Middleware - request headers host:', request.headers.get('host'))
    console.log('Middleware - request protocol:', request.nextUrl.protocol)

    if (!token) {
      console.log('Middleware - no token, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Simple token validation - decode JWT manually
      const parts = token.split('.')
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format')
      }

      const payload = JSON.parse(atob(parts[1]))

      // Check if token is expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        throw new Error('Token expired')
      }

      console.log('Middleware - token valid:', payload)
      return NextResponse.next()
    } catch (error) {
      console.log('Middleware - token invalid:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}