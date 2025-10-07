// Push notification service for browser notifications
class PushService {
  constructor() {
    this.permission = null
    // REMOVED: this.checkPermission() - causes SSR window error
  }

  async initialize() {
    await this.checkPermission()
  }

  async checkPermission() {
    if (typeof window === 'undefined') return // SSR safety check
    
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return
    }

    this.permission = Notification.permission
    
    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission()
    }
  }

  async showNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      await this.checkPermission()
    }

    if (this.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icon.png',
        badge: '/badge.png',
        ...options
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
        
        if (options.url) {
          window.location.href = options.url
        }
      }

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    }
  }

  // Show notification for new booking
  async notifyNewBooking(booking) {
    return this.showNotification('🎉 New Booking Received!', {
      body: `${booking.customer_name} booked your services for $${booking.budget}`,
      url: '/bookings',
      tag: 'booking'
    })
  }

  // Show notification for new message
  async notifyNewMessage(message) {
    return this.showNotification('💬 New Message', {
      body: `${message.user_name}: ${message.message}`,
      url: '/chat',
      tag: 'message'
    })
  }

  // Show notification for payment
  async notifyPayment(amount) {
    return this.showNotification('💰 Payment Received', {
      body: `Payment of $${amount} has been processed successfully`,
      url: '/bookings',
      tag: 'payment'
    })
  }

  // Show general notification
  async notifyInfo(title, message, url = '/') {
    return this.showNotification(title, {
      body: message,
      url: url
    })
  }
}

export const pushService = new PushService()
