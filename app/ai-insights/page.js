import AIInsightsDashboard from '@/components/AIInsightsDashboard'
import DashboardNav from '@/components/DashboardNav'

export default function AIInsightsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <AIInsightsDashboard />
          </div>
        </div>
      </main>
    </div>
  )
}
