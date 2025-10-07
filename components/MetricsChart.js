'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

const sampleData = [
  { month: 'Jan', revenue: 22000, users: 1200, conversions: 38 },
  { month: 'Feb', revenue: 25000, users: 1450, conversions: 42 },
  { month: 'Mar', revenue: 28450, users: 1542, conversions: 49 },
  { month: 'Apr', revenue: 31200, users: 1680, conversions: 53 },
  { month: 'May', revenue: 28900, users: 1620, conversions: 47 },
  { month: 'Jun', revenue: 33100, users: 1780, conversions: 58 }
]

export default function MetricsChart() {
  return (
    <div className="space-y-6">
      {/* Revenue Trend Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Users & Conversions Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">User Growth & Conversions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#10b981" />
            <Bar dataKey="conversions" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
