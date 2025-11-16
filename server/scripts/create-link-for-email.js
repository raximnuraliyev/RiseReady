#!/usr/bin/env node
import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from '../src/config/db.js'
import mongoose from 'mongoose'
import { LinkCode } from '../src/models/LinkCode.js'
import { User } from '../src/models/User.js'

async function main() {
  const email = process.argv[2]
  const expires = parseInt(process.argv[3] || '10')
  if (!email) {
    console.error('Usage: node create-link-for-email.js <email> [expiresInMinutes]')
    process.exit(2)
  }

  await connectDB()
  try {
    const user = await User.findOne({ email }).exec()
    if (!user) {
      console.error('User not found for email:', email)
      process.exit(3)
    }

    const code = [...Array(6)].map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('')
    const link = await LinkCode.create({ code, userId: user._id, expiresAt: new Date(Date.now() + expires * 60000) })
    console.log('Created link code:', link.code, 'expiresAt:', link.expiresAt)
    process.exit(0)
  } catch (err) {
    console.error('Error creating link code:', err)
    process.exit(1)
  } finally {
    try { await mongoose.connection.close() } catch {}
  }
}

main()
