import { supabase } from '@/lib/supabase'

export class AIAnalysisService {
  
  // Analyze booking data for insights
  static async analyzeBooking(bookingData) {
    try {
      const prompt = `
        Analyze this service booking and provide business insights:
        
        Customer: ${bookingData.customer_name}
        Service: ${bookingData.service_providers?.name}
        Budget: $${bookingData.budget}
        Description: ${bookingData.project_description}
        Timeline: ${bookingData.timeline}
        
        Please provide:
        1. Customer sentiment analysis
        2. Service delivery recommendations
        3. Potential upsell opportunities
        4. Risk assessment
        
        Format as JSON with: sentiment, recommendations[], opportunities[], risks[]
      `

      // In a real implementation, this would call your AI API
      // For demo, we'll generate mock analysis
      const mockAnalysis = {
        sentiment: this.analyzeSentiment(bookingData.project_description),
        recommendations: this.generateBookingRecommendations(bookingData),
        opportunities: this.identifyUpsellOpportunities(bookingData),
        risks: this.assessBookingRisks(bookingData),
        confidence: 0.85
      }

      // Save analysis to database
      const { error } = await supabase
        .from('ai_analysis')
        .insert([{
          analysis_type: 'booking_analysis',
          target_id: bookingData.id,
          target_type: 'booking',
          analysis_data: mockAnalysis,
          confidence_score: mockAnalysis.confidence
        }])

      if (error) throw error

      return mockAnalysis

    } catch (error) {
      console.error('Booking analysis error:', error)
      return null
    }
  }

  // Analyze message sentiment
  static async analyzeMessageSentiment(message) {
    const prompt = `
      Analyze the sentiment of this message: "${message}"
      Return JSON with: sentiment (positive/negative/neutral), confidence (0-1), key_phrases[]
    `

    // Mock sentiment analysis
    const positiveWords = ['great', 'excellent', 'amazing', 'love', 'perfect', 'thanks', 'happy']
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disappointed', 'angry', 'frustrated']
    
    const words = message.toLowerCase().split(' ')
    const positiveCount = words.filter(word => positiveWords.includes(word)).length
    const negativeCount = words.filter(word => negativeWords.includes(word)).length
    
    let sentiment = 'neutral'
    let confidence = 0.5
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive'
      confidence = 0.7 + (positiveCount * 0.1)
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative'
      confidence = 0.7 + (negativeCount * 0.1)
    }

    const analysis = {
      sentiment,
      confidence: Math.min(confidence, 0.95),
      key_phrases: this.extractKeyPhrases(message)
    }

    return analysis
  }

  // Generate business insights from metrics
  static async generateBusinessInsights(metrics) {
    const prompt = `
      Based on these business metrics: ${JSON.stringify(metrics)}
      Generate actionable insights including:
      - Growth opportunities
      - Efficiency improvements
      - Risk alerts
      - Strategic recommendations
    `

    // Mock insights generation
    const insights = []
    
    if (metrics.revenue_growth < 0.1) {
      insights.push({
        type: 'growth',
        title: 'Revenue Growth Optimization',
        description: 'Revenue growth below target. Consider expanding service offerings.',
        confidence: 0.82,
        impact: 'high'
      })
    }
    
    if (metrics.customer_acquisition_cost > 100) {
      insights.push({
        type: 'efficiency',
        title: 'Customer Acquisition Cost High',
        description: 'CAC exceeding industry average. Optimize marketing channels.',
        confidence: 0.88,
        impact: 'medium'
      })
    }

    return insights
  }

  // Predict project success probability
  static async predictProjectSuccess(projectData) {
    const factors = {
      budget_adequacy: projectData.budget > 1000 ? 0.8 : 0.4,
      timeline_realism: projectData.timeline === '2-4 weeks' ? 0.9 : 0.6,
      scope_clarity: projectData.project_description.length > 50 ? 0.7 : 0.4,
      client_experience: projectData.customer_experience || 0.5
    }

    const successProbability = Object.values(factors).reduce((a, b) => a + b, 0) / Object.values(factors).length
    
    return {
      success_probability: successProbability,
      key_factors: factors,
      recommendations: this.generateSuccessRecommendations(factors)
    }
  }

  // Helper methods for mock analysis
  static analyzeSentiment(text) {
    const positiveWords = ['great', 'excellent', 'amazing', 'love', 'perfect', 'thanks', 'happy', 'excited']
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disappointed', 'angry', 'frustrated', 'issue']
    
    const words = text.toLowerCase().split(' ')
    const positiveCount = words.filter(word => positiveWords.includes(word)).length
    const negativeCount = words.filter(word => negativeWords.includes(word)).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  static generateBookingRecommendations(booking) {
    const recommendations = []
    
    if (booking.budget > 2000) {
      recommendations.push('Assign senior team member for premium service delivery')
    }
    
    if (booking.timeline === '1-2 weeks') {
      recommendations.push('Consider expedited service option with additional fee')
    }
    
    if (booking.project_description.includes('urgent') || booking.project_description.includes('asap')) {
      recommendations.push('Prioritize this project in the queue')
    }
    
    return recommendations.length > 0 ? recommendations : ['Proceed with standard service delivery process']
  }

  static identifyUpsellOpportunities(booking) {
    const opportunities = []
    
    if (booking.service_providers?.name.includes('Design')) {
      opportunities.push('Offer branding package extension')
      opportunities.push('Suggest ongoing design maintenance')
    }
    
    if (booking.service_providers?.name.includes('Development')) {
      opportunities.push('Propose hosting and maintenance package')
      opportunities.push('Suggest mobile app development')
    }
    
    return opportunities
  }

  static assessBookingRisks(booking) {
    const risks = []
    
    if (!booking.timeline) {
      risks.push('Unclear timeline may lead to delivery delays')
    }
    
    if (booking.budget < 500) {
      risks.push('Low budget may impact service quality')
    }
    
    if (booking.project_description.length < 20) {
      risks.push('Vague project description may require additional clarification')
    }
    
    return risks.length > 0 ? risks : ['Standard project risks apply']
  }

  static extractKeyPhrases(text) {
    // Simple key phrase extraction
    const words = text.toLowerCase().split(' ')
    const importantWords = words.filter(word => word.length > 5)
    return importantWords.slice(0, 3)
  }

  static generateSuccessRecommendations(factors) {
    const recommendations = []
    
    if (factors.budget_adequacy < 0.6) {
      recommendations.push('Consider budget adjustment for better outcomes')
    }
    
    if (factors.timeline_realism < 0.7) {
      recommendations.push('Review and adjust project timeline')
    }
    
    if (factors.scope_clarity < 0.6) {
      recommendations.push('Clarify project scope and requirements')
    }
    
    return recommendations.length > 0 ? recommendations : ['Project setup looks good for success']
  }
}

export default AIAnalysisService
