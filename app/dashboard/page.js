import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { Rocket, Zap, TrendingUp, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {session.user.name || session.user.email}. Your ecosystem is growing.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Organizations</dt>
                  <dd className="text-lg font-medium text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Zap className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">AI Usage</dt>
                  <dd className="text-lg font-medium text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Services</dt>
                  <dd className="text-lg font-medium text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Rocket className="h-6 w-6 text-orange-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Growth</dt>
                  <dd className="text-lg font-medium text-gray-900">0%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link href="/dashboard/organizations" className="inline-flex items-center justify-between px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Create Organization
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="inline-flex items-center justify-between px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Start AI Chat
              </div>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Getting Started</h3>
        <p className="text-blue-700 mb-4">
          Create your first organization to start building your business ecosystem.
        </p>
        <div className="flex items-center text-sm text-blue-600">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
          Create an organization
        </div>
        <div className="flex items-center text-sm text-blue-600 mt-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
          Invite team members
        </div>
        <div className="flex items-center text-sm text-blue-600 mt-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
          Explore marketplace services
        </div>
      </div>
    </div>
  )
}
