'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SharedChat() {
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [newChatTitle, setNewChatTitle] = useState('')

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id)
    }
  }, [activeConversation])

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from('team_conversations')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setConversations(data || [])
  }

  const loadMessages = async (conversationId) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    
    if (!error) setMessages(data || [])
  }

  const createNewConversation = async () => {
    if (!newChatTitle) return

    const { data, error } = await supabase
      .from('team_conversations')
      .insert([{ title: newChatTitle }])
      .select()

    if (!error) {
      setConversations(prev => [data[0], ...prev])
      setNewChatTitle('')
      setShowNewChatModal(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return

    const message = {
      conversation_id: activeConversation.id,
      role: 'user',
      content: newMessage
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()

    if (!error) {
      setMessages(prev => [...prev, data[0]])
      setNewMessage('')
    }
  }

  return (
    <div className="flex h-96 bg-white rounded-lg shadow">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <button
            onClick={() => setShowNewChatModal(true)}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            + New Team Chat
          </button>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConversation(conv)}
              className={`p-4 border-b cursor-pointer ${
                activeConversation?.id === conv.id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <h3 className="font-semibold">{conv.title}</h3>
              <p className="text-sm text-gray-500">
                {conv.created_at ? new Date(conv.created_at).toLocaleDateString() : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="p-4 border-b">
              <h3 className="font-semibold">{activeConversation.title}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation or create a new one
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Team Chat</h3>
            <input
              type="text"
              placeholder="Chat Title"
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex space-x-2">
              <button
                onClick={createNewConversation}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
