
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    const { isLive } = await request.json()
    
    // Get current config
    const configResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/radio/live-config`)
    const currentConfig = await configResponse.json()
    
    // Update the live status
    const updatedConfig = {
      ...currentConfig,
      isLive: Boolean(isLive)
    }
    
    // Save the updated config
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/radio/live-config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedConfig)
    })
    
    return NextResponse.json({ success: true, isLive: updatedConfig.isLive })
  } catch (error) {
    console.error('Error updating live status:', error)
    return NextResponse.json({ error: 'Failed to update live status' }, { status: 500 })
  }
}
