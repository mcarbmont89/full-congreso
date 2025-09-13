
import bcrypt from 'bcryptjs'
import { getDatabaseConnection } from './database'

interface User {
  id: number
  username: string
  password_hash: string
  role: string
  is_active: boolean
}

export async function validateUser(username: string, password: string): Promise<boolean> {
  try {
    console.log('Validating user:', username)
    const pool = getDatabaseConnection()
    if (!pool) {
      console.error('Database connection not available')
      console.error('Environment variables check:', {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasPgHost: !!process.env.PGHOST,
        hasPgDatabase: !!process.env.PGDATABASE,
        hasPgUser: !!process.env.PGUSER,
        hasPgPassword: !!process.env.PGPASSWORD
      })
      return false
    }

    const result = await pool.query(
      'SELECT password_hash FROM users WHERE username = $1 AND is_active = true',
      [username]
    )

    if (result.rows.length === 0) {
      return false
    }

    const user = result.rows[0]
    return await bcrypt.compare(password, user.password_hash)
  } catch (error) {
    console.error('Error validating user:', error)
    return false
  }
}

export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const pool = getDatabaseConnection()
    if (!pool) {
      console.error('Database connection not available')
      return null
    }

    const result = await pool.query(
      'SELECT id, username, password_hash, role, is_active FROM users WHERE username = $1 AND is_active = true',
      [username]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function createUser(username: string, password: string, role: string = 'admin'): Promise<boolean> {
  try {
    const pool = getDatabaseConnection()
    if (!pool) {
      console.error('Database connection not available')
      return false
    }

    const passwordHash = await bcrypt.hash(password, 10)
    
    await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
      [username, passwordHash, role]
    )

    return true
  } catch (error) {
    console.error('Error creating user:', error)
    return false
  }
}

export async function updateUserPassword(username: string, newPassword: string): Promise<boolean> {
  try {
    const pool = getDatabaseConnection()
    if (!pool) {
      console.error('Database connection not available')
      return false
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)
    
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2',
      [passwordHash, username]
    )

    return true
  } catch (error) {
    console.error('Error updating user password:', error)
    return false
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const pool = getDatabaseConnection()
    if (!pool) {
      console.error('Database connection not available')
      return []
    }

    const result = await pool.query(
      'SELECT id, username, role, is_active FROM users ORDER BY created_at DESC'
    )

    return result.rows
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export async function deactivateUser(username: string): Promise<boolean> {
  try {
    const pool = getDatabaseConnection()
    if (!pool) {
      console.error('Database connection not available')
      return false
    }

    await pool.query(
      'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE username = $1',
      [username]
    )

    return true
  } catch (error) {
    console.error('Error deactivating user:', error)
    return false
  }
}

export function generatePasswordHash(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Initialize default admin user if no users exist
export async function initializeDefaultUsers(): Promise<void> {
  try {
    const pool = getDatabaseConnection()
    if (!pool) {
      console.error('Database connection not available')
      return
    }

    // Check if any users exist
    const result = await pool.query('SELECT COUNT(*) FROM users')
    const userCount = parseInt(result.rows[0].count)

    if (userCount === 0) {
      console.log('No users found, creating default admin users...')
      
      // Create default admin users
      await createUser('admin', 'admin123', 'admin')
      await createUser('cmscanal', 'hgqV&d3FJ!eDv#2Ji7v!kA', 'admin')
      
      console.log('Default admin users created successfully')
    }
  } catch (error) {
    console.error('Error initializing default users:', error)
  }
}
