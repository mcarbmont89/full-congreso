-- Create datasets table for Datos Abiertos section
CREATE TABLE IF NOT EXISTS datasets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'legislativo',
  update_frequency VARCHAR(50) DEFAULT 'Mensual',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  formats VARCHAR(100) DEFAULT 'CSV, JSON, XLSX',
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT DEFAULT 0,
  file_type VARCHAR(10),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for active datasets
CREATE INDEX IF NOT EXISTS idx_datasets_active ON datasets(is_active);
CREATE INDEX IF NOT EXISTS idx_datasets_order ON datasets(display_order);

-- Add comment
COMMENT ON TABLE datasets IS 'Stores open data files available for public download in Datos Abiertos section';

