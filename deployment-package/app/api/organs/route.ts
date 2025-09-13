
import { NextRequest, NextResponse } from 'next/server'
import { getOrgans, createOrganInDB } from '@/lib/api-database'

export async function GET() {
  try {
    const organs = await getOrgans()
    return NextResponse.json(organs)
  } catch (error) {
    console.error('Error fetching organs:', error)
    return NextResponse.json({ error: 'Failed to fetch organs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const newOrgan = await createOrganInDB(data)
    return NextResponse.json(newOrgan, { status: 201 })
  } catch (error) {
    console.error('Error creating organ:', error)
    return NextResponse.json({ error: 'Failed to create organ' }, { status: 500 })
  }
}
