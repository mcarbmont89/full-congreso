
const { Pool } = require('pg')

// Create a simple script to update news categories
async function categorizeNews() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set')
    return
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  })

  try {
    // Get all news items without categories
    const result = await pool.query('SELECT id, title FROM news WHERE category IS NULL OR category = \'\'')
    console.log(`Found ${result.rows.length} news items without categories`)

    // Sample categorization - you can modify this logic
    const categories = [
      'Trabajo en comisiones',
      'Trabajo en pleno', 
      'Foros y seminarios',
      'Reformas aprobadas',
      'Reformas en DOF',
      'Temas de actualidad'
    ]

    for (const newsItem of result.rows) {
      // Simple logic: assign category based on title keywords
      let category = 'Temas de actualidad' // default
      
      if (newsItem.title.toLowerCase().includes('comisión') || newsItem.title.toLowerCase().includes('comité')) {
        category = 'Trabajo en comisiones'
      } else if (newsItem.title.toLowerCase().includes('pleno') || newsItem.title.toLowerCase().includes('sesión')) {
        category = 'Trabajo en pleno'
      } else if (newsItem.title.toLowerCase().includes('foro') || newsItem.title.toLowerCase().includes('seminario')) {
        category = 'Foros y seminarios'
      } else if (newsItem.title.toLowerCase().includes('reforma') && newsItem.title.toLowerCase().includes('aprob')) {
        category = 'Reformas aprobadas'
      } else if (newsItem.title.toLowerCase().includes('dof') || newsItem.title.toLowerCase().includes('diario oficial')) {
        category = 'Reformas en DOF'
      }

      await pool.query('UPDATE news SET category = $1 WHERE id = $2', [category, newsItem.id])
      console.log(`Updated "${newsItem.title}" -> ${category}`)
    }

    console.log('News categorization completed!')
    
  } catch (error) {
    console.error('Error categorizing news:', error)
  } finally {
    await pool.end()
  }
}

// Run if called directly
if (require.main === module) {
  categorizeNews()
}

module.exports = { categorizeNews }
