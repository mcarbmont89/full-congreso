
import { NextRequest, NextResponse } from 'next/server'

// In-memory storage - will be replaced with database in production
let inMemoryData: { [key: string]: any[] } = {
  '45.1': [
    {
      hora: '06:00',
      programa: 'Noticias del Congreso',
      descripcion: 'Resumen informativo matutino'
    },
    {
      hora: '07:00',
      programa: 'Mesa de Análisis',
      descripcion: 'Debate sobre reformas aprobadas'
    },
    {
      hora: '09:00',
      programa: 'Sesión del Pleno',
      descripcion: 'Transmisión en directo'
    }
  ],
  '45.2': [
    {
      hora: '08:00',
      programa: 'Documentales',
      descripcion: 'Historia legislativa'
    },
    {
      hora: '10:00',
      programa: 'Entrevistas',
      descripcion: 'Con legisladores destacados'
    }
  ],
  '45.3': [
    {
      hora: '09:00',
      programa: 'Comisiones en Sesión',
      descripcion: 'Trabajo en comisiones'
    },
    {
      hora: '12:00',
      programa: 'Voz Ciudadana',
      descripcion: 'Participación ciudadana'
    }
  ]
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const channel = searchParams.get('channel')
  const date = searchParams.get('date')
  
  if (channel) {
    return NextResponse.json({
      channel,
      date: date || new Date().toISOString().split('T')[0],
      programs: inMemoryData[channel] || []
    })
  }
  
  return NextResponse.json({
    channels: Object.keys(inMemoryData),
    date: date || new Date().toISOString().split('T')[0],
    data: inMemoryData
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (body.action === 'update_from_excel') {
      // Update programming data from Excel upload
      inMemoryData = { ...inMemoryData, ...body.data }
      console.log('Programming data updated with channels:', Object.keys(inMemoryData))
      
      return NextResponse.json({ 
        message: 'Programming data updated successfully',
        channels: Object.keys(inMemoryData)
      })
    }
    
    if (body.action === 'clear_data') {
      // Clear all programming data
      inMemoryData = {}
      console.log('Programming data cleared')
      
      return NextResponse.json({ 
        message: 'Programming data cleared successfully'
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating programming:', error)
    return NextResponse.json({ error: 'Failed to update programming' }, { status: 500 })
  }
}
