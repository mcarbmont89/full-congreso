import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
    },
  })
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await context.params
    const filePath = params.path.join('/')
    const fullPath = join(process.cwd(), 'public', filePath)

    console.log('Serving file:', filePath)
    console.log('Full path:', fullPath)
    console.log('File exists:', existsSync(fullPath))

    if (!existsSync(fullPath)) {
      console.log('File not found:', fullPath)

      // Check if directory exists and list files for debugging
      const dirPath = join(process.cwd(), 'public', filePath.split('/').slice(0, -1).join('/'))
      if (existsSync(dirPath)) {
        const fs = require('fs')
        const files = fs.readdirSync(dirPath)
        console.log('Directory exists:', true)
        console.log('Files in directory:', files)
      }

      return new NextResponse('File not found', { status: 404 })
    }

    const stats = await stat(fullPath)

    // Determine content type based on file extension
    const ext = filePath.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'

    switch (ext) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'png':
        contentType = 'image/png'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      case 'webp':
        contentType = 'image/webp'
        break
      case 'svg':
        contentType = 'image/svg+xml'
        break
      case 'pdf':
        contentType = 'application/pdf'
        break
      case 'mp3':
        contentType = 'audio/mpeg'
        break
      case 'mp4':
        contentType = 'video/mp4'
        break
      case 'webm':
        contentType = 'video/webm'
        break
      case 'wav':
        contentType = 'audio/wav'
        break
      case 'ogg':
        contentType = 'audio/ogg'
        break
      case 'm4a':
        contentType = 'audio/mp4'
        break
    }

    const range = request.headers.get('range')

    if (range && (contentType.startsWith('audio/') || contentType.startsWith('video/'))) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1
      const chunksize = (end - start) + 1

      const fileBuffer = await readFile(fullPath)
      const chunk = fileBuffer.slice(start, end + 1)

      return new NextResponse(chunk, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Range',
        },
      })
    }

    const fileBuffer = await readFile(fullPath)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range',
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}