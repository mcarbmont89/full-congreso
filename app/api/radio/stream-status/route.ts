
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get current config
    const configResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/radio/live-config`)
    const config = await configResponse.json()
    
    // In a real implementation, you would check the actual stream status
    // For now, we'll simulate the check
    const isValidUrl = config.streamUrl && config.streamUrl.includes('.m3u8')
    
    if (isValidUrl) {
      // Simulate checking stream availability
      // In production, you might use a service like FFprobe or make a HEAD request
      const status = {
        connected: config.isLive,
        listeners: Math.floor(Math.random() * 500) + 50, // Simulated listener count
        quality: config.quality,
        uptime: "2h 15m",
        bitrate: config.quality === 'high' ? '320kbps' : config.quality === 'medium' ? '128kbps' : '64kbps'
      }
      
      return NextResponse.json(status)
    } else {
      return NextResponse.json({
        connected: false,
        error: 'Invalid stream URL'
      })
    }
  } catch (error) {
    console.error('Error checking stream status:', error)
    return NextResponse.json({
      connected: false,
      error: 'Unable to check stream status'
    }, { status: 500 })
  }
}
