
const { createDatabaseConnectionFromEnv } = require('../lib/database-env')

async function updateCarouselImages() {
  try {
    const pool = createDatabaseConnectionFromEnv()
    if (!pool) {
      console.error('Database connection not available')
      return
    }

    // Get category images from config
    const configResult = await pool.query(`
      SELECT config_data 
      FROM radio_config 
      WHERE config_key = 'categoryImages'
      ORDER BY created_at DESC 
      LIMIT 1
    `)

    if (!configResult.rows || configResult.rows.length === 0) {
      console.log('No category images config found')
      return
    }

    const categoryImages = configResult.rows[0].config_data || {}
    console.log('Found category images config:', categoryImages)

    // Update radio_categories table with uploaded images
    for (const [categoryName, imageUrl] of Object.entries(categoryImages)) {
      if (imageUrl && imageUrl.startsWith('/uploads/')) {
        const updateResult = await pool.query(`
          UPDATE radio_categories 
          SET image_url = $1, updated_at = NOW()
          WHERE name = $2
        `, [imageUrl, categoryName])

        if (updateResult.rowCount > 0) {
          console.log(`Updated ${categoryName} with image: ${imageUrl}`)
        } else {
          console.log(`No category found with name: ${categoryName}`)
        }
      }
    }

    console.log('Carousel images update completed')
    await pool.end()
  } catch (error) {
    console.error('Error updating carousel images:', error)
  }
}

updateCarouselImages()
