const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendBookingConfirmation(booking, service) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: booking.customer_email,
    subject: `Booking Confirmation - ${service.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Booking Confirmed! 🎉</h2>
        <p>Dear ${booking.customer_name},</p>
        <p>Your booking for <strong>${service.name}</strong> has been confirmed.</p>
        
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0;">Booking Details:</h3>
          <p><strong>Service:</strong> ${service.name}</p>
          <p><strong>Description:</strong> ${booking.project_description}</p>
          <p><strong>Budget:</strong> $${booking.budget}</p>
          <p><strong>Timeline:</strong> ${booking.timeline || 'To be determined'}</p>
        </div>

        <p>We'll contact you within 24 hours to discuss next steps.</p>
        
        <p>Best regards,<br>Tech Ecosystem Team</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Booking confirmation email sent to:', booking.customer_email)
  } catch (error) {
    console.error('Email error:', error)
  }
}

export async function sendPaymentConfirmation(booking, service, paymentIntent) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: booking.customer_email,
    subject: `Payment Received - ${service.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Payment Confirmed! 💳</h2>
        <p>Dear ${booking.customer_name},</p>
        <p>Your payment for <strong>${service.name}</strong> has been successfully processed.</p>
        
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0;">Payment Details:</h3>
          <p><strong>Amount:</strong> $${(paymentIntent.amount / 100).toFixed(2)}</p>
          <p><strong>Transaction ID:</strong> ${paymentIntent.id}</p>
          <p><strong>Service:</strong> ${service.name}</p>
        </div>

        <p>Your project will now move into the production phase.</p>
        
        <p>Thank you for your business!<br>Tech Ecosystem Team</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Payment confirmation email sent to:', booking.customer_email)
  } catch (error) {
    console.error('Email error:', error)
  }
}
