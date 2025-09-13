
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getLiveStreamsFromDB, createLiveStreamInDB, updateLiveStreamInDB, deleteLiveStreamFromDB } from '@/lib/api-database'

export async function GET() {
  try {
    const liveStreams = await getLiveStreamsFromDB()
    console.log('API: Live streams fetched from DB:', liveStreams.length, 'items')

    return new Response(JSON.stringify(Array.isArray(liveStreams) ? liveStreams : []), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': new Date().toUTCString(),
        'Vary': 'Accept-Encoding',
      }
    })
  } catch (error) {
    console.error('Error fetching live streams:', error)
    // Return empty array if database fails, let client handle fallback
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, thumbnailUrl, streamUrl, channel, isLive, status } = body

    if (!title || !streamUrl) {
      return NextResponse.json(
        { error: 'Título y URL de transmisión son requeridos' },
        { status: 400 }
      )
    }

    const newStream = await createLiveStreamInDB({
      title,
      thumbnailUrl: thumbnailUrl || '',
      streamUrl,
      channel: channel || '',
      isLive: isLive || false,
      status: status || 'offline'
    })

    return NextResponse.json(newStream, { status: 201 })
  } catch (error) {
    console.error('Error creating live stream:', error)
    return NextResponse.json(
      { error: 'Error al crear la transmisión' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de transmisión requerido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    console.log('PUT request body:', body)
    console.log('Stream ID:', id)
    
    const { title, thumbnailUrl, streamUrl, channel, isLive, status } = body

    // For status-only updates, we don't need title and streamUrl
    const isStatusOnlyUpdate = !title && !streamUrl && status
    
    if (!isStatusOnlyUpdate && (!title || !streamUrl)) {
      return NextResponse.json(
        { error: 'Título y URL de transmisión son requeridos para actualizaciones completas' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    
    if (title) updateData.title = title
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl
    if (streamUrl) updateData.streamUrl = streamUrl
    if (channel !== undefined) updateData.channel = channel
    if (isLive !== undefined) updateData.isLive = Boolean(isLive)
    if (status) updateData.status = status

    console.log('Updating stream with data:', updateData)

    const updatedStream = await updateLiveStreamInDB(id, updateData)

    if (!updatedStream) {
      return NextResponse.json(
        { error: 'Transmisión no encontrada' },
        { status: 404 }
      )
    }

    console.log('Stream updated successfully:', updatedStream)
    return NextResponse.json(updatedStream)
  } catch (error) {
    console.error('Error updating live stream:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      { error: `Error al actualizar la transmisión: ${errorMessage}` },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de transmisión requerido' },
        { status: 400 }
      )
    }

    const deleted = await deleteLiveStreamFromDB(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Transmisión no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Transmisión eliminada correctamente' })
  } catch (error) {
    console.error('Error deleting live stream:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la transmisión' },
      { status: 500 }
    )
  }
}
