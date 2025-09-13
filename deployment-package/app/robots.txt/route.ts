
import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  const robotsTxt = `User-agent: *
Allow: /

# Block admin area
Disallow: /admin/
Disallow: /api/

# Block uploads directory browsing
Disallow: /uploads/

# Allow specific API endpoints for indexing
Allow: /api/sitemap

Sitemap: ${baseUrl}/sitemap.xml
`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    }
  })
}
