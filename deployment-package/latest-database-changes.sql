
-- Latest Database Changes for Canal del Congreso CMS
-- Generated: 2025-08-06
-- Apply these changes to update from previous versions

-- Create radio_config table if it doesn't exist
CREATE TABLE IF NOT EXISTS radio_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(255) NOT NULL UNIQUE,
    config_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create radio_categories table if it doesn't exist  
CREATE TABLE IF NOT EXISTS radio_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    image VARCHAR(255),
    link VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create radio_navigation table if it doesn't exist
CREATE TABLE IF NOT EXISTS radio_navigation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    href VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add missing columns to existing tables
DO $$ 
BEGIN
    -- Add status column to live_streams if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='live_streams' AND column_name='status') THEN
        ALTER TABLE live_streams ADD COLUMN status VARCHAR(20) DEFAULT 'live';
    END IF;

    -- Add channel column to live_streams if it doesn't exist  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='live_streams' AND column_name='channel') THEN
        ALTER TABLE live_streams ADD COLUMN channel VARCHAR(10);
    END IF;

    -- Ensure carousel property exists in radio_config
    INSERT INTO radio_config (config_key, config_data)
    VALUES ('general', '{"carousel": []}')
    ON CONFLICT (config_key) DO NOTHING;

END $$;

-- Insert default radio navigation items
INSERT INTO radio_navigation (name, href, display_order) VALUES
('Un programa', '/radio', 1),
('Toma de tribuna', '/radio/toma-tribuna', 2),
('Noticias del Congreso', '/radio/noticias-congreso', 3)
ON CONFLICT (href) DO NOTHING;

-- Insert default radio categories
INSERT INTO radio_categories (id, title, slug, image, link, display_order) VALUES
('86af7d79-01df-4525-a916-3a206a3ca37b', 'Mi Radio', 'mi-radio', '/uploads/radio-categories/232eab0c-d9b1-4e51-86db-f07c01aeb9df.png', '/radio/mi-radio', 1),
('932f514c-a7d2-45b6-9014-b70548839378', 'Novedades', 'novedades', '/uploads/radio-categories/878d2aa7-9df9-4748-ad18-c98c2b5675af.png', '/radio/novedades', 2)
ON CONFLICT (id) DO NOTHING;

-- Create updated_at triggers for new tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_radio_config_updated_at ON radio_config;
CREATE TRIGGER update_radio_config_updated_at BEFORE UPDATE ON radio_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_radio_categories_updated_at ON radio_categories;
CREATE TRIGGER update_radio_categories_updated_at BEFORE UPDATE ON radio_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_radio_navigation_updated_at ON radio_navigation;
CREATE TRIGGER update_radio_navigation_updated_at BEFORE UPDATE ON radio_navigation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_radio_categories_slug ON radio_categories(slug);
CREATE INDEX IF NOT EXISTS idx_radio_categories_display_order ON radio_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_radio_navigation_display_order ON radio_navigation(display_order);
CREATE INDEX IF NOT EXISTS idx_live_streams_status ON live_streams(status);
CREATE INDEX IF NOT EXISTS idx_live_streams_channel ON live_streams(channel);

-- Update any existing live streams to have proper status
UPDATE live_streams SET status = 'live' WHERE status IS NULL AND is_live = true;
UPDATE live_streams SET status = 'offline' WHERE status IS NULL AND is_live = false;

COMMENT ON TABLE radio_config IS 'Configuration settings for radio functionality';
COMMENT ON TABLE radio_categories IS 'Categories for radio content organization';
COMMENT ON TABLE radio_navigation IS 'Navigation menu items for radio section';

SELECT 'Latest database changes applied successfully!' as message;
