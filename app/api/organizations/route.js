import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { name } = await request.json()

    // Create organization in Supabase
    const { data: organization, error } = await supabase
      .from('organizations')
      .insert({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        owner_id: session.user.id
      })
      .select()
      .single()

    if (error) throw error

    // Add creator as admin member
    await supabase
      .from('organization_members')
      .insert({
        user_id: session.user.id,
        organization_id: organization.id,
        role: 'admin'
      })

    return new Response(JSON.stringify(organization), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error creating organization:', error)
    return new Response(JSON.stringify({ error: 'Failed to create organization' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function GET(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    // Get user's organizations
    const { data: organizations, error } = await supabase
      .from('organization_members')
      .select(`
        organizations (*)
      `)
      .eq('user_id', session.user.id)

    if (error) throw error

    const orgs = organizations?.map(org => org.organizations) || []

    return new Response(JSON.stringify({ organizations: orgs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error fetching organizations:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch organizations' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
