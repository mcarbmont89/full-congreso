
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function fixUsersTable() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    console.log('Fixing users table schema...');
    
    // Check if password_hash column exists
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'password_hash'
    `);
    
    if (columnCheck.rows.length === 0) {
      console.log('Adding password_hash column...');
      await pool.query('ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)');
      
      // Get all users with their current passwords
      const users = await pool.query('SELECT id, username, password FROM users');
      
      console.log('Migrating passwords to bcrypt hashes...');
      for (const user of users.rows) {
        if (user.password) {
          // If password looks like it's already hashed (starts with $2), keep it
          // Otherwise, hash it with bcrypt
          let hashedPassword;
          if (user.password.startsWith('$2')) {
            hashedPassword = user.password;
          } else {
            hashedPassword = await bcrypt.hash(user.password, 10);
          }
          
          await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [hashedPassword, user.id]
          );
          console.log(`✅ Updated password hash for user: ${user.username}`);
        }
      }
      
      // Make password_hash NOT NULL
      await pool.query('ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL');
      
      // Drop the old password column
      await pool.query('ALTER TABLE users DROP COLUMN password');
      
      console.log('✅ Users table schema fixed successfully!');
    } else {
      console.log('password_hash column already exists');
    }
    
    // Verify the final state
    const finalUsers = await pool.query('SELECT username, role, is_active FROM users');
    console.log('\n📋 Final users:');
    finalUsers.rows.forEach(user => {
      console.log(`  - ${user.username} (${user.role}) - Active: ${user.is_active}`);
    });
    
    console.log('\n🔧 You can now login with:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    
  } catch (error) {
    console.error('❌ Error fixing users table:', error.message);
  } finally {
    await pool.end();
  }
}

fixUsersTable();
