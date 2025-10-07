import DashboardNav from '@/components/DashboardNav'

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <p className="text-gray-500 text-center py-8">
                  All your notifications in one place (coming soon)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
