'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardNav from '@/components/DashboardNav'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (status === 'loading') return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  if (!session) redirect('/auth/signin')

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // SMART RESPONSE SYSTEM - Guaranteed specific responses
    const lowerInput = input.toLowerCase()
    let aiResponse = ""

    if (lowerInput.includes('pricing') || lowerInput.includes('price')) {
      aiResponse = "For your marketplace, implement: Transaction fees 15-20%, Subscription tiers: Starter ($49/mo), Pro ($99/mo), Enterprise ($199/mo). Balance accessibility with premium features."
    }
    else if (lowerInput.includes('growth') || lowerInput.includes('customer')) {
      aiResponse = "Marketplace growth: 1) Referral program with $50 credits, 2) Partner with business associations, 3) Content marketing for small businesses, 4) Cold outreach to service providers."
    }
    else if (lowerInput.includes('competition') || lowerInput.includes('competitive')) {
      aiResponse = "Differentiate by: 1) Niche vertical focus, 2) Better provider onboarding, 3) Escrow payments for trust, 4) Analytics dashboards, 5) Superior customer support."
    }
    else if (lowerInput.includes('revenue') || lowerInput.includes('money')) {
      aiResponse = "Revenue streams: 1) Transaction fees (15-20%), 2) Subscription tiers, 3) Premium features, 4) Featured listings, 5) API access for enterprises."
    }
    else {
      aiResponse = "I specialize in marketplace business strategy. Ask me about: pricing models, customer acquisition, competitive positioning, or revenue optimization."
    }

    setTimeout(() => {
      const aiMessage = { role: 'assistant', content: aiResponse }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-800">AI Business Assistant</h1>
            <p className="text-gray-600">Welcome back, {session.user?.email}</p>
          </div>
          
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && <div className="flex justify-start"><div className="bg-gray-100 px-4 py-2 rounded-lg">Thinking...</div></div>}
          </div>
          
          <div className="p-6 border-t bg-gray-50">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about pricing, growth, competition..."
                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={sendMessage} disabled={isLoading} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
