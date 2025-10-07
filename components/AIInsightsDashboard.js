'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AIAnalysisService from '@/utils/aiAnalysisService'

export default function AIInsightsDashboard() {
  const [insights, setInsights] = useState([])
  const [analyses, setAnalyses] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [realTimeData, setRealTimeData] = useState({
    messagesAnalyzed: 0,
    bookingsOptimized: 0,
    risksIdentified: 0,
    opportunitiesFound: 0
  })

  useEffect(() => {
    loadAIData()
    simulateRealTimeUpdates()
  }, [])

  const loadAIData = async () => {
    try {
      const [insightsRes, analysesRes] = await Promise.all([
        supabase.from('ai_insights').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('ai_analysis').select('*').order('created_at', { ascending: false }).limit(20)
      ])

      setInsights(insightsRes.data || [])
      setAnalyses(analysesRes.data || [])
    } catch (error) {
      console.error('Error loading AI data:', error)
    } finally {
      setLoading(false)
    }
  }

  const simulateRealTimeUpdates = () => {
    // Simulate real-time AI activity
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        messagesAnalyzed: prev.messagesAnalyzed + Math.floor(Math.random() * 3),
        bookingsOptimized: prev.bookingsOptimized + Math.floor(Math.random() * 2),
        risksIdentified: prev.risksIdentified + Math.floor(Math.random() * 1),
        opportunitiesFound: prev.opportunitiesFound + Math.floor(Math.random() * 2)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }

  const runQuickAnalysis = async () => {
    setLoading(true)
    // Simulate AI analysis
    setTimeout(() => {
      const newInsight = {
        id: Date.now().toString(),
        insight_type: 'analysis',
        title: 'Real-time Market Analysis Complete',
        description: 'AI has analyzed current market trends and identified new opportunities in the SaaS sector.',
        confidence_score: 0.89,
        impact_level: 'medium',
        created_at: new Date().toISOString()
      }
      
      setInsights(prev => [newInsight, ...prev])
      setLoading(false)
    }, 2000)
  }

  const getImpactColor = (impact) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    }
    return colors[impact] || 'bg-gray-100 text-gray-800'
  }

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.8) return 'text-green-600'
    if (confidence > 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading && insights.length === 0) {
    return <div className="p-8 text-center">Loading AI Insights...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🧠 AI Insights Dashboard</h1>
          <p className="text-gray-600 mt-2">Powered by advanced AI analysis</p>
        </div>
        <button
          onClick={runQuickAnalysis}
          disabled={loading}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition"
        >
          {loading ? 'Analyzing...' : 'Run Quick Analysis'}
        </button>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{realTimeData.messagesAnalyzed}</div>
          <div className="text-blue-100 text-sm">Messages Analyzed</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{realTimeData.bookingsOptimized}</div>
          <div className="text-green-100 text-sm">Bookings Optimized</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{realTimeData.risksIdentified}</div>
          <div className="text-yellow-100 text-sm">Risks Identified</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{realTimeData.opportunitiesFound}</div>
          <div className="text-purple-100 text-sm">Opportunities Found</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'insights', 'analyses', 'workflows'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <OverviewTab insights={insights} analyses={analyses} />
        )}
        
        {activeTab === 'insights' && (
          <InsightsTab insights={insights} />
        )}
        
        {activeTab === 'analyses' && (
          <AnalysesTab analyses={analyses} />
        )}
        
        {activeTab === 'workflows' && (
          <WorkflowsTab />
        )}
      </div>
    </div>
  )
}

function OverviewTab({ insights, analyses }) {
  const recentInsights = insights.slice(0, 3)
  const recentAnalyses = analyses.slice(0, 5)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">🔍 Recent AI Insights</h3>
        <div className="space-y-4">
          {recentInsights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Recent Analyses</h3>
        <div className="space-y-3">
          {recentAnalyses.map(analysis => (
            <AnalysisItem key={analysis.id} analysis={analysis} />
          ))}
        </div>
      </div>
    </div>
  )
}

function InsightsTab({ insights }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">AI-Generated Insights</h3>
        <div className="text-sm text-gray-500">
          {insights.length} insights generated
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map(insight => (
          <InsightCard key={insight.id} insight={insight} expanded />
        ))}
      </div>

      {insights.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-gray-500 text-lg">No insights generated yet</p>
          <p className="text-gray-400 mt-2">AI insights will appear here as they're generated</p>
        </div>
      )}
    </div>
  )
}

function AnalysesTab({ analyses }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">AI Analysis History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {analyses.map(analysis => (
              <AnalysisRow key={analysis.id} analysis={analysis} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function WorkflowsTab() {
  const [workflows, setWorkflows] = useState([])

  useEffect(() => {
    loadWorkflows()
  }, [])

  const loadWorkflows = async () => {
    const { data } = await supabase
      .from('ai_workflows')
      .select('*')
      .order('created_at', { ascending: false })
    
    setWorkflows(data || [])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">AI Workflows</h3>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          + New Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workflows.map(workflow => (
          <div key={workflow.id} className="bg-white rounded-lg shadow p-6 border">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-lg">{workflow.name}</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${
                workflow.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {workflow.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{workflow.description}</p>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Trigger:</span>
                <span className="text-gray-600 ml-2">{workflow.trigger_condition}</span>
              </div>
              <div>
                <span className="font-medium">Prompt:</span>
                <p className="text-gray-600 text-xs mt-1 bg-gray-50 p-2 rounded">
                  {workflow.ai_prompt.substring(0, 100)}...
                </p>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm">
                Edit
              </button>
              <button className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 text-sm">
                {workflow.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function InsightCard({ insight, expanded = false }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold">{insight.title}</h4>
        <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(insight.impact_level)}`}>
          {insight.impact_level} impact
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">{insight.description}</p>
      
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${getConfidenceColor(insight.confidence_score)}`}>
          {(insight.confidence_score * 100).toFixed(0)}% confidence
        </span>
        <span className="text-xs text-gray-500 capitalize">
          {insight.insight_type}
        </span>
      </div>

      {expanded && insight.actionable_steps && (
        <div className="mt-3 pt-3 border-t">
          <h5 className="font-medium text-sm mb-2">Actionable Steps:</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            {insight.actionable_steps.map((step, index) => (
              <li key={index}>• {step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function AnalysisItem({ analysis }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div>
        <div className="font-medium text-sm capitalize">
          {analysis.analysis_type.replace('_', ' ')}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(analysis.created_at).toLocaleDateString()}
        </div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-medium ${getConfidenceColor(analysis.confidence_score)}`}>
          {(analysis.confidence_score * 100).toFixed(0)}%
        </div>
        <div className="text-xs text-gray-500">confidence</div>
      </div>
    </div>
  )
}

function AnalysisRow({ analysis }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 capitalize">
          {analysis.analysis_type.replace('_', ' ')}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{analysis.target_type}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-medium ${getConfidenceColor(analysis.confidence_score)}`}>
          {(analysis.confidence_score * 100).toFixed(0)}%
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(analysis.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button className="text-blue-600 hover:text-blue-900">View Details</button>
      </td>
    </tr>
  )
}

// Helper functions
function getImpactColor(impact) {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }
  return colors[impact] || 'bg-gray-100 text-gray-800'
}

function getConfidenceColor(confidence) {
  if (confidence > 0.8) return 'text-green-600'
  if (confidence > 0.6) return 'text-yellow-600'
  return 'text-red-600'
}
