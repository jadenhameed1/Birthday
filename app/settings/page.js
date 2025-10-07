// Add this at the top of your settings page
'use client'
import { useEffect } from 'react'
import { pushService } from '../../utils/pushService'

export default function Settings() {
  useEffect(() => {
    // Initialize push service only on client side
    pushService.initialize()
  }, [])

  // Your existing settings page code here...
  const handlePermissionCheck = async () => {
    const permission = await pushService.checkPermission()
    // Your existing logic...
  }
}
