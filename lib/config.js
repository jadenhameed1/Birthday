// Secure configuration - actual values come from environment variables
export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  app: {
    name: 'Tech Ecosystem',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  }
}

// Validation function
export function validateConfig() {
  const missing = []
  
  if (!config.supabase.url) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!config.supabase.anonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  
  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables:', missing.join(', '))
    return false
  }
  
  return true
}
