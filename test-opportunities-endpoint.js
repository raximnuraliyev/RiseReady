// Quick test to verify the opportunities endpoint works
import fetch from 'node-fetch'

async function testEndpoint() {
  try {
    console.log('Testing /api/opportunities endpoint...')
    const response = await fetch('http://localhost:5000/api/opportunities')
    console.log('Status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('\n✅ SUCCESS! Endpoint returned data:')
      console.log(`Total opportunities: ${data.length}`)
      console.log('\nFirst 3 opportunities:')
      data.slice(0, 3).forEach((opp, idx) => {
        console.log(`\n${idx + 1}. ${opp.title}`)
        console.log(`   Organization: ${opp.organization}`)
        console.log(`   Type: ${opp.type}`)
        console.log(`   Source: ${opp.source}`)
        console.log(`   Posted: ${opp.postedAt}`)
      })
    } else {
      console.log('❌ ERROR: Response status', response.status)
    }
  } catch (err) {
    console.error('❌ ERROR:', err.message)
  }
}

testEndpoint()
