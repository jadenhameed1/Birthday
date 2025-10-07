'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import FileUpload from './FileUpload'
import { pushService } from '@/utils/pushService'

export default function EnhancedLiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [rooms, setRooms] = useState([])
  const [activeRoom, setActiveRoom] = useState('General')
  const [onlineUsers, setOnlineUsers] = useState(12)
  const [showFileUpload, setShowFileUpload] = useState(false)
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
      .limit(100)
    
    setMessages(data || [])
  }

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('enhanced_live_chat')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'live_chat_messages',
          filter: `room_id=eq.${activeRoom}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
          
          // Show push notification for new messages (not from current user)
          if (payload.new.user_name !== 'You' && !isOpen) {
            pushService.notifyNewMessage(payload.new)
          }
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }

  const sendMessage = async (messageText = null, messageType = 'text') => {
    const messageContent = messageText || newMessage
    if (!messageContent.trim()) return

    const message = {
      room_id: activeRoom,
      user_name: 'You',
      message: messageContent,
      message_type: messageType
    }

    const { error } = await supabase
      .from('live_chat_messages')
      .insert([message])

    if (!error) {
      setNewMessage('')
      setShowFileUpload(false)
    }
  }

  const handleFileUpload = (fileInfo) => {
    const fileMessage = `📎 ${fileInfo.name} (${formatFileSize(fileInfo.size)}) - ${fileInfo.url}`
    sendMessage(fileMessage, 'file')
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const renderMessage = (message) => {
    if (message.message_type === 'file') {
      const parts = message.message.split(' - ')
      const fileName = parts[0].replace('📎 ', '')
      const fileUrl = parts[1]
      
      return (
        <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded border">
          <span className="text-lg">📎</span>
          <div className="flex-1">
            <div className="font-medium text-sm">{fileName}</div>
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 text-xs hover:underline"
            >
              Download File
            </a>
          </div>
        </div>
      )
    }

    return <div className="text-sm">{message.message}</div>
  }

  return (
    <>
      {/* Enhanced Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition z-40 flex items-center space-x-2"
      >
        <span className="text-xl">💬</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      </button>

      {/* Enhanced Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Enhanced Live Chat</h3>
                <p className="text-blue-100 text-sm">{onlineUsers} users online</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  className="text-white hover:text-blue-200 p-1"
                  title="Attach files"
                >
                  📎
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-blue-200"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Room Selector */}
          <div className="border-b bg-gray-50">
            <select
              value={activeRoom}
              onChange={(e) => setActiveRoom(e.target.value)}
              className="w-full p-2 text-sm border-none bg-transparent focus:ring-0"
            >
              {rooms.map(room => (
                <option key={room.id} value={room.name}>
                  #{room.name}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload Area */}
          {showFileUpload && (
            <div className="border-b bg-yellow-50 p-3">
              <FileUpload 
                onUploadComplete={handleFileUpload}
                maxSize={10}
              />
              <button
                onClick={() => setShowFileUpload(false)}
                className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}

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
                  {renderMessage(message)}
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
                onClick={() => sendMessage()}
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
