import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { supabase } from '@/lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { message, conversationId } = await request.json()

    // Create new conversation if needed
    let conversation = conversationId
    if (!conversationId) {
      const { data: newConversation } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: session.user.id,
          title: message.substring(0, 50) + '...'
        })
        .select()
        .single()

      conversation = newConversation.id
    }

    // Save user message
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversation,
        role: 'user',
        content: message
      })

    // Get conversation history for context
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversation)
      .order('created_at', { ascending: true })

    // Prepare messages for OpenAI
    const chatMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for a business ecosystem platform. Provide concise, actionable advice for business growth, technology implementation, and ecosystem development."
        },
        ...chatMessages
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0].message.content

    // Save AI response
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversation,
        role: 'assistant',
        content: aiResponse
      })

    return new Response(JSON.stringify({
      response: aiResponse,
      conversationId: conversation
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(JSON.stringify({ error: 'Failed to process message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}