'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import MetricsChart from './MetricsChart'
import RealTimeMetrics from './RealTimeMetrics'

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState([])
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const { data: metricsData } = await supabase
        .from('business_metrics')
        .select('*')
        .order('metric_name')

      const { data: insightsData } = await supabase
        .from('ai_insights')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setMetrics(metricsData || [])
      setInsights(insightsData || [])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatMetric = (value, type = 'number') => {
    if (type === 'currency') return `$${value.toLocaleString()}`
    if (type === 'percentage') return `${value}%`
    return value.toLocaleString()
  }

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Real-time Metrics */}
      <RealTimeMetrics />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-white rounded-lg shadow p-4 border">
            <h3 className="text-sm font-medium text-gray-500 uppercase">
              {metric.metric_name.replace('_', ' ')}
            </h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatMetric(
                metric.metric_value, 
                metric.metric_name.includes('revenue') || metric.metric_name.includes('value') || metric.metric_name.includes('cost') 
                  ? 'currency' 
                  : metric.metric_name.includes('rate') 
                    ? 'percentage' 
                    : 'number'
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Performance Trends</h2>
        <MetricsChart />
      </div>

      {/* AI Insights Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🤖 AI Business Insights</h2>
        <div className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight) => (
              <div key={insight.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-gray-700">{insight.insight_text}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500 capitalize">{insight.insight_type}</span>
                  {insight.confidence_score && (
                    <span className="text-sm text-gray-500">
                      Confidence: {(insight.confidence_score * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No insights yet. Chat with your AI assistant to generate insights!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => window.location.href = '/chat'}
          className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          💬 Chat with AI Assistant
        </button>
        <button className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition">
          📈 Generate Report
        </button>
        <button onClick={loadDashboardData} className="bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition">
          🔄 Refresh Data
        </button>
      </div>
    </div>
  )
}
