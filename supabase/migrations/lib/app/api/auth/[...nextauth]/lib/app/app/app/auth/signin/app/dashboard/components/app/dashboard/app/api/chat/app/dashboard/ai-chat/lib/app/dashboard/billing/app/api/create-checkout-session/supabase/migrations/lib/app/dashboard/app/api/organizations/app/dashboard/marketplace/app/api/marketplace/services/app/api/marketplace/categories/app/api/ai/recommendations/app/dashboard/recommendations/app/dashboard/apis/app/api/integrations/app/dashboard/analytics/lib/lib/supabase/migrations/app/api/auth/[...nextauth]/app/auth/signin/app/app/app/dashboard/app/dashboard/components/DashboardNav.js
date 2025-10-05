'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { LayoutDashboard, LogOut } from 'lucide-react'

export default function DashboardNav({ user }) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <LayoutDashboard className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Welcome, {user?.name || user?.email}
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