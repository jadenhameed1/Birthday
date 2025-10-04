import NextAuth from 'next-auth'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Custom credential authentication logic
        const user = { id: '1', email: credentials.email }
        if (user) {
          return user
        }
        return null
      }
    })
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, user }) {
      // Get user data from Supabase
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single()

      if (userData) {
        session.user.id = userData.id
        session.user.subscription_tier = userData.subscription_tier
        session.user.stripe_customer_id = userData.stripe_customer_id
      }

      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }