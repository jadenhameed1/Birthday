'use client'
import Link from 'next/link'
import { Rocket, Zap, Users, Shield, MessageCircle, Brain, BarChart3 } from 'lucide-react'
import { useState, useEffect } from 'react'

// FRESH AI Chat Component with awesome thinking animation
function FreshAIChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          systemPrompt: "You are a helpful AI business assistant for TechEcosystem. Provide specific, actionable advice about business strategy, growth, marketing, and technology ecosystems. Be concise but insightful."
        })
      })

      const data = await response.json()
      const aiMessage = { role: 'assistant', content: data.response }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
      const aiMessage = { role: 'assistant', content: "🚀 I'm here to help! I can provide business insights, growth strategies, and technical guidance for your ecosystem." }
      setMessages(prev => [...prev, aiMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!showChat) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowChat(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center gap-2 animate-bounce"
        >
          <Brain className="h-6 w-6" />
          <span className="font-semibold">AI Assistant</span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-300 flex flex-col transform transition-all duration-300">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          <span className="font-bold">AI Business Assistant</span>
        </div>
        <button 
          onClick={() => setShowChat(false)}
          className="text-white hover:text-gray-200 text-lg font-bold hover:scale-110 transition-transform"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-10 w-10 text-blue-600" />
            </div>
            <p className="font-bold text-gray-700 mb-2">Welcome to your AI Assistant! 🚀</p>
            <p className="text-sm text-gray-600 mb-4">I can help you with:</p>
            <div className="text-xs space-y-1">
              <p className="text-blue-600">💼 Business Strategy & Growth</p>
              <p className="text-green-600">📈 Marketing & Customer Acquisition</p>
              <p className="text-purple-600">💰 Pricing & Revenue Models</p>
              <p className="text-orange-600">🔧 Technology Ecosystem Planning</p>
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-800 shadow-lg border border-gray-200'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-800 px-4 py-3 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="font-medium">Analyzing your business...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about business strategy, growth, or marketing..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

// Your main Home component
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TechEcosystem</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/analytics" className="text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
              <Link href="/team" className="text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors flex items-center gap-1">
                <Users className="h-4 w-4" />
                Team
              </Link>
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
                Sign In
              </Link>
              <Link 
                href="/ai-demo" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                Try AI Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
          Build the Future of
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">Business Ecosystems</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          A scalable, AI-driven platform that becomes the operating system for your industry. 
          Join the ecosystem that makes competition obsolete through intelligent automation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/ai-demo" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            🚀 Try AI Demo
          </Link>
          <Link 
            href="/analytics" 
            className="border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all text-lg font-semibold"
          >
            View Analytics
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">AI-Powered</h3>
            <p className="text-gray-600 leading-relaxed">
              Leverage cutting-edge AI for automation, predictions, and intelligent workflows that learn and adapt.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Team Collaboration</h3>
            <p className="text-gray-600 leading-relaxed">
              Invite team members, share insights, and collaborate on business strategies in real-time.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Enterprise Ready</h3>
            <p className="text-gray-600 leading-relaxed">
              Secure, scalable infrastructure built for million-to-billion dollar growth and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* FRESH AI Chat */}
      <FreshAIChat />
    </div>
  )
}
