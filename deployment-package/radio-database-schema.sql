
-- Radio Programs Table
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
);

-- Radio Categories Table  
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
);

-- Radio Episodes Table
CREATE TABLE IF NOT EXISTS radio_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  duration VARCHAR(50),
  publish_date DATE,
  image_url TEXT,
  program_id UUID REFERENCES radio_programs(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default categories
INSERT INTO radio_categories (name, slug, description, image_url, display_order) VALUES
('Programas', 'programas', 'Todos los programas de Radio Congreso', '/images/carousel/programas.png', 1),
('Sitio Abierto', 'sitio-abierto', 'Programa de debate político con Javier Solórzano', '/images/carousel/sitio-abierto.png', 2),
('Entrevistas', 'entrevistas', 'Entrevistas exclusivas con legisladores', '/images/carousel/entrevistas.png', 3),
('Noticias Congreso', 'noticias-congreso', 'Noticias del Congreso de la Unión', '/images/carousel/noticias.png', 4)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_radio_programs_category ON radio_programs(category);
CREATE INDEX IF NOT EXISTS idx_radio_programs_published ON radio_programs(published);
CREATE INDEX IF NOT EXISTS idx_radio_episodes_published ON radio_episodes(published);
CREATE INDEX IF NOT EXISTS idx_radio_episodes_publish_date ON radio_episodes(publish_date);e);
