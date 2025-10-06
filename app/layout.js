import './globals.css'
import { SessionProvider } from './SessionProvider'

export const metadata = {
  title: 'Tech Ecosystem - Building the Future',
  description: 'A scalable, AI-driven business ecosystem platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}