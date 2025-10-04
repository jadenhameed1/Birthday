import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { supabase } from '@/lib/supabase'
import { CreditCard, Users, MessageSquare, Zap } from 'lucide-react'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  // Fetch user's organizations
  const { data: organizations } = await supabase
    .from('organization_members')
    .select(`
      organizations (*)
    `)
    .eq('user_id', session.user.id)

  const stats = [
    { name: 'Subscription', value: session.user.subscription_tier, icon: CreditCard },
    { name: 'Organizations', value: organizations?.length || 0, icon: Users },
    { name: 'AI Chats', value: '0', icon: MessageSquare },
    { name: 'API Usage', value: '0 calls', icon: Zap },
  ]

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {session.user.name || session.user.email}. Here's what's happening with your ecosystem.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <MessageSquare className="h-4 w-4 mr-2" />
              Start AI Chat
            </button>
            <button className="inline-flex items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Users className="h-4 w-4 mr-2" />
              Invite Team Members
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center text-gray-500 py-8">
            <p>No recent activity</p>
            <p className="text-sm mt-1">Your ecosystem activity will appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}