'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Check, Star } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    description: 'Perfect for small businesses starting their ecosystem',
    price: '$29',
    interval: 'month',
    features: [
      'Up to 5 team members',
      'Basic AI assistant',
      '10GB storage',
      'Standard support',
      'Basic analytics'
    ],
    stripePriceId: 'price_basic_monthly'
  },
  {
    name: 'Professional',
    description: 'For growing businesses scaling their operations',
    price: '$99',
    interval: 'month',
    featured: true,
    features: [
      'Up to 20 team members',
      'Advanced AI assistant',
      '100GB storage',
      'Priority support',
      'Advanced analytics',
      'API access',
      'Custom integrations'
    ],
    stripePriceId: 'price_professional_monthly'
  },
  {
    name: 'Enterprise',
    description: 'For large organizations building complex ecosystems',
    price: '$299',
    interval: 'month',
    features: [
      'Unlimited team members',
      'Premium AI assistant',
      '1TB storage',
      '24/7 dedicated support',
      'Custom analytics',
      'Full API access',
      'White-label options',
      'SLA guarantee'
    ],
    stripePriceId: 'price_enterprise_monthly'
  }
]

export default function Billing() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(null)

  const handleSubscribe = async (priceId) => {
    setIsLoading(priceId)
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId: session.user.stripe_customer_id
        }),
      })

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      await stripe.redirectToCheckout({ sessionId })
      
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="mt-4 text-lg text-gray-600">
          Scale your business ecosystem with our flexible pricing plans
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-2xl shadow-sm border ${
              plan.featured 
                ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' 
                : 'border-gray-200'
            }`}
          >
            {plan.featured && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  Most Popular
                </div>
              </div>
            )}

            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-4 text-gray-600">{plan.description}</p>
              
              <div className="mt-8">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">/{plan.interval}</span>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.stripePriceId)}
                disabled={isLoading === plan.stripePriceId}
                className={`mt-8 w-full py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  plan.featured
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-800 hover:bg-gray-900'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading === plan.stripePriceId ? 'Processing...' : 'Get Started'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Load Stripe.js dynamically
const loadStripe = async (publishableKey) => {
  const { loadStripe } = await import('@stripe/stripe-js')
  return loadStripe(publishableKey)
}