'use client'
import { useState, useEffect, useRef } from 'react'
import DashboardNav from '@/components/DashboardNav'

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI Business Assistant. I can help you with business strategy, growth planning, market analysis, and much more. What would you like to discuss today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI thinking and response
    setTimeout(() => {
      const aiResponses = [
        "Based on your query, I'd recommend focusing on customer retention strategies. Consider implementing a loyalty program and personalized follow-ups.",
        "For business growth, I suggest exploring new market segments. The data shows opportunities in the healthcare and education sectors.",
        "Your pricing strategy could be optimized. Consider a tiered pricing model with premium features to increase average revenue per customer.",
        "To improve operational efficiency, look into automating repetitive tasks. This could save up to 10 hours per week for your team.",
        "Market analysis indicates growing demand for AI-powered solutions. This could be a valuable addition to your service offerings.",
        "Consider conducting customer satisfaction surveys to identify areas for improvement. Happy customers are 5x more likely to return.",
        "Your business shows strong growth potential. Focus on scaling your marketing efforts and expanding your service portfolio."
      ]
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 2000)
  }

  const quickQuestions = [
    'Help with business strategy',
    'How can I grow faster?',
    'Analyze my competition',
    'Marketing ideas',
    'Pricing optimization'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🤖</div>
              <div>
                <h1 className="text-2xl font-bold">AI Business Assistant</h1>
                <p className="text-blue-100">Get instant insights on business strategy, growth, and optimization</p>
              </div>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="p-4 border-b bg-gray-50">
            <p className="text-sm text-gray-600 mb-3">Quick questions to get started:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-3/4 rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none border'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {message.role === 'assistant' && (
                      <div className="text-xl mt-1">🤖</div>
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="text-xl mt-1">👤</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-4 rounded-bl-none border">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-white rounded-b-lg">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me about business strategy, growth, marketing, or competition..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">Business Analytics</h3>
            <p className="text-gray-600 text-sm">Get insights on performance metrics and growth opportunities</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold mb-2">Growth Strategy</h3>
            <p className="text-gray-600 text-sm">AI-powered recommendations for scaling your business</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-semibold mb-2">Smart Insights</h3>
            <p className="text-gray-600 text-sm">Actionable advice based on market trends and data</p>
          </div>
        </div>
      </main>
    </div>
  )
}
