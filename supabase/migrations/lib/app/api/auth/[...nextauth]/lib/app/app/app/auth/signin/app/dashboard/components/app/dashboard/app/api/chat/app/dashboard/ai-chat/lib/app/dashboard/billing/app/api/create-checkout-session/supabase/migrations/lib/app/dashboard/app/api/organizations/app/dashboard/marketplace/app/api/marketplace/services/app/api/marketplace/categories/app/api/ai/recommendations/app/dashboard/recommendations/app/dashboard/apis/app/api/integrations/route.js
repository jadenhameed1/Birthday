import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    // Get user's organizations
    const { data: orgMemberships } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', session.user.id)

    const orgIds = orgMemberships?.map(om => om.organization_id) || []

    const { data: integrations, error } = await supabase
      .from('api_integrations')
      .select('*')
      .in('organization_id', orgIds)

    if (error) throw error

    return new Response(
      JSON.stringify({ integrations }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error fetching integrations:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch integrations' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { name, description, baseUrl, apiKey } = await request.json()

    // Get user's first organization for now
    const { data: orgMemberships } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', session.user.id)
      .limit(1)

    if (!orgMemberships?.[0]) {
      return new Response('No organization found', { status: 400 })
    }

    const { data: integration, error } = await supabase
      .from('api_integrations')
      .insert({
        organization_id: orgMemberships[0].organization_id,
        name,
        description,
        base_url: baseUrl,
        api_key_encrypted: apiKey, // In production, encrypt this
        is_active: true
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify(integration),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error creating integration:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create integration' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const integrationId = searchParams.get('id')

    const { error } = await supabase
      .from('api_integrations')
      .delete()
      .eq('id', integrationId)

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error deleting integration:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to delete integration' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}