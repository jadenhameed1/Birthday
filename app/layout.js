import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tech Ecosystem Platform',
  description: 'All-in-one business platform with AI, marketplace, and analytics',
  keywords: 'business, AI, marketplace, analytics, SaaS',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
import LogoutButton from '@/components/LogoutButton'

// Add this inside your layout where you want the logout button
<LogoutButton />
