import { User } from '../src/models/User.js'
import { connectDB } from '../src/config/db.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

// Load environment variables
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env') })

async function createTestUser() {
  try {
    await connectDB()
    
    // Delete existing test user if exists
    await User.deleteOne({ email: 'test@example.com' })
    
    // Create new test user
    const passwordHash = await bcrypt.hash('testpass123', 10)
    const user = await User.create({
      email: 'test@example.com',
      passwordHash,
      name: 'Test User',
      role: 'student'
    })
    
    console.log('Test user created:', {
      email: user.email,
      id: user._id,
      name: user.name
    })
    
    process.exit(0)
  } catch (error) {
    console.error('Error creating test user:', error)
    process.exit(1)
  }
}

createTestUser()