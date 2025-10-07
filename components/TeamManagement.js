'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'member' })

  useEffect(() => {
    loadTeamMembers()
  }, [])

  const loadTeamMembers = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setTeamMembers(data || [])
  }

  const inviteTeamMember = async () => {
    if (!newMember.name || !newMember.email) return

    const { data, error } = await supabase
      .from('team_members')
      .insert([{ ...newMember, status: 'invited' }])
      .select()

    if (!error) {
      setTeamMembers(prev => [data[0], ...prev])
      setNewMember({ name: '', email: '', role: 'member' })
      setShowInviteModal(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">👥 Team Management</h2>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          + Invite Team Member
        </button>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow p-4 border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    member.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800'
                      : member.role === 'manager'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.role}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    member.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Invite Team Member</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="member">Member</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={inviteTeamMember}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Send Invite
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
