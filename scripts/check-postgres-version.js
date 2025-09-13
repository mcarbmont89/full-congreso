
const { Pool } = require('pg');

async function checkPostgresVersion() {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    console.log('Checking PostgreSQL version...');
    
    // Query the version
    const result = await pool.query('SELECT version()');
    const versionInfo = result.rows[0].version;
    
    console.log('✅ PostgreSQL Version Information:');
    console.log(`📊 ${versionInfo}`);
    
    // Extract just the version number
    const versionMatch = versionInfo.match(/PostgreSQL (\d+\.\d+(?:\.\d+)?)/);
    if (versionMatch) {
      console.log(`🔢 Version: ${versionMatch[1]}`);
    }
    
    // Also check server version number
    const versionNumResult = await pool.query('SHOW server_version_num');
    const versionNum = versionNumResult.rows[0].server_version_num;
    console.log(`🏷️  Version Number: ${versionNum}`);
    
  } catch (error) {
    console.error('❌ Error checking PostgreSQL version:', error.message);
  } finally {
    await pool.end();
  }
}

// Run the version check
checkPostgresVersion();
