'use client'

import { useState, useEffect } from 'react'
import { Plus, Building2, Users, Settings, ArrowRight, Database, RefreshCw, CloudOff } from 'lucide-react'

export default function Organizations() {
  const [organizations, setOrganizations] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(true)

  // Load organizations from API
  const loadOrganizations = async () => {
    try {
      const response = await fetch('/api/organizations')
      if (response.ok) {
        const data = await response.json()
        setOrganizations(data.organizations || [])
      }
    } catch (error) {
      console.error('Error loading organizations:', error)
      setIsDemoMode(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrganizations()
  }, [])

  const createOrganization = async (e) => {
    e.preventDefault()
    if (orgName.trim()) {
      setIsCreating(true)
      
      try {
        const response = await fetch('/api/organizations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: orgName })
        })
        
        if (response.ok) {
          const newOrg = await response.json()
          setOrganizations([newOrg, ...organizations])
          setOrgName('')
          setShowCreateForm(false)
        } else {
          throw new Error('Failed to create organization')
        }
      } catch (error) {
        console.error('Error creating organization:', error)
        alert('Failed to create organization. Please try again.')
      } finally {
        setIsCreating(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your organizations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
            <p className="mt-2 text-gray-600">Manage your business organizations and teams</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadOrganizations}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </button>
            <div className={`flex items-center text-sm px-3 py-1 rounded-full ${
              isDemoMode 
                ? 'text-amber-700 bg-amber-50' 
                : 'text-green-600 bg-green-50'
            }`}>
              {isDemoMode ? (
                <>
                  <CloudOff className="h-4 w-4 mr-1" />
                  Demo Mode
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-1" />
                  Database Connected
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Mode Notice */}
      {isDemoMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CloudOff className="h-5 w-5 text-amber-600 mr-3" />
            <div>
              <h4 className="font-medium text-amber-800">Demo Mode Active</h4>
              <p className="text-amber-700 text-sm mt-1">
                Organizations are stored temporarily. Set up Supabase for permanent storage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the component remains the same */}
      <div className="mb-8">
        {!showCreateForm ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to grow your business?</h3>
                <p className="text-gray-600">Create your first organization to start building your ecosystem.</p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Organization
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Create New Organization</h3>
            <form onSubmit={createOrganization} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter your organization name"
                  autoFocus
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be your business name in the ecosystem
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isCreating || !orgName.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Organization
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Organizations Grid - rest of the component remains the same */}
      {/* ... (keep the existing organizations grid code) ... */}
    </div>
  )
}
