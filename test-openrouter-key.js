#!/usr/bin/env node
// Test OpenRouter API Key
// Run: node test-openrouter-key.js

import dotenv from 'dotenv'
import fetch from 'node-fetch'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, 'server', '.env') })

const API_KEY = process.env.OPENROUTER_API_KEY
const API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const APP_URL = process.env.APP_URL || 'http://localhost:5173'

console.log('🧪 OpenRouter API Key Tester\n')
console.log('================================\n')

// Step 1: Check if key exists
console.log('1️⃣  Checking API Key...')
if (!API_KEY) {
  console.log('❌ ERROR: OPENROUTER_API_KEY not found in server/.env')
  console.log('\nFix: Add OPENROUTER_API_KEY=sk-or-v1-... to server/.env')
  process.exit(1)
}

console.log(`✅ Key found: ${API_KEY.substring(0, 20)}...`)
console.log(`   Length: ${API_KEY.length} characters`)

// Step 2: Check format
console.log('\n2️⃣  Checking Key Format...')
if (!API_KEY.startsWith('sk-or-v1-')) {
  console.log('❌ ERROR: Key format is wrong!')
  console.log('   Should start with: sk-or-v1-')
  console.log(`   Your key starts with: ${API_KEY.substring(0, 9)}`)
  process.exit(1)
}
console.log('✅ Format correct: sk-or-v1- prefix present')

// Step 3: Test API call
console.log('\n3️⃣  Testing API Connection...')
console.log(`   Endpoint: ${API_URL}`)
console.log('   Model: gpt-3.5-turbo')
console.log('   Testing...\n')

const testPayload = {
  model: 'gpt-3.5-turbo',
  messages: [
    {
      role: 'user',
      content: 'Say "RiseReady API works!" in exactly those words.',
    },
  ],
  temperature: 0.7,
  max_tokens: 100,
}

fetch(API_URL, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'HTTP-Referer': APP_URL,
    'X-Title': 'RiseReady Test',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testPayload),
})
  .then(async response => {
    console.log(`   Response Status: ${response.status}`)

    if (!response.ok) {
      console.log(`\n❌ ERROR: API returned status ${response.status}`)

      const errorText = await response.text()
      try {
        const errorJson = JSON.parse(errorText)
        console.log(`   Error: ${errorJson.error?.message || errorText}`)
      } catch {
        console.log(`   Error: ${errorText}`)
      }

      console.log('\n🔍 Troubleshooting Tips:')
      if (response.status === 401) {
        console.log('   - 401 means: Unauthorized')
        console.log('   - Possible causes:')
        console.log('     1. API key is invalid or expired')
        console.log('     2. API key has no credits')
        console.log('     3. API key was revoked')
        console.log('   - Solution: Generate new key at https://openrouter.ai/account/api-keys')
      } else if (response.status === 429) {
        console.log('   - 429 means: Rate limited')
        console.log('   - Solution: Wait a minute and try again')
      } else if (response.status === 500) {
        console.log('   - 500 means: Server error')
        console.log('   - Solution: Try again in a few moments')
      }

      process.exit(1)
    }

    return response.json()
  })
  .then(data => {
    console.log('\n✅ SUCCESS! API is working!\n')
    console.log('Response:')
    console.log(`   Model: ${data.model}`)
    console.log(
      `   Content: "${data.choices?.[0]?.message?.content || 'No content'}"`,
    )

    console.log('\n================================')
    console.log('🎉 Your OpenRouter API Key Works!')
    console.log('================================\n')
    console.log('Next steps:')
    console.log('1. Start backend: npm run dev --prefix server')
    console.log('2. Start frontend: npm run dev')
    console.log('3. Open http://localhost:5173')
    console.log('4. Click the green AI orb')
    console.log('5. Ask a question - it should respond!')

    process.exit(0)
  })
  .catch(error => {
    console.log(`\n❌ ERROR: ${error.message}`)
    console.log('\nPossible causes:')
    console.log('1. Internet connection issue')
    console.log('2. OpenRouter API is down')
    console.log('3. Invalid API key format')
    console.log('4. Missing dependencies (node-fetch)')
    console.log('\nTry again in a moment or check your internet connection.')
    process.exit(1)
  })
