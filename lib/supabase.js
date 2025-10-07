// Mock for build - replace with real supabase config
export const supabase = {
  from: () => ({
    select: () => ({
      order: () => ({
        limit: () => Promise.resolve({ data: [], error: null })
      }),
      eq: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null })
    })
  })
}
