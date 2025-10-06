'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { LayoutDashboard, LogOut, Users, Settings } from 'lucide-react'

export default function DashboardNav({ user }) {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <LayoutDashboard className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Dashboard</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link href="/dashboard/organizations" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                <Users className="h-4 w-4 mr-2" />
                Organizations
              </Link>
              <Link href="/dashboard/settings" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Welcome, {session?.user?.name || session?.user?.email}
            </div>
            
            <button
              onClick={() => signOut()}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
