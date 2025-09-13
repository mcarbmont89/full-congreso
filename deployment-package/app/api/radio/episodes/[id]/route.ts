import { NextRequest, NextResponse } from 'next/server'
import { getRadioEpisodes } from '@/lib/api'
import { getDB } from '@/lib/database-env'

// Using database only - no mock data

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const episodes = await getRadioEpisodes()
    const episode = episodes.find(ep => ep.id === id)

    if (!episode) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 })
    }

    return NextResponse.json(episode)
  } catch (error) {
    console.error('Error fetching radio episode:', error)
    return NextResponse.json({ error: 'Failed to fetch radio episode' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const pool = getDB()

    const result = await pool.query(`
      UPDATE radio_episodes 
      SET title = $1, description = $2, audio_url = $3, duration = $4, 
          publish_date = $5, image_url = $6, program_id = $7, published = $8, updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `, [
      data.title,
      data.description, 
      data.audioUrl,
      data.duration,
      data.publishDate,
      data.imageUrl,
      data.programId,
      data.published !== false,
      id
    ])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating episode:', error)
    return NextResponse.json({ error: 'Failed to update episode' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Episode ID is required' }, { status: 400 })
    }

    const { deleteRadioEpisode } = await import('@/lib/api')
    const deletedEpisode = await deleteRadioEpisode(id)

    if (!deletedEpisode) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 })
    }

    console.log(`Successfully deleted episode: ${deletedEpisode.title} (ID: ${id})`)

    return NextResponse.json({ 
      success: true, 
      message: 'Episode deleted successfully',
      deletedEpisode: { id: deletedEpisode.id, title: deletedEpisode.title }
    })
  } catch (error) {
    console.error('Error deleting radio episode:', error)
    return NextResponse.json({ 
      error: 'Failed to delete radio episode',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}