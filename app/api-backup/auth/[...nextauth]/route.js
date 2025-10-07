import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async session({ session, user, token }) {
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}

export { authOptions }

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
