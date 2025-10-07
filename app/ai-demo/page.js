'use client'
import { useState, useEffect } from 'react'
import { Brain, ArrowLeft, Zap, History } from 'lucide-react'
import Link from 'next/link'

export default function AIDemoPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [conversationCount, setConversationCount] = useState(0)

  // Load conversation count on mount
  useEffect(() => {
    loadConversationCount()
  }, [])

  const loadConversationCount = async () => {
    try {
      const response = await fetch('/api/ai/conversations')
      const data = await response.json()
      setConversationCount(data.count || 0)
    } catch (error) {
      console.log('Could not load conversation count')
    }
  }

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
          systemPrompt: "You are a helpful AI business assistant for TechEcosystem. Provide specific, actionable advice about business strategy, growth, marketing, and technology ecosystems. Be concise but insightful and helpful.",
          conversationId: conversationId
        })
      })

      const data = await response.json()
      const aiMessage = { role: 'assistant', content: data.response }
      setMessages(prev => [...prev, aiMessage])
      
      // Update conversation ID if this is a new conversation
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId)
        setConversationCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error:', error)
      const aiMessage = { role: 'assistant', content: "🚀 I'm here to help! I can provide business insights, growth strategies, and technical guidance for your ecosystem." }
      setMessages(prev => [...prev, aiMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const startNewConversation = () => {
    setMessages([])
    setConversationId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <nav className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AI Business Assistant</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <History className="h-4 w-4" />
                <span>{conversationCount} conversations saved</span>
              </div>
              <button
                onClick={startNewConversation}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                New Chat
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Chat */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-8 w-8" />
              <h1 className="text-3xl font-bold">AI Business Assistant</h1>
            </div>
            <p className="text-blue-100">Get instant insights on business strategy, growth, marketing, and technology</p>
            {conversationId && (
              <div className="flex items-center gap-2 mt-2 text-blue-200 text-sm">
                <History className="h-4 w-4" />
                <span>Conversation saved to database</span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-12">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-12 w-12 text-blue-600" />
                </div>
                <p className="font-bold text-2xl text-gray-700 mb-4">Welcome to Your AI Assistant! 🚀</p>
                <p className="text-lg text-gray-600 mb-6">I'm here to help you with:</p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-semibold text-blue-700">💼 Business Strategy</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-semibold text-green-700">📈 Growth Planning</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="font-semibold text-purple-700">💰 Revenue Models</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="font-semibold text-orange-700">🔧 Tech Ecosystems</p>
                  </div>
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
                    <span className="font-medium">Analyzing your business strategy...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 border-t bg-white">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me about business strategy, growth, marketing, pricing..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
