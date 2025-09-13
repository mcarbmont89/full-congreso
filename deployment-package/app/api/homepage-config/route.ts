
import { NextResponse } from 'next/server'
import { getHomepageConfigFromDB, createHomepageConfigInDB, updateHomepageConfigInDB } from '@/lib/api-database'

export async function GET() {
  try {
    const config = await getHomepageConfigFromDB()
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching homepage config:', error)
    return NextResponse.json({ error: 'Failed to fetch homepage config' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('API: Creating homepage config with data:', JSON.stringify(data, null, 2))
    
    // Validate required fields
    if (!data.section) {
      return NextResponse.json({ 
        error: 'Section is required' 
      }, { status: 400 })
    }
    
    const config = await createHomepageConfigInDB(data)
    console.log('API: Created config:', JSON.stringify(config, null, 2))
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error creating homepage config:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json({ 
      error: 'Failed to create homepage config', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { section, ...data } = await request.json()
    console.log('API: Updating homepage config for section:', section)
    console.log('API: Update data:', JSON.stringify(data, null, 2))
    
    // Validate required fields
    if (!section) {
      return NextResponse.json({ 
        error: 'Section is required' 
      }, { status: 400 })
    }
    
    const config = await updateHomepageConfigInDB(section, data)
    
    if (!config) {
      console.log('API: No config found for section:', section)
      return NextResponse.json({ error: 'Homepage config not found' }, { status: 404 })
    }
    
    console.log('API: Updated config:', JSON.stringify(config, null, 2))
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error updating homepage config:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json({ 
      error: 'Failed to update homepage config', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
