'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: '📊 Dashboard' },
    { href: '/team', label: '👥 Team' },
    { href: '/marketplace', label: '🛍️ Marketplace' },
    { href: '/bookings', label: '📋 Bookings' },
    { href: '/providers', label: '👨‍💼 Providers' },
    { href: '/ai-insights', label: '🧠 AI Insights' },
    { href: '/chat', label: '🤖 AI Assistant' },
    { href: '/settings', label: '⚙️ Settings' }
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === item.href
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
              User
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
