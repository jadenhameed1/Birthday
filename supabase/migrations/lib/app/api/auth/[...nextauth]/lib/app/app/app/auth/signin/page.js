import { loadConversation } from '../../lib/chatService'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, conversationId } = req.body

  if (!message) {
    return res.status(400).json({ error: 'Message is required' })
  }

  try {
    // Load conversation history for context
    let conversationHistory = []
    if (conversationId && conversationId !== 'temp-conversation') {
      try {
        conversationHistory = await loadConversation(conversationId)
      } catch (error) {
        console.log('No conversation history found, starting fresh')
      }
    }

    // Prepare messages for OpenAI with history (last 10 messages for context)
    const recentHistory = conversationHistory.slice(-10)
    
    const messages = [
      {
        role: 'system',
        content: `You are a helpful business assistant. Provide insightful, actionable advice for business owners. 
        Be concise but helpful. Focus on practical insights and ask clarifying questions when needed.
        If discussing metrics, provide context and suggestions for improvement.`
      },
      ...recentHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ]

    // Call OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      throw new Error(`OpenAI API error: ${errorData.error?.message}`)
    }

    const data = await openaiResponse.json()
    
    res.status(200).json({ 
      response: data.choices[0].message.content 
    })
  } catch (error) {
    console.error('Chat API error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    })
  }
}