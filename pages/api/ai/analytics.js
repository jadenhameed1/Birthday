import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Get total conversations
      const { count: totalConversations, error: convError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })

      if (convError) throw convError

      // Get total messages
      const { count: totalMessages, error: msgError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })

      if (msgError) throw msgError

      // Mock popular topics (in real app, you'd analyze message content)
      const popularTopics = [
        { name: 'Business Strategy', count: 15 },
        { name: 'Growth Planning', count: 12 },
        { name: 'Marketing', count: 9 },
        { name: 'Revenue Models', count: 7 },
        { name: 'Customer Acquisition', count: 6 }
      ]

      res.status(200).json({
        totalConversations: totalConversations || 0,
        totalMessages: totalMessages || 0,
        popularTopics,
        dailyUsage: [
          { day: 'Mon', conversations: 4 },
          { day: 'Tue', conversations: 7 },
          { day: 'Wed', conversations: 5 },
          { day: 'Thu', conversations: 8 },
          { day: 'Fri', conversations: 6 }
        ]
      })
    } catch (error) {
      console.error('Analytics API error:', error)
      res.status(200).json({
        totalConversations: 0,
        totalMessages: 0,
        popularTopics: [],
        dailyUsage: []
      })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
