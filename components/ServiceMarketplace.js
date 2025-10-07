'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ServiceMarketplace() {
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMarketplaceData()
  }, [])

  const loadMarketplaceData = async () => {
    try {
      const [categoriesRes, servicesRes] = await Promise.all([
        supabase.from('service_categories').select('*').order('name'),
        supabase.from('service_providers').select('*, service_categories(name)').order('rating', { ascending: false })
      ])

      setCategories(categoriesRes.data || [])
      setServices(servicesRes.data || [])
    } catch (error) {
      console.error('Error loading marketplace:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category_id === selectedCategory
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
  }

  if (loading) {
    return <div className="p-8 text-center">Loading marketplace...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">🛍️ Service Marketplace</h1>
        <p className="text-gray-600 mt-2">Discover trusted service providers for your business needs</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Featured Services */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">⭐ Featured Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.filter(s => s.is_featured).map(service => (
            <ServiceCard key={service.id} service={service} getStars={getStars} />
          ))}
        </div>
      </div>

      {/* All Services */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} getStars={getStars} />
          ))}
        </div>
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

function ServiceCard({ service, getStars }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md border hover:shadow-lg transition cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
            {service.is_featured && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Featured</span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500 text-sm">{getStars(service.rating)}</span>
              <span className="text-gray-500 text-sm">({service.rating})</span>
            </div>
            <span className="text-gray-500 text-sm">{service.service_categories?.name}</span>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{service.price_range}</span>
            <span>{service.delivery_time}</span>
          </div>

          <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            View Details
          </button>
        </div>
      </div>

      {/* Service Detail Modal */}
      {showModal && (
        <ServiceModal service={service} onClose={() => setShowModal(false)} getStars={getStars} />
      )}
    </>
  )
}

function ServiceModal({ service, onClose, getStars }) {
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(true)

  useEffect(() => {
    loadReviews()
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

  return (
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
              <button className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
                Contact Provider
              </button>
              <button className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition">
                Start Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
