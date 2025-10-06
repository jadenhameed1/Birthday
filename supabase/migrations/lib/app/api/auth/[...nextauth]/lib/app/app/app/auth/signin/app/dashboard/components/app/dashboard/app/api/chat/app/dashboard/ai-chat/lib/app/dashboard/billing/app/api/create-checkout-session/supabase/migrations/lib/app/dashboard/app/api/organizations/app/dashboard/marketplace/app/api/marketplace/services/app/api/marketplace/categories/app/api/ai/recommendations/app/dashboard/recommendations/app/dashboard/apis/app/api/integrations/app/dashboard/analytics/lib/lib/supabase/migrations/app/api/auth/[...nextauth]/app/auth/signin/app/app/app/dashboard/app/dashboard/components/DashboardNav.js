'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Dashboard() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome back, {session.user?.email}</p>
      
      {/* Simple link to chat test page */}
      <div className="mt-8">
        <a href="/chat-test" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go to Chat Test
        </a>
      </div>
    </div>
  )
}