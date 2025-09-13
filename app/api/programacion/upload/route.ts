import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Dynamic import of xlsx to avoid module resolution issues
    const XLSX = await import('xlsx')

    const formData = await request.formData()
    const file = formData.get('excel') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload an Excel file.' }, { status: 400 })
    }

    // Read the Excel file
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })

    // Process each sheet (channel)
    const channels = ['45.1', '45.2', '45.3']
    const programData: { [key: string]: any[] } = {}

    workbook.SheetNames.forEach((sheetName, index) => {
      console.log(`Processing sheet: ${sheetName}`)

      const worksheet = workbook.Sheets[sheetName]

      // Use sheet_to_json with header: 1 to get raw arrays
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      console.log(`Raw data for ${sheetName}:`, rawData.slice(0, 3)) // Log first 3 rows

      if (rawData.length === 0) {
        programData[channels[index] || sheetName] = []
        return
      }

      // Skip the header row and look for actual data
      // The Excel appears to have the format: Time | Empty | Program | Duration | etc.
      let dataStartRow = 1 // Start from row 1 (0-indexed)

      const programs = []

      // Helper function to convert decimal time to HH:MM format
      const convertDecimalToTime = (decimal: number): string => {
        const totalMinutes = Math.round(decimal * 24 * 60)
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      }

      // Process data rows starting from dataStartRow
      for (let i = dataStartRow; i < rawData.length; i++) {
        const row = rawData[i] as any[]

        // Skip completely empty rows
        if (!row || row.every(cell => !cell || String(cell).trim() === '')) {
          continue
        }

        // Skip rows where the first column (time/hour) is empty
        const timeValue = row[0]
        if (!timeValue || String(timeValue).trim() === '') {
          console.log(`Skipping row ${i + 1} - empty time column`)
          continue
        }

        // Convert time value
        let formattedTime = ''
        if (typeof timeValue === 'number' && timeValue > 0 && timeValue < 1) {
          // It's a decimal representing time (e.g., 0.25 = 6:00 AM)
          formattedTime = convertDecimalToTime(timeValue)
        } else {
          formattedTime = String(timeValue).trim()
        }

        // Extract program name and description from the row
        // Based on the structure: Time | Empty | Program | Duration | Origin | Cassette | Classification
        const programName = row[2] ? String(row[2]).trim() : ''
        const duration = row[3] ? String(row[3]).trim() : ''
        const origin = row[4] ? String(row[4]).trim() : ''

        // Only add programs that have actual content
        if (programName && programName !== '' && !programName.includes('PROGRAMACIÓN')) {
          const program = {
            hora: formattedTime,
            programa: programName,
            descripcion: origin || 'Sin descripción',
            duracion: duration
          }

          programs.push(program)
          console.log(`Added program: ${formattedTime} - ${programName}`)
        }
      }

      console.log(`Processed ${programs.length} programs for ${sheetName}`)
      programData[channels[index] || sheetName] = programs
    })

    console.log('Final processed data:', Object.keys(programData).map(key => ({
      channel: key,
      programCount: programData[key].length,
      sampleProgram: programData[key][0]
    })))

    return NextResponse.json({ 
      message: 'Excel processed successfully',
      data: programData,
      sheets: workbook.SheetNames,
      summary: Object.keys(programData).map(key => ({
        channel: key,
        programCount: programData[key].length
      }))
    })

  } catch (error) {
    console.error('Error processing Excel:', error)
    return NextResponse.json({ 
      error: 'Failed to process Excel file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}