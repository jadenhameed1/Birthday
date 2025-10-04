'use client'

import { useState, useEffect } from 'react'
import { useTenant } from '@/lib/tenant-context'
import { Plus, Key, Globe, Activity, Trash2 } from 'lucide-react'

export default function APIManagement() {
  const { currentOrganization } = useTenant()
  const [integrations, setIntegrations] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (currentOrganization) {
      fetchIntegrations()
    }
  }, [currentOrganization])

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations')
      const data = await response.json()
      setIntegrations(data.integrations || [])
    } catch (error) {
      console.error('Error fetching integrations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddIntegration = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          description: formData.get('description'),
          baseUrl: formData.get('baseUrl'),
          apiKey: formData.get('apiKey')
        })
      })

      if (response.ok) {
        setShowAddForm(false)
        fetchIntegrations()
        e.target.reset()
      }
    } catch (error) {
      console.error('Error adding integration:', error)
    }
  }

  const handleDeleteIntegration = async (integrationId) => {
    if (!confirm('Are you sure you want to delete this integration?')) return

    try {
      await fetch(`/api/integrations?id=${integrationId}`, {
        method: 'DELETE'
      })
      fetchIntegrations()
    } catch (error) {
      console.error('Error deleting integration:', error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">API Integrations</h1>
            <p className="mt-2 text-sm text-gray-600">
              Connect and manage third-party API integrations
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </button>
        </div>
      </div>

      {/* Add Integration Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Add New Integration</h3>
          <form onSubmit={handleAddIntegration} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Integration Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base URL
                </label>
                <input
                  type="url"
                  name="baseUrl"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                name="apiKey"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Integration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(integration => (
          <div key={integration.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Globe className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                  <p className="text-sm text-gray-500">{integration.base_url}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteIntegration(integration.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4">{integration.description}</p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <Activity className="h-4 w-4 mr-1" />
                {integration.rate_limit_per_minute}/min
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                integration.is_active 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {integration.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {integrations.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations yet</h3>
          <p className="text-gray-600">Add your first API integration to get started</p>
        </div>
      )}
    </div>
  )
}