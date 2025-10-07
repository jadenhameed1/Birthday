'use client'
import { useEffect } from 'react'

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadLinks = [
      { href: '/api/ai/chat', as: 'fetch' },
      { href: '/_next/static/css/', as: 'style' }
    ]

    preloadLinks.forEach(({ href, as }) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.as = as
      document.head.appendChild(link)
    })

    // Initialize performance monitoring
    if ('connection' in navigator) {
      console.log('📊 Connection type:', navigator.connection.effectiveType)
      console.log('📊 Data saving mode:', navigator.connection.saveData)
    }

    // Cleanup
    return () => {
      document.querySelectorAll('link[rel="preload"]').forEach(link => link.remove())
    }
  }, [])

  return null
}
