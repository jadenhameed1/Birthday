'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Zap, Lightbulb, TrendingUp, Rocket } from 'lucide-react'

export default function AIChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

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
        content: "Hello! I'm your AI Business Assistant. I can help you with business strategy, market analysis, growth planning, and more. What would you like to discuss about your tech ecosystem platform?",
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

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I understand you're asking about: \"" + input + "\". As your AI Business Assistant, I can provide strategic insights on business growth, market positioning, and ecosystem development. In a full implementation, this would connect to OpenAI GPT-4 for real AI responses.",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

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
              placeholder="Ask about business strategy, growth, or market analysis..."
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
    </div>
  )
}
