
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { streamUrl } = await request.json()
    
    if (!streamUrl) {
      return NextResponse.json({
        success: false,
        message: 'URL de stream requerida'
      })
    }
    
    // Basic URL validation
    if (!streamUrl.includes('.m3u8')) {
      return NextResponse.json({
        success: false,
        message: 'URL debe ser un archivo .m3u8 para HLS'
      })
    }
    
    try {
      // Make a HEAD request to test if the stream is accessible
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(streamUrl, {
        method: 'HEAD',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Stream URL es accesible y válida',
          details: {
            status: response.status,
            contentType: response.headers.get('content-type'),
            server: response.headers.get('server')
          }
        })
      } else {
        return NextResponse.json({
          success: false,
          message: `Stream no accesible: ${response.status} ${response.statusText}`
        })
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          message: 'Timeout: No se pudo conectar al stream en 10 segundos'
        })
      }
      
      return NextResponse.json({
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    }
  } catch (error) {
    console.error('Error testing stream:', error)
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}
