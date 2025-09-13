import { NextRequest, NextResponse } from 'next/server'
import { updateRadioProgram, deleteRadioProgram } from '@/lib/api'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const id = params.id
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const updatedProgram = await updateRadioProgram(id, data)

    if (!updatedProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedProgram)
  } catch (error) {
    console.error('Error updating radio program:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to update radio program: ${errorMessage}` },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params
    const data = await request.json()

    console.log('Patching radio program:', id, 'with data:', data)

    const updatedProgram = await updateRadioProgram(id, data)

    if (!updatedProgram) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    return NextResponse.json(updatedProgram)
  } catch (error) {
    console.error('Error updating radio program:', error)
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const id = params.id

    const result = await deleteRadioProgram(id)

    if (!result) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting radio program:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to delete radio program: ${errorMessage}` },
      { status: 500 }
    )
  }
}