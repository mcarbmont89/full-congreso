import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-key-for-development-only'
)

export async function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Edge-compatible JWT verification with jose
      const { payload } = await jwtVerify(token, JWT_SECRET)
      
      // Additional security check: ensure the token has required fields
      if (!payload.username || !payload.role) {
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