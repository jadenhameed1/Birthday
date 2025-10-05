import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome back, {session.user.name || session.user.email}!
      </p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Your Organizations</h3>
          <p className="text-gray-600 mt-2">Create or join organizations to get started</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">AI Assistant</h3>
          <p className="text-gray-600 mt-2">Get help with business strategy</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Marketplace</h3>
          <p className="text-gray-600 mt-2">Discover services for your business</p>
        </div>
      </div>
    </div>
  )
}