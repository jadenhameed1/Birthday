'use client'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardNav from '@/components/DashboardNav'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Redirecting...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.email}!</h1>
              <p className="text-gray-600 mt-2">Monitor your key metrics and AI-generated insights</p>
            </div>
            <AnalyticsDashboard />
          </div>
        </div>
      </main>
    </div>
  )
}
