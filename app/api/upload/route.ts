import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, normalize, sep } from 'path'
import { randomUUID } from 'crypto'

// Simple magic byte detection for common file types
function detectFileType(buffer: Buffer): string | null {
  // Check magic bytes for common file types
  if (buffer.length >= 4) {
    // PDF
    if (buffer.subarray(0, 4).toString() === '%PDF') {
      return 'application/pdf'
    }
    
    // PNG
    if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))) {
      return 'image/png'
    }
    
    // JPEG
    if (buffer.subarray(0, 3).equals(Buffer.from([0xFF, 0xD8, 0xFF]))) {
      return 'image/jpeg'
    }
    
    // GIF
    if (buffer.subarray(0, 6).toString() === 'GIF87a' || buffer.subarray(0, 6).toString() === 'GIF89a') {
      return 'image/gif'
    }
    
    // WebP
    if (buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP') {
      return 'image/webp'
    }
    
    // MP3
    if (buffer.subarray(0, 3).equals(Buffer.from([0xFF, 0xFB, 0x90])) || 
        buffer.subarray(0, 3).toString() === 'ID3') {
      return 'audio/mpeg'
    }
    
    // DOCX (ZIP format with specific content)
    if (buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4B, 0x03, 0x04]))) {
      // This is a ZIP file, could be DOCX - need deeper inspection
      try {
        const content = buffer.toString('utf8', 0, Math.min(buffer.length, 1000))
        if (content.includes('word/') || content.includes('docProps/') || 
            content.includes('wordprocessingml') || content.includes('application/vnd.openxmlformats')) {
          return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      } catch (e) {
        // If UTF-8 conversion fails, check filename extension as fallback
        // This will be handled by the caller
      }
    }
    
    // DOC (older format - OLE2 compound document)
    if (buffer.subarray(0, 8).equals(Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]))) {
      return 'application/msword'
    }
  }
  
  return null
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const rawType = formData.get('type') as string || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Whitelist allowed upload types to prevent path injection
    const allowedUploadTypes = ['general', 'news', 'radio', 'programs', 'organs', 'defensoria', 'documents']
    const type = allowedUploadTypes.includes(rawType) ? rawType : 'general'

    // Server-side file type detection based on file content (magic bytes)
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    let detectedType = detectFileType(fileBuffer)
    
    // Fallback: if magic byte detection fails, use file extension
    if (!detectedType) {
      const fileName = file.name.toLowerCase()
      if (fileName.endsWith('.docx')) {
        detectedType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      } else if (fileName.endsWith('.doc')) {
        detectedType = 'application/msword'
      } else if (fileName.endsWith('.pdf')) {
        detectedType = 'application/pdf'
      } else if (fileName.endsWith('.mp3')) {
        detectedType = 'audio/mpeg'
      } else if (fileName.endsWith('.png')) {
        detectedType = 'image/png'
      } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
        detectedType = 'image/jpeg'
      }
    }
    
    if (!detectedType) {
      return NextResponse.json({ error: 'Unable to determine file type. Please ensure the file is a valid PDF, Word document, image, or audio file.' }, { status: 400 })
    }

    const isAudio = detectedType.startsWith('audio/')
    const isDocument = detectedType === 'application/pdf' || 
                      detectedType === 'application/msword' ||
                      detectedType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    const isImage = detectedType.startsWith('image/')
    
    let maxSize: number
    if (isAudio) {
      maxSize = 500 * 1024 * 1024 // 500MB for audio
    } else if (isDocument) {
      maxSize = 50 * 1024 * 1024 // 50MB for documents
    } else {
      maxSize = 10 * 1024 * 1024 // 10MB for images
    }
    
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` 
      }, { status: 400 })
    }

    // Validate detected file type against whitelist
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'audio/mpeg', 'audio/mp3', 'audio/mpeg3',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(detectedType)) {
      return NextResponse.json({ 
        error: 'Invalid file type detected. Allowed: JPEG, PNG, GIF, WebP, MP3, PDF, DOC, DOCX' 
      }, { status: 400 })
    }

    // Generate unique filename with extension based on detected type
    const extensionMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'audio/mpeg': 'mp3',
      'audio/mp3': 'mp3',
      'audio/mpeg3': 'mp3',
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
    }
    
    const fileExtension = extensionMap[detectedType] || 'bin'
    const uniqueFilename = `${randomUUID()}.${fileExtension}`

    // Define upload path based on type with security bounds checking
    const baseUploadDir = join(process.cwd(), 'public', 'uploads')
    let uploadDir: string
    
    if (isAudio || file.name.toLowerCase().endsWith('.mp3')) {
      uploadDir = join(baseUploadDir, 'audio')
    } else if (isDocument) {
      uploadDir = join(baseUploadDir, 'documents')
    } else {
      uploadDir = join(baseUploadDir, type)
    }

    // Ensure the upload directory is within the expected bounds
    const normalizedUploadDir = normalize(uploadDir)
    if (!normalizedUploadDir.startsWith(baseUploadDir + sep) && normalizedUploadDir !== baseUploadDir) {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 })
    }

    const filePath = join(normalizedUploadDir, uniqueFilename)

    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true })

    // Write file to local storage (using already read buffer)
    await writeFile(filePath, fileBuffer)

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
    } else if (isDocument) {
      return NextResponse.json({
        url: `/uploads/documents/${uniqueFilename}`,
        documentUrl: `/uploads/documents/${uniqueFilename}`,
        fileUrl: `/uploads/documents/${uniqueFilename}`,
        fileName: file.name,
        fileSize: file.size,
        type: 'document'
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