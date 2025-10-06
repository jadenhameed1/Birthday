import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { Rocket, Zap, TrendingUp, Users, ArrowRight, Database, Bot, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  // In a real app, you'd fetch this from the database
  const stats = {
    organizations: 0,
    aiUsage: 0,
    services: 0,
    growth: 0
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back, {session.user.name || session.user.email}. Your ecosystem is growing.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <Database className="h-4 w-4 mr-1" />
              Live Database
            </div>
            <div className="flex items-center text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              <Bot className="h-4 w-4 mr-1" />
              AI Assistant
            </div>
          </div>
        </div>
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
                  <dd className="text-lg font-medium text-gray-900">{stats.organizations}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/organizations" className="font-medium text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bot className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">AI Conversations</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.aiUsage}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/ai-chat" className="font-medium text-purple-600 hover:text-purple-500">
                Start chat
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Services</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.services}</dd>
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
                  <dd className="text-lg font-medium text-gray-900">{stats.growth}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Management</h3>
            <div className="space-y-3">
              <Link href="/dashboard/organizations" className="inline-flex items-center justify-between w-full px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Create Organization
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-blue-500 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-white mb-4">AI Business Assistant</h3>
            <p className="text-purple-100 text-sm mb-4">
              Get strategic insights for your ecosystem platform
            </p>
            <div className="space-y-3">
              <Link href="/dashboard/ai-chat" className="inline-flex items-center justify-between w-full px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-purple-600 bg-white hover:bg-gray-50">
                <div className="flex items-center">
                  <Bot className="h-4 w-4 mr-2" />
                  Start AI Chat
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features Highlight */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-purple-900 mb-3">New: AI Business Assistant 🚀</h3>
        <p className="text-purple-700 mb-4">
          Your AI assistant can help with business strategy, growth planning, market analysis, and competitive intelligence.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-purple-600">
            <MessageSquare className="h-4 w-4 mr-2" />
            Strategic business planning
          </div>
          <div className="flex items-center text-purple-600">
            <TrendingUp className="h-4 w-4 mr-2" />
            Growth strategy development
          </div>
          <div className="flex items-center text-purple-600">
            <Zap className="h-4 w-4 mr-2" />
            Market insights & analysis
          </div>
          <div className="flex items-center text-purple-600">
            <Rocket className="h-4 w-4 mr-2" />
            Competitive positioning
          </div>
        </div>
      </div>
    </div>
  )
}
