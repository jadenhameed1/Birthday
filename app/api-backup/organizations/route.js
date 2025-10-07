import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Demo data storage (in production, this would be Supabase)
let demoOrganizations = []

export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { name } = await request.json()

    // Create demo organization
    const demoOrganization = {
      id: Date.now().toString(),
      name: name,
      slug: name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      owner_id: session.user?.id || 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      plan: 'starter',
      members: 1
    }

    // Store in demo array (in production, this would be Supabase)
    demoOrganizations.push(demoOrganization)

    console.log('Demo organization created:', demoOrganization.name)

    return new Response(JSON.stringify(demoOrganization), {
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
    // Return demo organizations (in production, this would be from Supabase)
    const userOrganizations = demoOrganizations.filter(org => 
      org.owner_id === session.user?.id || org.owner_id === 'demo-user'
    )

    return new Response(JSON.stringify({ organizations: userOrganizations }), {
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
