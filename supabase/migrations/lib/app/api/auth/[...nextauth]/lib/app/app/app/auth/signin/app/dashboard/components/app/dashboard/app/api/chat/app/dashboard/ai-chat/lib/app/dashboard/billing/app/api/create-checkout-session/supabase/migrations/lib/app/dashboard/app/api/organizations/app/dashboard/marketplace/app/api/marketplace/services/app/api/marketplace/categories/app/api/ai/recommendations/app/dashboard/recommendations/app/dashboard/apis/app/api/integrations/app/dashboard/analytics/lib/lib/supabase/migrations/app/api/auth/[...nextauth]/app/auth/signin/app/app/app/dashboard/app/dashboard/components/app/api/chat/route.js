export async function POST(req) {
  console.log('🔧 CHAT API: Request received')
  
  try {
    const { message, conversationId } = await req.json()
    console.log('🔧 CHAT API: Message:', message)

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log('🔧 CHAT API: Checking OpenAI API key...')
    if (!process.env.OPENAI_API_KEY) {
      console.log('❌ CHAT API: OpenAI API key is missing!')
      throw new Error('OpenAI API key is missing')
    }
    console.log('✅ CHAT API: OpenAI API key found')

    console.log('🔧 CHAT API: Calling OpenAI...')
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Respond with "TEST SUCCESS: [user message]" to confirm the API is working.'
          },
          {
            role: 'user', 
            content: message
          }
        ],
        max_tokens: 100
      }),
    })

    console.log('🔧 CHAT API: OpenAI response status:', openaiResponse.status)

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('❌ CHAT API: OpenAI error:', errorText)
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const data = await openaiResponse.json()
    console.log('✅ CHAT API: OpenAI success - Response received')
    
    return new Response(JSON.stringify({ 
      response: data.choices[0].message.content 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('❌ CHAT API Error:', error.message)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}