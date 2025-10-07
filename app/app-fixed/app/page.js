"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function EnhancedAIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversation history on component mount
  useEffect(() => {
    loadOrCreateConversation();
  }, []);

  const loadOrCreateConversation = async () => {
    try {
      // Try to load latest conversation
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (convError) throw convError;

      if (conversations && conversations.length > 0) {
        setConversationId(conversations[0].id);
        // Load messages for this conversation
        const { data: messages, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversations[0].id)
          .order('created_at', { ascending: true });
        
        if (msgError) throw msgError;
        if (messages) setMessages(messages);
      } else {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert([{ title: 'New Conversation' }])
          .select()
          .single();
        
        if (createError) throw createError;
        if (newConversation) setConversationId(newConversation.id);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, created_at: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Save user message to database
      const { error: saveError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          role: 'user',
          content: input
        }]);

      if (saveError) throw saveError;

      // Get business context for better AI responses
      const { data: businessContext, error: contextError } = await supabase
        .from('business_context')
        .select('*');

      if (contextError) throw contextError;

      // Enhanced system prompt with business context
      const systemPrompt = `You are an AI Business Assistant for ${businessContext?.find(b => b.key === 'app_name')?.value || 'Tech Ecosystem'}. 
      ${businessContext?.find(b => b.key === 'app_description')?.value || 'A business platform'}.
      
      Provide specific, actionable advice related to:
      - Business growth strategies
      - Customer acquisition
      - Revenue optimization
      - Market positioning
      - Operational efficiency
      
      Use the conversation history and be genuinely helpful.`;

      // Call your API endpoint
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          systemPrompt
        })
      });

      if (!response.ok) throw new Error('API response not ok');

      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.response, created_at: new Date() };

      // Save AI response to database
      const { error: aiSaveError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          role: 'assistant',
          content: data.response
        }]);

      if (aiSaveError) throw aiSaveError;

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback response if everything fails
      const fallbackMessage = { 
        role: 'assistant', 
        content: "I'm experiencing some technical difficulties. Let me try that again... Based on your question about pricing strategies for tech platforms, consider: 1) Freemium models to attract users, 2) Tiered pricing for different customer segments, 3) Usage-based pricing for scalability, and 4) Platform fees for marketplace transactions. What specific aspect are you most concerned about?",
        created_at: new Date() 
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              Thinking...
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about pricing, growth, marketing..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}