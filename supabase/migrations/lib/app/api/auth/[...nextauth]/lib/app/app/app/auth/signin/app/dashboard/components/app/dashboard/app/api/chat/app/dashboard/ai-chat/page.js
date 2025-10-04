'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Send, Bot, User } from 'lucide-react'

export default function AIChat() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationId
        }),
      })

      const data = await response.json()

      if (data.response) {
        const aiMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId)
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg h-[600px] flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">AI Business Assistant</h1>
          <p className="text-sm text-gray-600">
            Get help with business strategy, technology implementation, and ecosystem growth
          </p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">How can I help you today?</p>
              <p className="text-sm mt-2">Ask me about business strategy, technology, or ecosystem development</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-blue-600 ml-3' 
                        : 'bg-green-600 mr-3'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-600 mr-3 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
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
              placeholder="Ask about business strategy, technology, or ecosystem development..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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