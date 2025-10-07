'use client'
import { supabase } from '@/lib/supabase'

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
      Sign Out
    </button>
  )
}
