import { Inter } from 'next/font/google'
import './globals.css'
import EnhancedLiveChat from '@/components/EnhancedLiveChat'
import PerformanceOptimizer from '@/components/PerformanceOptimizer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tech Ecosystem - Business Platform',
  description: 'AI-powered business management platform with marketplace, analytics, and team collaboration',
  keywords: 'business, AI, marketplace, analytics, SaaS',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PerformanceOptimizer />
        {children}
        <EnhancedLiveChat />
      </body>
    </html>
  )
}
