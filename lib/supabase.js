import { createClient } from '@supabase/supabase-js'

// Safe Supabase client that won't crash if env vars are missing
let supabaseClient = null

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    console.log('Supabase client initialized successfully')
  } else {
    console.log('Supabase environment variables not set - using demo mode')
  }
} catch (error) {
  console.log('Supabase initialization failed - using demo mode:', error.message)
}

export const supabase = supabaseClient

// Demo methods for when Supabase isn't available
export const demoStorage = {
  organizations: [],
  users: []
}
