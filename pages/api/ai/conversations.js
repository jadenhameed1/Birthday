import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Get conversation count
      const { count, error } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })

      if (error) throw error

      res.status(200).json({ count })
    } catch (error) {
      console.error('Conversations API error:', error)
      res.status(200).json({ count: 0 })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
