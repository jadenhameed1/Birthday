import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { priceId, customerId } = await request.json()

    let customer = customerId

    // Create customer if doesn't exist
    if (!customer) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: {
          userId: session.user.id
        }
      })

      customer = stripeCustomer.id

      // Update user with Stripe customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customer })
        .eq('id', session.user.id)
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing`,
      metadata: {
        userId: session.user.id
      }
    })

    return new Response(
      JSON.stringify({ sessionId: checkoutSession.id }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}