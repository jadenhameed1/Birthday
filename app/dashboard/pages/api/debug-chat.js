"use client";
export default async function handler(req, res) {
  console.log('🔧 DEBUG: API endpoint called')
  
  try {
    // Test 1: Check environment variables
    console.log('🔧 DEBUG: Checking environment variables...')
    console.log('OpenAI Key exists:', !!process.env.OPENAI_API_KEY)
    console.log('Supabase URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    // Test 2: Simple response without external calls
    res.status(200).json({ 
      response: 'Debug: API is working!',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('🔧 DEBUG Error:', error)
    res.status(500).json({ error: error.message })
  }
}