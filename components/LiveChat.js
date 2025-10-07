'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [rooms, setRooms] = useState([])
  const [activeRoom, setActiveRoom] = useState('General')
  const [onlineUsers, setOnlineUsers] = useState(0)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadRooms()
    loadMessages()
    setupRealtimeSubscription()
  }, [activeRoom])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadRooms = async () => {
    const { data } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('is_private', false)
    
    setRooms(data || [])
  }

  const loadMessages = async () => {
    const { data } = await supabase
      .from('live_chat_messages')
      .select('*')
      .eq('room_id', activeRoom)
      .order('created_at', { ascending: true })
      .limit(50)
    
    setMessages(data || [])
  }

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('live_chat')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'live_chat_messages',
          filter: `room_id=eq.${activeRoom}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const message = {
      room_id: activeRoom,
      user_name: 'You', // In real app, use actual user name
      message: newMessage,
      message_type: 'text'
    }

    const { error } = await supabase
      .from('live_chat_messages')
      .insert([message])

    if (!error) {
      setNewMessage('')
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition z-40"
      >
        <span className="text-xl">💬</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-blue-100 text-sm">{onlineUsers} online</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-blue-200"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Room Selector */}
          <div className="border-b">
            <select
              value={activeRoom}
              onChange={(e) => setActiveRoom(e.target.value)}
              className="w-full p-2 text-sm border-none focus:ring-0"
            >
              {rooms.map(room => (
                <option key={room.id} value={room.name}>
                  #{room.name}
                </option>
              ))}
            </select>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex ${
                  message.user_name === 'You' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 ${
                    message.user_name === 'You'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white border rounded-bl-none'
                  }`}
                >
                  {message.user_name !== 'You' && (
                    <div className="font-medium text-sm text-gray-700 mb-1">
                      {message.user_name}
                    </div>
                  )}
                  <div className="text-sm">{message.message}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.user_name === 'You' ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(message.created_at)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t p-3 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}
