import './globals.css'

export const metadata = {
  title: 'Tech Ecosystem',
  description: 'Business ecosystem platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
i