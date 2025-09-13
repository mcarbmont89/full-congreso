import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (max 10MB for images, 500MB for audio)
    const maxSize = (file.type.startsWith('audio/') || file.name.toLowerCase().endsWith('.mp3')) ? 500 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` 
      }, { status: 400 })
    }

    // Validate file type - be more flexible with MP3 detection
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/mp3', 'audio/mpeg3']
    const isAudio = file.type.startsWith('audio/') || file.name.toLowerCase().endsWith('.mp3')
    const isImage = file.type.startsWith('image/')

    if (!isAudio && !isImage && !allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, MP3' 
      }, { status: 400 })
    }

    // Generate unique filename with proper extension handling
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
    const uniqueFilename = `${randomUUID()}.${fileExtension}`

    // Define upload path based on type - handle audio files specifically
    let uploadDir: string
    if (isAudio || file.name.toLowerCase().endsWith('.mp3')) {
      uploadDir = join(process.cwd(), 'public', 'uploads', 'audio')
    } else if (type === 'radio') {
      uploadDir = join(process.cwd(), 'public', 'uploads', 'radio')
    } else {
      uploadDir = join(process.cwd(), 'public', 'uploads', type)
    }

    const filePath = join(uploadDir, uniqueFilename)

    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true })

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file to local storage
    await writeFile(filePath, buffer)

    // Return the public URL path with proper response format
    if (isAudio || file.name.toLowerCase().endsWith('.mp3')) {
      return NextResponse.json({
        url: `/uploads/audio/${uniqueFilename}`,
        audioUrl: `/uploads/audio/${uniqueFilename}`,
        fileUrl: `/uploads/audio/${uniqueFilename}`,
        fileName: file.name,
        fileSize: file.size,
        type: 'audio'
      })
    } else {
      return NextResponse.json({
        url: `/uploads/${type}/${uniqueFilename}`,
        imageUrl: `/uploads/${type}/${uniqueFilename}`,
        fileUrl: `/uploads/${type}/${uniqueFilename}`,
        fileName: file.name,
        fileSize: file.size,
        type: 'image'
      })
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}