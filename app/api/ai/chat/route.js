export async function POST(request) {
  const { messages } = await request.json();
  
  // Get the last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  const userQuestion = lastUserMessage?.content.toLowerCase() || '';
  
  // Smart mock responses based on question
  let response = "I'd recommend focusing on customer acquisition through content marketing and partnerships.";
  
  if (userQuestion.includes('pricing') || userQuestion.includes('price')) {
    response = "For your marketplace, consider a tiered pricing model: Basic (free), Pro ($49/month), and Enterprise (custom). Add 2-5% transaction fees for marketplace transactions.";
  } else if (userQuestion.includes('growth') || userQuestion.includes('acquire')) {
    response = "Focus on content marketing, SEO, and partnerships with industry influencers. Offer referral bonuses to existing customers to drive word-of-mouth growth.";
  } else if (userQuestion.includes('competition') || userQuestion.includes('competitive')) {
    response = "Differentiate through superior customer service and niche specialization. Focus on a specific industry vertical before expanding to broader markets.";
  } else if (userQuestion.includes('revenue') || userQuestion.includes('money')) {
    response = "Diversify revenue streams: subscription fees, transaction commissions, premium features, and enterprise consulting services.";
  } else if (userQuestion.includes('customer') || userQuestion.includes('user')) {
    response = "Improve user onboarding with interactive tutorials. Implement a customer feedback loop to continuously improve your platform based on user needs.";
  } else if (userQuestion.includes('marketing') || userQuestion.includes('advert')) {
    response = "Use content marketing, social media engagement, and SEO. Consider partnerships with complementary businesses for cross-promotion.";
  } else if (userQuestion.includes('technology') || userQuestion.includes('tech')) {
    response = "Focus on mobile-first design, fast loading times, and intuitive UX. Consider AI-powered recommendations to enhance user engagement.";
  }
  
  // Simulate AI thinking delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return Response.json({ response });
}
