
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function resetPasswords() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    console.log('Resetting user passwords...');
    
    // Reset admin password
    const adminHash = await bcrypt.hash('admin123', 10);
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE username = $2',
      [adminHash, 'admin']
    );
    console.log('✅ Admin password reset to: admin123');
    
    // Reset cmscanal password  
    const cmscanalHash = await bcrypt.hash('hgqV&d3FJ!eDv#2Ji7v!kA', 10);
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE username = $2', 
      [cmscanalHash, 'cmscanal']
    );
    console.log('✅ Cmscanal password reset');
    
    // Verify the users exist and show their info
    const result = await pool.query('SELECT username, role, is_active FROM users');
    console.log('\n📋 Current users:');
    result.rows.forEach(user => {
      console.log(`  - ${user.username} (${user.role}) - Active: ${user.is_active}`);
    });
    
    console.log('\n🔧 You can now login with:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    
  } catch (error) {
    console.error('❌ Error resetting passwords:', error.message);
  } finally {
    await pool.end();
  }
}

resetPasswords();
