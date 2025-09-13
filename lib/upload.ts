
"use server"

import { writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function uploadImage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File

  if (!file) {
    throw new Error("No se proporcionó ningún archivo")
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error("El archivo debe ser una imagen")
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("El archivo no puede ser mayor a 5MB")
  }

  try {
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const uniqueFilename = `${randomUUID()}.${fileExtension}`
    
    // Define upload path in public directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'programs')
    const filePath = join(uploadDir, uniqueFilename)

    // Create directory if it doesn't exist
    const { mkdir } = await import('fs/promises')
    await mkdir(uploadDir, { recursive: true })

    // Write file to local storage
    await writeFile(filePath, buffer)

    // Return the public URL path
    return `/uploads/programs/${uniqueFilename}`
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error("Error al subir el archivo")
  }
}
