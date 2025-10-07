'use client'
import { useState, useEffect } from 'react'
import { Brain, Users, MessageCircle, TrendingUp, Zap, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState({
    totalConversations: 0,
    totalMessages: 0,
    popularTopics: [],
    dailyUsage: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/ai/analytics')
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <span className="text-gray-600">Loading business insights...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <nav className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <span>← Back to Home</span>
            </Link>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Business Insights</span>
            </div>
            <div className="flex gap-4">
              <Link href="/ai-demo" className="text-blue-600 hover:text-blue-700 font-medium">
                AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Total Conversations Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Conversations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalConversations}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-600 text-sm font-medium">+12% this week</span>
            </div>
          </div>

          {/* Total Messages Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">AI Messages</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalMessages}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-orange-600 text-sm font-medium">Active</span>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Business Topics</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.popularTopics.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-gray-500 text-sm mt-4">Topics analyzed</div>
          </div>

          {/* Engagement Rate Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg. Session</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">4.2</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="text-gray-500 text-sm mt-4">Messages per chat</div>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Business Topics</h3>
            <div className="space-y-3">
              {analytics.popularTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{topic.name}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">
                    {topic.count} chats
                  </span>
                </div>
              ))}
              {analytics.popularTopics.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Brain className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p>Start chatting with your AI assistant to see topics here!</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                href="/ai-demo" 
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
              >
                <Brain className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">Chat with AI Assistant</p>
                  <p className="text-sm text-gray-600">Get business insights and strategies</p>
                </div>
              </Link>
              
              <button className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group w-full text-left">
                <BarChart3 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Generate Report</p>
                  <p className="text-sm text-gray-600">Create business performance report</p>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group w-full text-left">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Growth Analysis</p>
                  <p className="text-sm text-gray-600">Analyze business growth opportunities</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Link 
            href="/ai-demo"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            <Brain className="h-5 w-5" />
            Start New AI Conversation
          </Link>
        </div>
      </div>
    </div>
  )
}
