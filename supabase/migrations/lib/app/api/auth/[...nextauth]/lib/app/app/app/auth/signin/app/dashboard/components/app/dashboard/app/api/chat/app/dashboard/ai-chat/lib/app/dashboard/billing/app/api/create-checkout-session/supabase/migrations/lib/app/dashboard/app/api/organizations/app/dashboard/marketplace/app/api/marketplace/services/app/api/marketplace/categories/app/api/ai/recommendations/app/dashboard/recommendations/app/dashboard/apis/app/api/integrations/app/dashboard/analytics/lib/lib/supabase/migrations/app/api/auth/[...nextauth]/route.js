import NextAuth from 'next-auth'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }