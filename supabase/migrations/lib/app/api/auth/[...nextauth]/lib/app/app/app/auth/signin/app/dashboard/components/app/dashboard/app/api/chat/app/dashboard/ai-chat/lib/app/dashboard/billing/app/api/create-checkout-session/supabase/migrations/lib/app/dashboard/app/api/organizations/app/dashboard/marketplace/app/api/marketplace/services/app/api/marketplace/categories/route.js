import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('name')

    if (error) throw error

    return new Response(
      JSON.stringify({ categories }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error fetching categories:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch categories' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}