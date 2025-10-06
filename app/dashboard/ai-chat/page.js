'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Zap, Lightbulb, TrendingUp, Rocket } from 'lucide-react'

export default function AIChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Sample AI responses for demo
  const aiResponses = {
    'hello': "Hello! I'm your AI Business Assistant. I can help you with business strategy, market analysis, growth planning, and more. What would you like to discuss?",
    'help': "I can assist you with:\n• Business strategy development\n• Market analysis and research\n• Growth planning and scaling\n• Competitive analysis\n• Product development insights\n• Marketing strategy\n• Financial planning\n\nWhat specific area would you like help with?",
    'strategy': "Based on your tech ecosystem platform, here's a strategic framework:\n\n1. **Customer Acquisition**: Focus on SaaS businesses looking for integrated solutions\n2. **Monetization**: Tiered pricing with platform fees + transaction fees\n3. **Growth Leverage**: Network effects - more services attract more users\n4. **Competitive Moats**: AI recommendations and ecosystem lock-in\n\nWould you like me to elaborate on any of these areas?",
    'growth': "For rapid growth in your ecosystem platform:\n\n🚀 **Immediate Actions**:\n• Partner with 3-5 key service providers\n• Launch referral program for early users\n• Create case studies from beta testers\n\n📈 **Medium-term**:\n• Expand to adjacent markets (consulting, agencies)\n• Develop API marketplace\n• Add enterprise features\n\n💡 **Long-term**:\n• Become the \"App Store\" for business services\n• Develop proprietary AI insights\n• Expand globally with localized services",
    'default': "That's an interesting question! As your AI Business Assistant, I can provide insights on:\n\n• Market trends in your industry\n• Competitive positioning strategies\n• Customer acquisition cost optimization\n• Revenue model refinement\n• Scaling operations efficiently\n\nCould you provide more specific details about what you're looking to achieve?"
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Add welcome message on component mount
  useEffect(() => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: "Hello! I'm your AI Business Assistant. I can help you with:\n\n• Business strategy and planning\n• Market analysis and insights\n• Growth strategy development\n• Competitive intelligence\n• Operational optimization\n\nWhat would you like to discuss about your tech ecosystem business?",
        timestamp: new Date()
      }
    ])
  }, [])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

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
      const lowerInput = input.toLowerCase()
      let response = aiResponses.default

      if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        response = aiResponses.hello
      } else if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
        response = aiResponses.help
      } else if (lowerInput.includes('strategy') || lowerInput.includes('plan')) {
        response = aiResponses.strategy
      } else if (lowerInput.includes('growth') || lowerInput.includes('scale')) {
        response = aiResponses.growth
      }

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const quickQuestions = [
    "Help me with business strategy",
    "How can I grow faster?",
    "Analyze my competitive position",
    "Suggest marketing ideas"
  ]

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Business Assistant</h1>
            <p className="text-gray-600">Get strategic insights for your ecosystem platform</p>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick questions to get started:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm text-gray-700"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-600 ml-3' 
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 mr-3'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mr-3 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-900">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={sendMessage} className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about business strategy, growth, marketing, or competition..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </button>
          </form>
        </div>
      </div>

      {/* AI Capabilities Footer */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center mb-2">
            <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-blue-900">Strategic Insights</h4>
          </div>
          <p className="text-sm text-blue-700">Get data-driven business recommendations</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            <h4 className="font-semibold text-green-900">Growth Planning</h4>
          </div>
          <p className="text-sm text-green-700">Scale your ecosystem effectively</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center mb-2">
            <Rocket className="h-5 w-5 text-purple-600 mr-2" />
            <h4 className="font-semibold text-purple-900">Market Analysis</h4>
          </div>
          <p className="text-sm text-purple-700">Understand competitive landscape</p>
        </div>
      </div>
    </div>
  )
}
