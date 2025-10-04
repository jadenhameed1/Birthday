import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { supabase } from '@/lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return new Response('Organization ID required', { status: 400 })
    }

    // Get organization data for context
    const { data: organization } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single()

    // Get recent activity for context
    const { data: recentOrders } = await supabase
      .from('service_orders')
      .select('*')
      .eq('customer_organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(5)

    // Generate AI recommendations
    const prompt = `
      Organization: ${organization.name}
      Recent Activity: ${recentOrders?.length || 0} recent service orders
      
      Based on this business profile, generate 3-5 specific, actionable recommendations for:
      1. Services they should consider from the marketplace
      2. Workflow automations that could help them
      3. Strategic insights for growth
      
      Return as JSON array with:
      - recommendation_type: "service" | "workflow" | "insight"
      - title: string
      - description: string
      - confidence_score: number (0-1)
      - metadata: object with relevant details
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a business strategy AI that provides specific, actionable recommendations for companies in a business ecosystem platform. Be concise and practical."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const recommendations = JSON.parse(completion.choices[0].message.content)

    // Store recommendations in database
    for (const rec of recommendations) {
      await supabase
        .from('ai_recommendations')
        .insert({
          organization_id: organizationId,
          user_id: session.user.id,
          ...rec
        })
    }

    return new Response(
      JSON.stringify({ recommendations }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error generating recommendations:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate recommendations' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}