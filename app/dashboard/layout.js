import DashboardNav from '@/components/DashboardNav'

// Demo user data
const demoUser = {
  name: 'Demo User',
  email: 'demo@techecosystem.com'
}

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={demoUser} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
