
const { Pool } = require('pg');

async function checkUsersTable() {
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
    console.log('Checking users table...');
    
    // Check if users table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    console.log(`✅ Users table exists: ${tableExists}`);
    
    if (tableExists) {
      // Get table structure
      const structure = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
        ORDER BY ordinal_position;
      `);
      
      console.log('📊 Table structure:');
      structure.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
      });
      
      // Count users
      const userCount = await pool.query('SELECT COUNT(*) FROM users');
      console.log(`👥 Number of users: ${userCount.rows[0].count}`);
      
      // Show users (without passwords)
      const users = await pool.query('SELECT id, username, role, is_active, created_at FROM users ORDER BY created_at');
      if (users.rows.length > 0) {
        console.log('📋 Users:');
        users.rows.forEach(user => {
          console.log(`  - ID: ${user.id}, Username: ${user.username}, Role: ${user.role}, Active: ${user.is_active}, Created: ${user.created_at}`);
        });
      }
    } else {
      console.log('❌ Users table does not exist. Run the initialization endpoint to create it.');
    }
    
  } catch (error) {
    console.error('❌ Error checking users table:', error.message);
  } finally {
    await pool.end();
  }
}

// Run the check
checkUsersTable();
