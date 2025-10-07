import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DataDrivenAIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [businessMetrics, setBusinessMetrics] = useState(null);

  // Load business metrics and conversation
  useEffect(() => {
    loadBusinessData();
    loadOrCreateConversation();
  }, []);

  const loadBusinessData = async () => {
    const { data: metrics } = await supabase
      .from('business_metrics')
      .select('*');
    
    if (metrics) {
      const metricsObj = {};
      metrics.forEach(metric => {
        metricsObj[metric.metric_name] = metric.metric_value;
      });
      setBusinessMetrics(metricsObj);
    }
  };

  const loadOrCreateConversation = async () => {
    const { data: conversations } = await supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (conversations?.length > 0) {
      setConversationId(conversations[0].id);
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversations[0].id)
        .order('created_at', { ascending: true });
      if (messages) setMessages(messages);
    } else {
      const { data: newConversation } = await supabase
        .from('conversations')
        .insert([{ title: 'Data-Driven Strategy Session' }])
        .select()
        .single();
      if (newConversation) setConversationId(newConversation.id);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Save user message
    await supabase.from('messages').insert([{
      conversation_id: conversationId,
      role: 'user',
      content: input
    }]);

    try {
      // Enhanced system prompt with REAL metrics
      const systemPrompt = `You are a data-driven AI Business Assistant. Analyze these ACTUAL business metrics:

CURRENT PERFORMANCE:
- Monthly Revenue: $${businessMetrics?.monthly_revenue || 'N/A'} (Target: $20,000)
- Customers: ${businessMetrics?.customer_count || 'N/A'} (Target: 150)
- Growth Rate: ${businessMetrics?.monthly_growth_rate || 'N/A'}% (Target: 15%)
- Customer Acquisition Cost: $${businessMetrics?.customer_acquisition_cost || 'N/A'} (Target: $120)
- Retention Rate: ${businessMetrics?.user_retention_rate || 'N/A'}% (Target: 75%)

Provide SPECIFIC, DATA-BASED recommendations. Identify gaps between current and target metrics. Suggest actionable strategies to close these gaps.`;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...updatedMessages],
          systemPrompt
        })
      });

      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.response };

      // Save AI response
      await supabase.from('messages').insert([{
        conversation_id: conversationId,
        role: 'assistant',
        content: data.response
      }]);

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Current Metrics Overview */}
      {businessMetrics && (
        <div className="bg-blue-50 p-4 border-b">
          <h3 className="font-semibold mb-2">📊 Live Business Metrics</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Revenue: <strong>${businessMetrics.monthly_revenue}</strong></div>
            <div>Customers: <strong>{businessMetrics.customer_count}</strong></div>
            <div>Growth: <strong>{businessMetrics.monthly_growth_rate}%</strong></div>
            <div>Retention: <strong>{businessMetrics.user_retention_rate}%</strong></div>
          </div>
        </div>
      )}
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
              message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              Analyzing your metrics...
            </div>
          </div>
        )}
      </div>
      
      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about improving metrics..."
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
