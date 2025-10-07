'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import StripePayment from './StripePayment'
import { sendBookingConfirmation, sendPaymentConfirmation } from '@/utils/emailService'

export default function BookingModal({ service, onClose, onBookingComplete }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectDescription: '',
    budget: '',
    timeline: '',
    selectedPackage: null
  })
  const [loading, setLoading] = useState(false)
  const [packages, setPackages] = useState([])
  const [currentBooking, setCurrentBooking] = useState(null)

  useState(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    const { data } = await supabase
      .from('service_packages')
      .select('*')
      .eq('service_id', service.id)
    
    setPackages(data || [])
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmitDetails = () => {
    if (!formData.name || !formData.email || !formData.projectDescription) {
      alert('Please fill in all required fields')
      return
    }
    setStep(2)
  }

  const handleSelectPackage = (pkg) => {
    setFormData(prev => ({ ...prev, selectedPackage: pkg }))
    setStep(3)
  }

  const handleBooking = async () => {
    setLoading(true)
    try {
      const bookingData = {
        service_id: service.id,
        customer_name: formData.name,
        customer_email: formData.email,
        project_description: formData.projectDescription,
        budget: formData.selectedPackage ? formData.selectedPackage.price : formData.budget,
        timeline: formData.timeline,
        status: 'pending'
      }

      const { data: booking, error } = await supabase
        .from('service_bookings')
        .insert([bookingData])
        .select()
        .single()

      if (error) throw error

      setCurrentBooking(booking)

      // Send booking confirmation email
      await sendBookingConfirmation(booking, service)

      if (formData.selectedPackage) {
        await supabase
          .from('payment_transactions')
          .insert([{
            booking_id: booking.id,
            amount: formData.selectedPackage.price,
            status: 'pending'
          }])
        
        setStep(4) // Move to payment step
      } else {
        onBookingComplete(booking)
        onClose()
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Update payment transaction
      await supabase
        .from('payment_transactions')
        .update({ 
          status: 'completed',
          stripe_payment_intent_id: paymentIntent.id 
        })
        .eq('booking_id', currentBooking.id)

      // Update booking status
      await supabase
        .from('service_bookings')
        .update({ status: 'confirmed' })
        .eq('id', currentBooking.id)

      // Send payment confirmation email
      await sendPaymentConfirmation(currentBooking, service, paymentIntent)

      onBookingComplete({ ...currentBooking, status: 'confirmed' })
      onClose()
    } catch (error) {
      console.error('Payment update error:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {step === 1 && 'Project Details'}
              {step === 2 && 'Select Package'}
              {step === 3 && 'Complete Booking'}
              {step === 4 && 'Payment'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-6">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step >= stepNum ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-8 h-1 ${step > stepNum ? 'bg-blue-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Project Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Description *</label>
                <textarea
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your project requirements..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select timeline</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2-4 weeks">2-4 weeks</option>
                    <option value="1-2 months">1-2 months</option>
                    <option value="2+ months">2+ months</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSubmitDetails}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
              >
                Continue to Packages
              </button>
            </div>
          )}

          {/* Step 2: Package Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-gray-600">Choose a package or continue with custom requirements:</p>
              
              {packages.length > 0 ? (
                <div className="space-y-3">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => handleSelectPackage(pkg)}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{pkg.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{pkg.description}</p>
                          <ul className="text-sm text-gray-500 mt-2 space-y-1">
                            {pkg.features?.map((feature, index) => (
                              <li key={index}>✓ {feature}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">${pkg.price}</div>
                          <div className="text-sm text-gray-500">{pkg.delivery_days} days</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No packages available for this service.</p>
              )}

              <button
                onClick={() => setStep(3)}
                className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition"
              >
                Continue with Custom Requirements
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Back to Details
              </button>
            </div>
          )}

          {/* Step 3: Booking Summary */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{service.name}</span>
                  </div>
                  {formData.selectedPackage && (
                    <>
                      <div className="flex justify-between">
                        <span>Package:</span>
                        <span>{formData.selectedPackage.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-semibold">${formData.selectedPackage.price}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span>Timeline:</span>
                    <span>{formData.timeline || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={loading}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 transition"
              >
                {loading ? 'Creating Booking...' : 'Confirm Booking'}
              </button>

              <button
                onClick={() => setStep(2)}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Back to Packages
              </button>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && formData.selectedPackage && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Payment Details</h3>
                <p className="text-sm">Service: {service.name}</p>
                <p className="text-sm">Package: {formData.selectedPackage.name}</p>
                <p className="text-lg font-bold">Amount: ${formData.selectedPackage.price}</p>
              </div>

              <StripePayment
                amount={formData.selectedPackage.price}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setStep(3)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
