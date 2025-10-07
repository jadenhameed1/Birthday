import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function BusinessInsights() {
  const [insights, setInsights] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWeeklyInsights = async () => {
    console.log('🔘 BUTTON CLICKED - Function started');
    setIsGenerating(true);
    
    try {
      // Get current metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('business_metrics')
        .select('*');
      
      console.log('📊 Metrics loaded:', metrics);
      if (metricsError) console.error('Metrics error:', metricsError);

      // Generate AI-powered insights
      console.log('🤖 Calling AI API...');
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [],
          systemPrompt: `Analyze these business metrics and provide 3-5 actionable insights:
          ${metrics?.map(m => `${m.metric_name}: ${m.current_value} (Target: ${m.target_value})`).join('\n')}
          
          Provide concise, data-driven insights with specific recommendations. Focus on growth opportunities and risks.`
        })
      });

      console.log('✅ AI Response received');
      const data = await response.json();
      
      // Create insights table if it doesn't exist (fallback)
      const { data: newInsight, error: insertError } = await supabase
        .from('business_insights')
        .insert([{
          content: data.response,
          insight_type: 'weekly_report',
          generated_at: new Date()
        }])
        .select()
        .single();

      if (insertError) {
        console.log('⚠️  Insights table might not exist, creating fallback insights');
        setInsights(prev => [{
          id: Date.now(),
          content: data.response,
          generated_at: new Date().toISOString()
        }, ...prev]);
      } else if (newInsight) {
        console.log('💾 Insight saved to database');
        setInsights(prev => [newInsight, ...prev]);
      }
      
    } catch (error) {
      console.error('❌ Error generating insights:', error);
    } finally {
      setIsGenerating(false);
      console.log('🏁 Function completed');
    }
  };

  const loadInsights = async () => {
    const { data: existingInsights, error } = await supabase
      .from('business_insights')
      .select('*')
      .order('generated_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.log('No insights table yet, starting fresh');
      return;
    }
    
    if (existingInsights) setInsights(existingInsights);
  };

  useEffect(() => {
    loadInsights();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md" style={{ position: 'relative', zIndex: 10 }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Business Insights</h3>
        <button
          onClick={generateWeeklyInsights}
          disabled={isGenerating}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          style={{ position: 'relative', zIndex: 20 }}
        >
          {isGenerating ? 'Generating...' : 'Generate Insights'}
        </button>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={insight.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 mb-2">
              {new Date(insight.generated_at).toLocaleDateString()}
            </div>
            <div className="text-gray-800 whitespace-pre-wrap">{insight.content}</div>
          </div>
        ))}
        
        {insights.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No insights generated yet. Click the button to get AI-powered business analysis.
          </div>
        )}
      </div>
    </div>
  );
}
