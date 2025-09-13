
import { NextResponse } from 'next/server'
import { createDatabaseConnectionFromEnv } from '@/lib/database-env'

export async function POST() {
  try {
    const pool = createDatabaseConnectionFromEnv()

    // Create radio_programs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS radio_programs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        audio_url TEXT,
        duration VARCHAR(20),
        category VARCHAR(50),
        host VARCHAR(255),
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived'))
      )
    `)

    // Create radio_episodes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS radio_episodes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        audio_url TEXT NOT NULL,
        duration VARCHAR(50),
        publish_date DATE,
        image_url TEXT,
        program_id INTEGER REFERENCES radio_programs(id) ON DELETE CASCADE,
        published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create parliamentary_groups table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS parliamentary_groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        abbreviation VARCHAR(10),
        image_url TEXT,
        color_hex VARCHAR(7),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create legislators table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS legislators (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        parliamentary_group_id INTEGER REFERENCES parliamentary_groups(id) ON DELETE SET NULL,
        legislature VARCHAR(50),
        state VARCHAR(100),
        type VARCHAR(100),
        gender CHAR(1) CHECK (gender IN ('M', 'F')),
        status VARCHAR(20) DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo', 'Licencia')),
        image_url TEXT,
        email VARCHAR(255),
        biography TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create tags table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create news_tags junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS news_tags (
        news_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
        tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (news_id, tag_id)
      )
    `)

    // Create contact_messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create homepage_config table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS homepage_config (
        id SERIAL PRIMARY KEY,
        section VARCHAR(255) NOT NULL UNIQUE,
        title VARCHAR(255),
        description TEXT,
        background_image_url TEXT,
        hero_image_url TEXT,
        logo_url TEXT,
        additional_images JSONB,
        config_data JSONB,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Insert default categories
    await pool.query(`
      INSERT INTO categories (name, slug, description) VALUES
      ('Foros y seminarios', 'foros-y-seminarios', 'Eventos y actividades académicas'),
      ('Reformas aprobadas', 'reformas-aprobadas', 'Reformas legislativas aprobadas'),
      ('Temas de actualidad', 'temas-de-actualidad', 'Noticias y temas de interés actual'),
      ('Trabajo en comisiones', 'trabajo-en-comisiones', 'Actividades de las comisiones legislativas'),
      ('Reformas en DOF', 'reformas-en-dof', 'Reformas publicadas en el Diario Oficial'),
      ('Trabajos en pleno', 'trabajos-en-pleno', 'Sesiones y trabajos del pleno')
      ON CONFLICT (slug) DO NOTHING
    `)

    // Insert default tags
    await pool.query(`
      INSERT INTO tags (name, slug) VALUES
      ('Congreso', 'congreso'),
      ('Senado', 'senado'),
      ('Diputados', 'diputados'),
      ('Reformas', 'reformas'),
      ('Transparencia', 'transparencia'),
      ('Participación ciudadana', 'participacion-ciudadana')
      ON CONFLICT (slug) DO NOTHING
    `)

    // Verify tables were created
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    
    const createdTables = tablesResult.rows.map(row => row.table_name)
    
    await pool.end()

    return NextResponse.json({ 
      message: 'All missing database tables created successfully',
      tables: createdTables
    })
  } catch (error) {
    console.error('Error creating missing tables:', error)
    return NextResponse.json(
      { error: 'Failed to create missing tables', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
