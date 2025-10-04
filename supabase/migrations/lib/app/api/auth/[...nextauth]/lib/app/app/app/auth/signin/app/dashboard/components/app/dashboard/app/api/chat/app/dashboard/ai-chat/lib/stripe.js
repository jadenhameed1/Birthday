import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

// Price IDs from your Stripe dashboard
export const PRICE_IDS = {
  basic: 'price_basic_monthly',
  professional: 'price_professional_monthly',
  enterprise: 'price_enterprise_monthly'
}