'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [bookings, setBookings] = useState([])
  const [profile, setProfile] = useState(null)
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // In a real app, you'd filter by logged-in provider
      // For demo, we'll use the first provider
      const [bookingsRes, profileRes, portfolioRes] = await Promise.all([
        supabase.from('service_bookings').select('*, service_providers(name)').order('created_at', { ascending: false }),
        supabase.from('provider_profiles').select('*').limit(1).single(),
        supabase.from('provider_portfolio').select('*').order('created_at', { ascending: false })
      ])

      setBookings(bookingsRes.data || [])
      setProfile(profileRes.data)
      setPortfolio(portfolioRes.data || [])
      calculateStats(bookingsRes.data || [])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (bookingsData) => {
    const totalBookings = bookingsData.length
    const pendingBookings = bookingsData.filter(b => b.status === 'pending').length
    const completedBookings = bookingsData.filter(b => b.status === 'completed').length
    const totalRevenue = bookingsData
      .filter(b => b.status === 'completed')
      .reduce((sum, booking) => sum + (parseFloat(booking.budget) || 0), 0)

    setStats({ totalBookings, pendingBookings, completedBookings, totalRevenue })
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    const { error } = await supabase
      .from('service_bookings')
      .update({ status: newStatus })
      .eq('id', bookingId)

    if (!error) {
      loadDashboardData() // Reload data
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👨‍💼 Provider Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your services and bookings</p>
        </div>
        {profile && (
          <div className="text-right">
            <h2 className="text-xl font-semibold">{profile.company_name}</h2>
            <p className="text-gray-600">{profile.services_offered?.join(', ')}</p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border">
          <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-2xl font-bold text-green-600">{stats.completedBookings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-600">${stats.totalRevenue}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'bookings', 'portfolio', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
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
        {activeTab === 'overview' && <OverviewTab bookings={bookings} profile={profile} />}
        {activeTab === 'bookings' && <BookingsTab bookings={bookings} onStatusUpdate={updateBookingStatus} />}
        {activeTab === 'portfolio' && <PortfolioTab portfolio={portfolio} profile={profile} />}
        {activeTab === 'profile' && <ProfileTab profile={profile} />}
      </div>
    </div>
  )
}

function OverviewTab({ bookings, profile }) {
  const recentBookings = bookings.slice(0, 5)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
        <div className="space-y-3">
          {recentBookings.map(booking => (
            <div key={booking.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{booking.customer_name}</h4>
                  <p className="text-sm text-gray-600 truncate">{booking.project_description}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Budget: ${booking.budget}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Profile Summary</h3>
        {profile && (
          <div className="space-y-3">
            <div>
              <span className="font-medium">Company:</span>
              <p className="text-gray-600">{profile.company_name}</p>
            </div>
            <div>
              <span className="font-medium">Services:</span>
              <p className="text-gray-600">{profile.services_offered?.join(', ')}</p>
            </div>
            <div>
              <span className="font-medium">Experience:</span>
              <p className="text-gray-600">{profile.years_experience} years</p>
            </div>
            <div>
              <span className="font-medium">Hourly Rate:</span>
              <p className="text-gray-600">${profile.hourly_rate}/hour</p>
            </div>
            <div>
              <span className="font-medium">Verification:</span>
              <p className={`${profile.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                {profile.is_verified ? 'Verified ✓' : 'Pending Verification'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BookingsTab({ bookings, onStatusUpdate }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">All Bookings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">{booking.customer_name}</div>
                    <div className="text-sm text-gray-500">{booking.customer_email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">{booking.project_description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${booking.budget}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onStatusUpdate(booking.id, 'confirmed')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => onStatusUpdate(booking.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => onStatusUpdate(booking.id, 'in_progress')}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Start Work
                      </button>
                    )}
                    {booking.status === 'in_progress' && (
                      <button
                        onClick={() => onStatusUpdate(booking.id, 'completed')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PortfolioTab({ portfolio, profile }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Portfolio</h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          + Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-4xl">📁</span>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {item.category}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {portfolio.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No portfolio items yet.</p>
          <p className="text-gray-400 mt-2">Showcase your best work to attract more clients!</p>
        </div>
      )}
    </div>
  )
}

function ProfileTab({ profile }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <h3 className="text-lg font-semibold mb-4">Provider Profile</h3>
      
      {profile ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                defaultValue={profile.company_name}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="url"
                defaultValue={profile.website}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows="4"
              defaultValue={profile.description}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
              <input
                type="number"
                defaultValue={profile.hourly_rate}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Years Experience</label>
              <input
                type="number"
                defaultValue={profile.years_experience}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Services Offered</label>
            <input
              type="text"
              defaultValue={profile.services_offered?.join(', ')}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="UI/UX Design, Web Development, etc."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
              Cancel
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No profile found.</p>
      )}
    </div>
  )
}
