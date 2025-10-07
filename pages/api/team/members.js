import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { organization_id } = req.query
      
      const { data: members, error } = await supabase
        .from('organization_members')
        .select(`
          *,
          user:users(email, user_metadata)
        `)
        .eq('organization_id', organization_id)
        .eq('status', 'active')

      if (error) throw error

      res.status(200).json({ members })
    } catch (error) {
      console.error('Members API error:', error)
      res.status(200).json({ members: [] })
    }
  } else if (req.method === 'POST') {
    try {
      const { organization_id, email, role } = req.body
      
      // In a real app, you'd send an invitation email
      // For demo, we'll create a pending member
      const { data: member, error } = await supabase
        .from('organization_members')
        .insert([{
          organization_id,
          invited_email: email,
          role: role || 'member',
          status: 'invited'
        }])
        .select()
        .single()

      if (error) throw error

      res.status(200).json({ member })
    } catch (error) {
      console.error('Invite member error:', error)
      res.status(500).json({ error: 'Failed to invite member' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
