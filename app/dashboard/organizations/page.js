'use client'

import { useState } from 'react'
import { Plus, Building2, Users, Settings, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Organizations() {
  const [organizations, setOrganizations] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const createOrganization = async (e) => {
    e.preventDefault()
    if (orgName.trim()) {
      setIsCreating(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newOrg = {
        id: Date.now().toString(),
        name: orgName,
        slug: orgName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        members: 1,
        createdAt: new Date().toISOString(),
        plan: 'starter'
      }
      
      setOrganizations([newOrg, ...organizations])
      setOrgName('')
      setShowCreateForm(false)
      setIsCreating(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
        <p className="mt-2 text-gray-600">Manage your business organizations and teams</p>
      </div>

      {/* Create Organization Section */}
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

      {/* Organizations Grid */}
      {organizations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Organizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map(org => (
              <div key={org.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {org.name}
                      </h3>
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                        {org.plan}
                      </span>
                    </div>
                  </div>
                  <Settings className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{org.members} member{org.members !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Created {new Date(org.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors">
                    Manage
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center">
                    View
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {organizations.length === 0 && !showCreateForm && (
        <div className="text-center py-16">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No organizations yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Organizations help you manage multiple businesses, teams, and services in one place.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Organization
          </button>
        </div>
      )}

      {/* Features Section */}
      {organizations.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">What can you do with organizations?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Team Management</h4>
              <p className="text-gray-600 text-sm">Invite team members and manage permissions</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Multiple Businesses</h4>
              <p className="text-gray-600 text-sm">Manage different businesses under one account</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Custom Settings</h4>
              <p className="text-gray-600 text-sm">Configure each organization independently</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
