'use client'
import { useState, useEffect } from 'react'
import DashboardNav from '@/components/DashboardNav'
import { pushService } from '@/utils/pushService'

export default function SettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: false,
    emailNotifications: true,
    bookingAlerts: true,
    messageAlerts: true,
    paymentAlerts: true
  })

  useEffect(() => {
    // Check current notification permission
    setNotificationSettings(prev => ({
      ...prev,
      pushEnabled: Notification.permission === 'granted'
    }))
  }, [])

  const handlePushToggle = async () => {
    if (!notificationSettings.pushEnabled) {
      const permission = await pushService.checkPermission()
      setNotificationSettings(prev => ({
        ...prev,
        pushEnabled: permission === 'granted'
      }))
      
      if (permission === 'granted') {
        pushService.notifyInfo(
          'Notifications Enabled!',
          'You will now receive push notifications from Tech Ecosystem.',
          '/settings'
        )
      }
    } else {
      setNotificationSettings(prev => ({
        ...prev,
        pushEnabled: false
      }))
    }
  }

  const handleTestNotification = () => {
    pushService.notifyInfo(
      'Test Notification',
      'This is a test notification from Tech Ecosystem!',
      '/dashboard'
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
            
            <div className="space-y-6">
              {/* Notification Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">🔔 Notification Settings</h2>
                
                <div className="space-y-4">
                  {/* Push Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-500">Receive browser notifications</p>
                    </div>
                    <button
                      onClick={handlePushToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        notificationSettings.pushEnabled ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          notificationSettings.pushEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive email updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        emailNotifications: e.target.checked
                      }))}
                      className="h-5 w-5 text-blue-500 rounded"
                    />
                  </div>

                  {/* Booking Alerts */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Booking Alerts</h3>
                      <p className="text-sm text-gray-500">New booking notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.bookingAlerts}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        bookingAlerts: e.target.checked
                      }))}
                      className="h-5 w-5 text-blue-500 rounded"
                    />
                  </div>

                  {/* Message Alerts */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Message Alerts</h3>
                      <p className="text-sm text-gray-500">New message notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.messageAlerts}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        messageAlerts: e.target.checked
                      }))}
                      className="h-5 w-5 text-blue-500 rounded"
                    />
                  </div>

                  {/* Payment Alerts */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Payment Alerts</h3>
                      <p className="text-sm text-gray-500">Payment confirmation notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.paymentAlerts}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        paymentAlerts: e.target.checked
                      }))}
                      className="h-5 w-5 text-blue-500 rounded"
                    />
                  </div>
                </div>

                {/* Test Notification Button */}
                <div className="mt-6 pt-4 border-t">
                  <button
                    onClick={handleTestNotification}
                    disabled={!notificationSettings.pushEnabled}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    Test Notification
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Send a test notification to verify your settings
                  </p>
                </div>
              </div>

              {/* File Upload Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">📁 File Upload Settings</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">Maximum file size: 10MB</p>
                  <p className="text-gray-600">Allowed file types: Images, PDFs, Documents, ZIP files</p>
                  <p className="text-gray-600">Files are stored securely and can be downloaded by chat participants</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
