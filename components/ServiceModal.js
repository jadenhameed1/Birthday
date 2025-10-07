'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import BookingModal from './BookingModal'

export default function ServiceModal({ service, onClose, getStars }) {
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [packages, setPackages] = useState([])

  useEffect(() => {
    loadReviews()
    loadPackages()
  }, [service.id])

  const loadReviews = async () => {
    const { data } = await supabase
      .from('service_reviews')
      .select('*')
      .eq('service_id', service.id)
      .order('created_at', { ascending: false })
    
    setReviews(data || [])
    setLoadingReviews(false)
  }

  const loadPackages = async () => {
    const { data } = await supabase
      .from('service_packages')
      .select('*')
      .eq('service_id', service.id)
    
    setPackages(data || [])
  }

  const handleBookingComplete = (booking) => {
    alert(`Booking created successfully! We'll contact you at ${booking.customer_email}`)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{service.name}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">{service.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Price Range:</span>
                  <p className="text-gray-600">{service.price_range}</p>
                </div>
                <div>
                  <span className="font-semibold">Delivery Time:</span>
                  <p className="text-gray-600">{service.delivery_time}</p>
                </div>
                <div>
                  <span className="font-semibold">Rating:</span>
                  <p className="text-gray-600">{getStars(service.rating)} ({service.rating}/5)</p>
                </div>
                <div>
                  <span className="font-semibold">Category:</span>
                  <p className="text-gray-600">{service.service_categories?.name}</p>
                </div>
              </div>

              {/* Packages Section */}
              {packages.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Available Packages</h3>
                  <div className="space-y-3">
                    {packages.map(pkg => (
                      <div key={pkg.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{pkg.name}</h4>
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
                </div>
              )}

              {/* Reviews Section */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Customer Reviews</h3>
                {loadingReviews ? (
                  <p className="text-gray-500">Loading reviews...</p>
                ) : reviews.length > 0 ? (
                  <div className="space-y-3">
                    {reviews.map(review => (
                      <div key={review.id} className="border-b pb-3">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold">{review.user_name}</span>
                          <span className="text-yellow-500">{getStars(review.rating)}</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                >
                  Book This Service
                </button>
                <button className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition">
                  Contact Provider
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          service={service}
          onClose={() => setShowBookingModal(false)}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </>
  )
}
