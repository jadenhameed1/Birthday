import { supabase } from '@/lib/supabase'
import DashboardNav from '@/components/DashboardNav'
import { useSession } from 'next-auth/react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  // ... rest of your code
}