
import { NextRequest, NextResponse } from 'next/server'
import { getParliamentaryGroupsFromDB, createParliamentaryGroupInDB } from '@/lib/api-database'
import { getParliamentaryGroups, createParliamentaryGroup } from '@/lib/api'

export async function GET() {
  try {
    // Try database first, fallback to mock data
    if (typeof window === 'undefined') {
      try {
        const dbGroups = await getParliamentaryGroupsFromDB()
        return NextResponse.json(dbGroups)
      } catch (error) {
        console.error('Failed to fetch from database, using mock data:', error)
        const mockGroups = await getParliamentaryGroups()
        return NextResponse.json(mockGroups)
      }
    } else {
      const mockGroups = await getParliamentaryGroups()
      return NextResponse.json(mockGroups)
    }
  } catch (error) {
    console.error('Error fetching parliamentary groups:', error)
    return NextResponse.json({ error: 'Failed to fetch parliamentary groups' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Try database first, fallback to mock data
    if (typeof window === 'undefined') {
      try {
        const newGroup = await createParliamentaryGroupInDB(data)
        return NextResponse.json(newGroup, { status: 201 })
      } catch (error) {
        console.error('Failed to create in database, using mock data:', error)
        const newGroup = await createParliamentaryGroup(data)
        return NextResponse.json(newGroup, { status: 201 })
      }
    } else {
      const newGroup = await createParliamentaryGroup(data)
      return NextResponse.json(newGroup, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating parliamentary group:', error)
    return NextResponse.json({ error: 'Failed to create parliamentary group' }, { status: 500 })
  }
}
