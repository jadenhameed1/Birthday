import { createClient } from '@supabase/supabase-js'
import { config, validateConfig } from './config'

// Validate configuration
validateConfig()

const supabaseUrl = config.supabase.url || 'https://placeholder.supabase.co'
const supabaseKey = config.supabase.anonKey || 'placeholder-key'

// Log configuration status (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Supabase Config:', {
    url: supabaseUrl ? '✅ Loaded' : '❌ Missing',
    key: supabaseKey ? '✅ Loaded' : '❌ Missing'
  })
}

export const supabase = createClient(supabaseUrl, supabaseKey)
