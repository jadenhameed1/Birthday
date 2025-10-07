"use client";
import { useEffect } from 'react'
import { testSupabaseConnection } from '../lib/test-supabase'
import { testChatService } from '../lib/test-chat-service'

export default function TestChat() {
  useEffect(() => {
    const runTests = async () => {
      console.log('🧪 Running chat system tests...')
      
      // Test Supabase
      const supabaseOk = await testSupabaseConnection()
      
      // Test Chat Service
      const chatServiceOk = await testChatService()
      
      if (supabaseOk && chatServiceOk) {
        console.log('🎉 ALL COMPONENT TESTS PASSED!')
        alert('✅ All tests passed! Check console for details.')
      } else {
        console.error('❌ Some tests failed')
        alert('❌ Tests failed! Check console for details.')
      }
    }
    
    runTests()
  }, [])

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
      <h2 className="text-lg font-bold">🧪 Test Component</h2>
      <p>Check browser console for test results...</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Run Tests Again
      </button>
    </div>
  )
}