-- PostgreSQL Database Schema for Canal del Congreso CMS
-- Execute this script in your PostgreSQL database

-- Create database (uncomment if creating a new database)
-- CREATE DATABASE canal_congreso_cms;

-- Connect to the database
-- \c canal_congreso_cms;

-- Enable UUID extension (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Live streams table
CREATE TABLE IF NOT EXISTS live_streams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    thumbnail_url TEXT,
    stream_url TEXT,
    channel VARCHAR(10),
    is_live BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content TEXT,
    image_url TEXT,
    category VARCHAR(100),
    author VARCHAR(255),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived'))
);

-- Organs table
CREATE TABLE IF NOT EXISTS organs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parliamentary groups table
CREATE TABLE IF NOT EXISTS parliamentary_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(10),
    image_url TEXT,
    color_hex VARCHAR(7), -- For party colors
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Legislators table
CREATE TABLE IF NOT EXISTS legislators (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parliamentary_group_id INTEGER REFERENCES parliamentary_groups(id) ON DELETE SET NULL,
    legislature VARCHAR(50),
    state VARCHAR(100),
    type VARCHAR(100), -- Diputado, Senador
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    status VARCHAR(20) DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo', 'Licencia')),
    image_url TEXT,
    email VARCHAR(255),
    biography TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Radio programs table
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
);

-- Radio episodes table
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
);

-- Radio podcasts table
CREATE TABLE IF NOT EXISTS radio_podcasts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    description TEXT,
    duration INTEGER, -- in seconds
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    type VARCHAR(50),
    publish_date DATE,
    publish_time TIME,
    audio_url TEXT,
    image_url TEXT,
    host VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Video news table
CREATE TABLE IF NOT EXISTS video_news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category VARCHAR(100),
    duration VARCHAR(20),
    published_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table for news and content organization
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Homepage configuration table
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
);

-- Tags table for content tagging
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for news-tags many-to-many relationship
CREATE TABLE IF NOT EXISTS news_tags (
    news_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (news_id, tag_id)
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some default categories
INSERT INTO categories (name, slug, description) VALUES
('Foros y seminarios', 'foros-y-seminarios', 'Eventos y actividades académicas'),
('Reformas aprobadas', 'reformas-aprobadas', 'Reformas legislativas aprobadas'),
('Temas de actualidad', 'temas-de-actualidad', 'Noticias y temas de interés actual'),
('Trabajo en comisiones', 'trabajo-en-comisiones', 'Actividades de las comisiones legislativas'),
('Reformas en DOF', 'reformas-en-dof', 'Reformas publicadas en el Diario Oficial'),
('Trabajos en pleno', 'trabajos-en-pleno', 'Sesiones y trabajos del pleno')
ON CONFLICT (slug) DO NOTHING;

-- Insert some default tags
INSERT INTO tags (name, slug) VALUES
('Congreso', 'congreso'),
('Senado', 'senado'),
('Diputados', 'diputados'),
('Reformas', 'reformas'),
('Transparencia', 'transparencia'),
('Participación ciudadana', 'participacion-ciudadana')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_legislators_parliamentary_group ON legislators(parliamentary_group_id);
CREATE INDEX IF NOT EXISTS idx_legislators_type ON legislators(type);
CREATE INDEX IF NOT EXISTS idx_legislators_state ON legislators(state);
CREATE INDEX IF NOT EXISTS idx_radio_programs_category ON radio_programs(category);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to tables
CREATE TRIGGER update_live_streams_updated_at BEFORE UPDATE ON live_streams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organs_updated_at BEFORE UPDATE ON organs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parliamentary_groups_updated_at BEFORE UPDATE ON parliamentary_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legislators_updated_at BEFORE UPDATE ON legislators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_radio_programs_updated_at BEFORE UPDATE ON radio_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_radio_podcasts_updated_at BEFORE UPDATE ON radio_podcasts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
-- Uncomment the following section if you want to add sample data

/*
-- Sample parliamentary groups
INSERT INTO parliamentary_groups (name, abbreviation, color_hex, description) VALUES
('Movimiento Regeneración Nacional', 'MORENA', '#8B0000', 'Partido político de México'),
('Partido Acción Nacional', 'PAN', '#0066CC', 'Partido político de México'),
('Partido Revolucionario Institucional', 'PRI', '#FF0000', 'Partido político de México'),
('Partido de la Revolución Democrática', 'PRD', '#FFD700', 'Partido político de México');

-- Sample news
INSERT INTO news (title, summary, content, category, author, published_at, status) VALUES
('Aprobación de Nueva Reforma Constitucional', 'El Congreso aprueba importante reforma en materia de transparencia', 'Contenido detallado de la noticia...', 'reformas-aprobadas', 'Redacción Canal Congreso', NOW(), 'published'),
('Sesión Extraordinaria del Senado', 'El Senado convoca a sesión extraordinaria para tratar temas urgentes', 'Contenido detallado de la noticia...', 'trabajos-en-pleno', 'Redacción Canal Congreso', NOW(), 'published');

-- Sample live streams
INSERT INTO live_streams (title, thumbnail_url, stream_url, is_live) VALUES
('Sesión en Vivo - Cámara de Diputados', '/images/live-diputados.jpg', 'https://stream.congreso.gob.mx/diputados', true),
('Sesión en Vivo - Senado de la República', '/images/live-senado.jpg', 'https://stream.congreso.gob.mx/senado', false);

-- Sample radio programs
INSERT INTO radio_programs (title, description, audio_url, duration, category, host, published_at, status) VALUES
('En la Banqueta', 'Programa de análisis político y social', '/audio/en-la-banqueta-01.mp3', '45:30', 'análisis', 'María García', NOW(), 'active'),
('Quórum', 'Programa sobre el trabajo legislativo', '/audio/quorum-01.mp3', '30:15', 'legislativo', 'Juan Pérez', NOW(), 'active');
*/

-- Grant permissions (adjust as needed for your user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_database_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_database_user;

-- Database setup complete
SELECT 'Database schema created successfully!' as message;