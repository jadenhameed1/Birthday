'use client'

import { useState } from 'react'
import { Plus, Building2, Users, Settings } from 'lucide-react'

export default function Organizations() {
  const [organizations, setOrganizations] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [orgName, setOrgName] = useState('')

  const createOrganization = (e) => {
    e.preventDefault()
    if (orgName.trim()) {
      const newOrg = {
        id: Date.now(),
        name: orgName,
        members: 1,
        createdAt: new Date().toISOString()
      }
      setOrganizations([...organizations, newOrg])
      setOrgName('')
      setShowCreateForm(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
        <p className="mt-2 text-gray-600">Manage your business organizations</p>
      </div>

      {/* Create Organization */}
      <div className="mb-8">
        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Organization
          </button>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Create New Organization</h3>
            <form onSubmit={createOrganization} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter organization name"
                  autoFocus
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Organization
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map(org => (
          <div key={org.id} className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Building2 className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="font-semibold text-gray-900">{org.name}</h3>
              </div>
              <Settings className="h-4 w-4 text-gray-400 cursor-pointer" />
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Users className="h-4 w-4 mr-2" />
              <span>{org.members} member{org.members !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="text-xs text-gray-500">
              Created {new Date(org.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        
        {organizations.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations yet</h3>
            <p className="text-gray-600">Create your first organization to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
