import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data: organizations, error } = await supabase
        .from('organization_members')
        .select(`
          organization:organizations(*),
          role
        `)
        .eq('user_id', req.headers['user-id'] || 'demo-user') // In real app, use auth
        .eq('status', 'active')

      if (error) throw error

      res.status(200).json({ organizations })
    } catch (error) {
      console.error('Organizations API error:', error)
      res.status(200).json({ organizations: [] })
    }
  } else if (req.method === 'POST') {
    try {
      const { name } = req.body
      
      // Create organization
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .insert([{ 
          name, 
          slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now(),
          created_by: req.headers['user-id'] || 'demo-user'
        }])
        .select()
        .single()

      if (orgError) throw orgError

      // Add creator as owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([{
          organization_id: organization.id,
          user_id: req.headers['user-id'] || 'demo-user',
          role: 'owner',
          status: 'active'
        }])

      if (memberError) throw memberError

      res.status(200).json({ organization })
    } catch (error) {
      console.error('Create organization error:', error)
      res.status(500).json({ error: 'Failed to create organization' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
