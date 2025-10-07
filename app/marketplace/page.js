import ServiceMarketplace from '@/components/ServiceMarketplace'
import DashboardNav from '@/components/DashboardNav'

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <ServiceMarketplace />
          </div>
        </div>
      </main>
    </div>
  )
}
