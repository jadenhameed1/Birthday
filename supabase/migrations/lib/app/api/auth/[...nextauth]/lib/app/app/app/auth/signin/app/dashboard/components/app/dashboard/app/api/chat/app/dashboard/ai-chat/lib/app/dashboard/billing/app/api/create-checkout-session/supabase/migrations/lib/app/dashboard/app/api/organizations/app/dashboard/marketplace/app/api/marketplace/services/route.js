import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { data: services, error } = await supabase
      .from('marketplace_services')
      .select(`
        *,
        service_categories (name, slug),
        organizations (name, slug)
      `)
      .eq('is_active', true)

    if (error) throw error

    return new Response(
      JSON.stringify({ services }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error fetching services:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch services' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}