
import { NextResponse } from 'next/server'
import { createDatabaseConnectionFromEnv } from '@/lib/database-env'

export async function POST() {
  let pool = null
  
  try {
    console.log('Attempting to initialize users table...')
    
    pool = createDatabaseConnectionFromEnv()
    
    if (!pool) {
      console.error('Failed to create database connection')
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    // Test the connection first
    const testResult = await pool.query('SELECT 1 as test')
    console.log('Database connection test successful:', testResult.rows)
    
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    console.log('Users table created successfully')

    // Check if default users exist
    const existingUsers = await pool.query('SELECT username FROM users')
    console.log('Existing users:', existingUsers.rows)

    if (existingUsers.rows.length === 0) {
      const bcrypt = require('bcryptjs')
      
      // Create default admin user
      const adminPasswordHash = await bcrypt.hash('admin123', 10)
      const cmsPasswordHash = await bcrypt.hash('hgqV&d3FJ!eDv#2Ji7v!kA', 10)
      
      await pool.query(`
        INSERT INTO users (username, password_hash, role, is_active)
        VALUES 
          ('admin', $1, 'admin', true),
          ('cmscanal', $2, 'admin', true)
      `, [adminPasswordHash, cmsPasswordHash])
      
      console.log('Default users created successfully')
    }

    const finalUserCount = await pool.query('SELECT COUNT(*) FROM users')
    console.log('Final user count:', finalUserCount.rows[0].count)

    return NextResponse.json({ 
      message: 'Users table and default users initialized successfully',
      userCount: parseInt(finalUserCount.rows[0].count),
      tableCreated: true
    })
  } catch (error) {
    console.error('Error initializing users table:', error)
    return NextResponse.json(
      { 
        error: 'Failed to initialize users table',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  } finally {
    if (pool) {
      try {
        await pool.end()
      } catch (endError) {
        console.error('Error closing database connection:', endError)
      }
    }
  }
}
