import { NextRequest, NextResponse } from 'next/server'

// No mock data - using database only

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get('programId')
    const program = searchParams.get('program')

    const { getRadioEpisodes, getRadioPrograms } = await import('@/lib/api')

    // If we have a programId, use it directly (but check it's not undefined)
    if (programId && programId !== 'undefined' && programId !== 'null') {
      console.log('Fetching episodes for programId:', programId)
      
      // Directly fetch episodes without program verification for now
      const episodes = await getRadioEpisodes(programId)
      console.log('Episodes found:', episodes?.length || 0)
      
      // Map episodes with proper field names
      const mappedEpisodes = (episodes || []).map((episode: any) => ({
        id: episode.id,
        title: episode.title,
        description: episode.description,
        audio_url: episode.audioUrl || episode.audio_url,
        published_date: episode.publishDate || episode.published_date || episode.publish_date,
        duration: episode.duration,
        image_url: episode.imageUrl || episode.image_url,
        program_id: episode.programId || episode.program_id,
        programImageUrl: episode.programImageUrl
      }))
      
      return NextResponse.json(mappedEpisodes)
    }

    // If we have a program name, we need to find the program ID first
    if (program) {
      const programs = await getRadioPrograms()
      const matchingProgram = programs.find((p: any) => p.title === program)

      if (matchingProgram) {
        const episodes = await getRadioEpisodes(matchingProgram.id)
        return NextResponse.json(episodes || [])
      }
    }

    // Return all episodes if no filter
    const episodes = await getRadioEpisodes()
    return NextResponse.json(episodes || [])
  } catch (error) {
    console.error('Error fetching radio episodes:', error)
    return NextResponse.json({ error: 'Failed to fetch episodes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const { createRadioEpisode } = await import('@/lib/api')
    const newEpisode = await createRadioEpisode(data)

    return NextResponse.json(newEpisode, { status: 201 })
  } catch (error) {
    console.error('Error creating radio episode:', error)
    return NextResponse.json({ error: 'Failed to create radio episode' }, { status: 500 })
  }
}