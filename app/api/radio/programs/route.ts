import { NextResponse, NextRequest } from 'next/server'
import { getRadioPrograms, createRadioProgram } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    const { getRadioPrograms } = await import('@/lib/api')
    const programs = await getRadioPrograms()

    if (slug) {
      // Convert program title to slug format for matching
      const programSlug = (title: string) => 
        title.toLowerCase()
          .replace(/[áàäâ]/g, 'a')
          .replace(/[éèëê]/g, 'e')
          .replace(/[íìïî]/g, 'i')
          .replace(/[óòöô]/g, 'o')
          .replace(/[úùüû]/g, 'u')
          .replace(/ñ/g, 'n')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()

      const matchingProgram = programs.find((program: any) => 
        programSlug(program.title) === slug
      )

      if (!matchingProgram) {
        return NextResponse.json({ error: 'Program not found' }, { status: 404 })
      }

      // Add additional program information for better matching
      const enrichedProgram = {
        ...matchingProgram,
        slug: programSlug(matchingProgram.title),
        name: matchingProgram.title, // Add name field for compatibility
        description: matchingProgram.description || '',
        image_url: matchingProgram.imageUrl,
        category: matchingProgram.category || 'General'
      }

      return NextResponse.json(enrichedProgram)
    }

    return NextResponse.json(programs)
  } catch (error) {
    console.error('Error fetching radio programs:', error)
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const newProgram = await createRadioProgram(data)
    return NextResponse.json(newProgram, { status: 201 })
  } catch (error) {
    console.error('Error creating radio program:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to create radio program: ${errorMessage}` },
      { status: 500 }
    )
  }
}