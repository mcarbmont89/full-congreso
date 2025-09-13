
import { NextRequest, NextResponse } from 'next/server'
import { getProgramsFromDB, createProgramInDB } from '@/lib/api-database'

export async function GET() {
  try {
    const programs = await getProgramsFromDB()
    return NextResponse.json(programs)
  } catch (error) {
    console.error('Error fetching programs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const program = await createProgramInDB(data)
    return NextResponse.json(program)
  } catch (error) {
    console.error('Error creating program:', error)
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    )
  }
}
