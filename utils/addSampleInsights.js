// Run this once to add sample insights
import { supabase } from '@/lib/supabase'

const sampleInsights = [
  {
    insight_type: 'growth_opportunity',
    insight_text: 'Your customer acquisition cost is 35% below industry average. Consider increasing marketing budget to accelerate growth.',
    confidence_score: 0.87
  },
  {
    insight_type: 'revenue_optimization',
    insight_text: 'Premium tier conversion could increase by 22% with improved feature highlighting during onboarding.',
    confidence_score: 0.92
  },
  {
    insight_type: 'risk_alert',
    insight_text: 'Churn rate increased 15% this month. Recommend proactive customer success outreach.',
    confidence_score: 0.78
  },
  {
    insight_type: 'efficiency_gain',
    insight_text: 'Automating customer onboarding could save 120 team hours monthly and improve conversion.',
    confidence_score: 0.85
  }
]

async function addSampleInsights() {
  const { data, error } = await supabase
    .from('ai_insights')
    .insert(sampleInsights)
  
  if (error) {
    console.error('Error adding insights:', error)
  } else {
    console.log('Sample insights added successfully!')
  }
}

// Uncomment to run:
// addSampleInsights()
