import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Import database pool dynamically
    const { pool } = await import('@/lib/database')

    // Check if pool is available
    if (!pool) {
      return NextResponse.json(
        { error: 'Database connection not available. Please configure database connection first.' },
        { status: 500 }
      )
    }

    // Create radio_programs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS radio_programs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        latest_episode_title VARCHAR(255),
        latest_episode_date VARCHAR(100),
        latest_episode_duration VARCHAR(50),
        latest_episode_description TEXT,
        program_link TEXT,
        episodes_link TEXT,
        category VARCHAR(100) DEFAULT 'General',
        published BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create radio_categories table  
    await pool.query(`
      CREATE TABLE IF NOT EXISTS radio_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        display_order INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create radio_episodes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS radio_episodes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        audio_url TEXT NOT NULL,
        duration VARCHAR(50),
        publish_date DATE,
        image_url TEXT,
        program_id UUID REFERENCES radio_programs(id) ON DELETE SET NULL,
        published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Insert default categories
    await pool.query(`
      INSERT INTO radio_categories (name, slug, description, image_url, display_order) VALUES
      ('Programas', 'programas', 'Todos los programas de Radio Congreso', '/images/carousel/programas.png', 1),
      ('Sitio Abierto', 'sitio-abierto', 'Programa de debate político con Javier Solórzano', '/images/carousel/sitio-abierto.png', 2),
      ('Entrevistas', 'entrevistas', 'Entrevistas exclusivas con legisladores', '/images/carousel/entrevistas.png', 3),
      ('Noticias Congreso', 'noticias-congreso', 'Noticias del Congreso de la Unión', '/images/carousel/noticias.png', 4)
      ON CONFLICT (name) DO NOTHING
    `)

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_radio_programs_category ON radio_programs(category);
      CREATE INDEX IF NOT EXISTS idx_radio_programs_published ON radio_programs(published);
      CREATE INDEX IF NOT EXISTS idx_radio_episodes_category ON radio_episodes(category);
      CREATE INDEX IF NOT EXISTS idx_radio_episodes_published ON radio_episodes(published);
      CREATE INDEX IF NOT EXISTS idx_radio_episodes_publish_date ON radio_episodes(publish_date);
    `)

    // Insert sample programs
    await pool.query(`
      INSERT INTO radio_programs (
        title, description, image_url, latest_episode_title, 
        latest_episode_date, latest_episode_duration, latest_episode_description,
        program_link, episodes_link, category, display_order
      ) VALUES 
      (
        'SITIO ABIERTO',
        'Programa de debate político con Javier Solórzano',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/01%20Imagen%20SA-zwZUP6ym2k7eEcC5VtKXiHO55JCA44.png',
        'PAQUETE DE REFORMAS DE LA PRESIDENTA PARA ATENDER EL PROBLEMA DE DESAPARICIONES',
        'martes, 25 de marzo de 2025',
        '60MIN',
        'Hoy en #SitioAbierto con Javier Solórzano, contamos la participación de la Senadora Margarita Valdez Martínez de MORENA, el Diputado Ricardo Mejía Berdeja del PT y de la Diputada Ana Isabel González González del PRI para hablar de: PAQUETE DE REFORMAS DE LA PRESIDENTA PARA ATENDER EL PROBLEMA DE DESAPARICIONES.',
        '/radio/sitio-abierto',
        '/radio/sitio-abierto/episodios',
        'Sitio Abierto',
        1
      ),
      (
        'APUNTES PARLAMENTARIOS',
        'Análisis parlamentario y legislativo',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/01%20Imagen%20AP-htppQHmOt7rgJN5E4KsVlXhUVfrDGN.png',
        'Declaratoria de emergencia nacional en la frontera sur',
        'miércoles, 22 de enero de 2025',
        '35MIN',
        'Noticias del Congreso #Radio La diputada Graciela Ortiz nos habló de la declaratoria de emergencia nacional en la frontera sur de Estados Unidos hecha por el presidente Donald Trump y platicamos del llamado del Congreso de la Unión a la unidad nacional ante las medidas anunciadas contra México',
        '/radio/apuntes-parlamentarios',
        '/radio/apuntes-parlamentarios/episodios',
        'Programas',
        2
      )
      ON CONFLICT DO NOTHING
    `)

    console.log('Radio database tables created successfully')

    return NextResponse.json({ 
      success: true, 
      message: 'Radio database tables created successfully' 
    })
  } catch (error) {
    console.error('Error initializing radio database:', error)
    return NextResponse.json(
      { error: 'Failed to initialize radio database' },
      { status: 500 }
    )
  }
}