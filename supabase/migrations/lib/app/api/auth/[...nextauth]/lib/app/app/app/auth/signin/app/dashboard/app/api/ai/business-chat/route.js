import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    console.log('=== BUSINESS CHAT API CALLED ===');
    
    const businessPrompt = `CRITICAL: You are a business strategy expert for TECH MARKETPLACES. 
    You specifically advise marketplace platforms connecting businesses with service providers.
    
    KEY BUSINESS CONTEXT:
    - Platform: Tech Ecosystem Marketplace
    - Model: Subscription + transaction fees
    - Users: Small businesses and freelancers
    
    RESPONSE RULES:
    1. NEVER start with "That's an interesting question"
    2. NEVER give generic advice
    3. ALWAYS provide specific, actionable strategies
    4. Focus on marketplace dynamics, pricing, growth
    
    Example good response: "For your marketplace, consider a 15% transaction fee plus tiered subscriptions: Starter ($49/mo), Pro ($99/mo), Enterprise ($199/mo). This balances accessibility with premium features."`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: businessPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;
    console.log('AI Response:', response);
    
    return Response.json({ response });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return Response.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}