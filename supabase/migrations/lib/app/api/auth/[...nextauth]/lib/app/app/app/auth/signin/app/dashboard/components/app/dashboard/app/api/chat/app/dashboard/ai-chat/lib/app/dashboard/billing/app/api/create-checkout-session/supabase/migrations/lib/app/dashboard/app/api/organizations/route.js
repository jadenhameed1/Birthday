import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { data: organizations } = await supabase
      .from('organization_members')
      .select(`
        organizations (*)
      `)
      .eq('user_id', session.user.id)

    return new Response(
      JSON.stringify({ 
        organizations: organizations?.map(org => org.organizations) || [] 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error fetching organizations:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch organizations' }),
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
    const { name, slug } = await request.json()

    // Create organization
    const { data: organization, error } = await supabase
      .from('organizations')
      .insert({
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
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

    return new Response(
      JSON.stringify(organization),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error creating organization:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create organization' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}