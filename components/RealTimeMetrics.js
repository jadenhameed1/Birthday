'use client'
import { useState, useEffect } from 'react'

export default function RealTimeMetrics() {
  const [metrics, setMetrics] = useState({
    activeSessions: 0,
    revenueToday: 0,
    conversionsToday: 0
  })

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMetrics({
        activeSessions: Math.floor(Math.random() * 50) + 20,
        revenueToday: Math.floor(Math.random() * 5000) + 1000,
        conversionsToday: Math.floor(Math.random() * 15) + 5
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">📊 Live Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{metrics.activeSessions}</div>
          <div className="text-sm opacity-90">Active Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">${metrics.revenueToday.toLocaleString()}</div>
          <div className="text-sm opacity-90">Revenue Today</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{metrics.conversionsToday}</div>
          <div className="text-sm opacity-90">Conversions Today</div>
        </div>
      </div>
    </div>
  )
}
