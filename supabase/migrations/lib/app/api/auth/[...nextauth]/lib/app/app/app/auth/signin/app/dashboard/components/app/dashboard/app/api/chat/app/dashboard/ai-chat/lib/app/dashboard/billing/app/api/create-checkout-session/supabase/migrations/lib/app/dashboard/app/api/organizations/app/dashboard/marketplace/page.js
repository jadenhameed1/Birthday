'use client'

import { useState, useEffect } from 'react'
import { useTenant } from '@/lib/tenant-context'
import { Search, Filter, Star, Users, Clock, DollarSign } from 'lucide-react'

export default function Marketplace() {
  const { currentOrganization } = useTenant()
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMarketplaceData()
  }, [])

  const fetchMarketplaceData = async () => {
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        fetch('/api/marketplace/services'),
        fetch('/api/marketplace/categories')
      ])
      
      const servicesData = await servicesRes.json()
      const categoriesData = await categoriesRes.json()
      
      setServices(servicesData.services)
      setCategories(categoriesData.categories)
    } catch (error) {
      console.error('Error fetching marketplace data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category_id === selectedCategory
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleOrderService = async (serviceId) => {
    if (!currentOrganization) {
      alert('Please select an organization first')
      return
    }

    try {
      const response = await fetch('/api/marketplace/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          customerOrganizationId: currentOrganization.id
        })
      })

      if (response.ok) {
        alert('Service ordered successfully!')
      } else {
        throw new Error('Failed to order service')
      }
    } catch (error) {
      console.error('Error ordering service:', error)
      alert('Failed to order service')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Service Marketplace</h1>
        <p className="mt-2 text-sm text-gray-600">
          Discover and connect with service providers in our ecosystem
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                <div className="flex items-center text-sm text-yellow-600">
                  <Star className="h-4 w-4 fill-current mr-1" />
                  {service.rating}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {service.review_count} reviews
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {service.price_type}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">
                  {service.price_amount ? `$${service.price_amount}` : 'Custom Pricing'}
                </div>
                <button
                  onClick={() => handleOrderService(service.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}