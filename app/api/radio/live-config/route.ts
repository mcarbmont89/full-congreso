
import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for live radio configuration
let liveRadioConfig = {
  streamUrl: "https://ccstreaming.packet.mx/LiveApp/streams/Radio_kd5oiNTTWO0gEOFc23dr762145.m3u8",
  isLive: false,
  currentProgram: "Transmisión en vivo",
  description: "Escuche la señal en vivo de Radio Congreso",
  listeners: 0,
  quality: 'high' as const,
  fallbackUrl: "",
  enableAutoReconnect: true,
  maxRetries: 3
}

export async function GET() {
  try {
    return NextResponse.json(liveRadioConfig)
  } catch (error) {
    console.error('Error fetching live radio config:', error)
    return NextResponse.json({ error: 'Failed to fetch live radio config' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Update configuration
    liveRadioConfig = {
      ...liveRadioConfig,
      ...data,
      // Ensure listeners is always a number
      listeners: typeof data.listeners === 'number' ? data.listeners : liveRadioConfig.listeners
    }
    
    return NextResponse.json(liveRadioConfig)
  } catch (error) {
    console.error('Error updating live radio config:', error)
    return NextResponse.json({ error: 'Failed to update live radio config' }, { status: 500 })
  }
}
