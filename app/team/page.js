import TeamManagement from '@/components/TeamManagement'
import SharedChat from '@/components/SharedChat'
import DashboardNav from '@/components/DashboardNav'

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 space-y-8">
            <TeamManagement />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💬 Team Collaboration</h2>
              <SharedChat />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
