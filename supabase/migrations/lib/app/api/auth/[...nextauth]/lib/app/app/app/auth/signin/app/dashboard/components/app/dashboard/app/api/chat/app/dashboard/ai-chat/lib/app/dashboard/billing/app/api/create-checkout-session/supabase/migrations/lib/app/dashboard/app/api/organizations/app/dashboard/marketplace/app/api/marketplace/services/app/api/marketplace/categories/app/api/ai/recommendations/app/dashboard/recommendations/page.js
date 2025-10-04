'use client'

import { useState, useEffect } from 'react'
import { useTenant } from '@/lib/tenant-context'
import { Lightbulb, Zap, TrendingUp, CheckCircle, Sparkles } from 'lucide-react'

export default function Recommendations() {
  const { currentOrganization } = useTenant()
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchRecommendations = async () => {
    if (!currentOrganization) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/ai/recommendations?organizationId=${currentOrganization.id}`)
      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleActionRecommendation = async (recommendationId) => {
    try {
      await fetch('/api/ai/recommendations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendationId,
          actioned: true
        })
      })
      
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId 
            ? { ...rec, is_actioned: true }
            : rec
        )
      )
    } catch (error) {
      console.error('Error actioning recommendation:', error)
    }
  }

  useEffect(() => {
    if (currentOrganization) {
      fetchRecommendations()
    }
  }, [currentOrganization])

  const getIcon = (type) => {
    switch (type) {
      case 'service': return Zap
      case 'workflow': return TrendingUp
      case 'insight': return Lightbulb
      default: return Sparkles
    }
  }

  const getColor = (type) => {
    switch (type) {
      case 'service': return 'text-purple-600 bg-purple-100'
      case 'workflow': return 'text-blue-600 bg-blue-100'
      case 'insight': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Recommendations</h1>
            <p className="mt-2 text-sm text-gray-600">
              Personalized suggestions to grow your business ecosystem
            </p>
          </div>
          <button
            onClick={fetchRecommendations}
            disabled={isLoading || !currentOrganization}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Refresh Recommendations'}
          </button>
        </div>
      </div>

      {!currentOrganization && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Lightbulb className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Select an Organization</h3>
          <p className="text-yellow-700">Please select an organization to view personalized recommendations</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((recommendation) => {
          const Icon = getIcon(recommendation.recommendation_type)
          return (
            <div
              key={recommendation.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
                recommendation.is_actioned ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${getColor(recommendation.recommendation_type)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500 capitalize">
                        {recommendation.recommendation_type}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-blue-600 font-medium">
                        {Math.round(recommendation.confidence_score * 100)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
                
                {!recommendation.is_actioned && (
                  <button
                    onClick={() => handleActionRecommendation(recommendation.id)}
                    className="text-green-600 hover:text-green-700"
                    title="Mark as completed"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}
              </div>

              <p className="text-gray-600 mb-4">{recommendation.description}</p>

              {recommendation.metadata && Object.keys(recommendation.metadata).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {Object.entries(recommendation.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendation.is_actioned && (
                <div className="flex items-center text-green-600 mt-4">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Action Completed</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {recommendations.length === 0 && currentOrganization && !isLoading && (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
          <p className="text-gray-600">Click "Refresh Recommendations" to generate personalized suggestions</p>
        </div>
      )}
    </div>
  )
}