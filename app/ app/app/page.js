import Link from 'next/link'
import { Rocket, Zap, Users, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TechEcosystem</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Build the Future of
          <span className="text-blue-600 block">Business Ecosystems</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A scalable, AI-driven platform that becomes the operating system for your industry. 
          Join the ecosystem that makes competition obsolete.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/signup" 
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            Start Building
          </Link>
          <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Leverage cutting-edge AI for automation, predictions, and intelligent workflows.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-Tenant</h3>
            <p className="text-gray-600">
              Scalable architecture supporting multiple businesses on one platform.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Enterprise Ready</h3>
            <p className="text-gray-600">
              Secure, scalable infrastructure built for million-to-billion dollar growth.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap Preview */}
      <section className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Development Roadmap</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4">
                Phase 1
              </div>
              <h3 className="text-xl font-semibold mb-3">Foundation</h3>
              <ul className="text-gray-600 space-y-2">
                <li>✓ Next.js Application</li>
                <li>✓ Vercel Deployment</li>
                <li>✓ Basic Landing Page</li>
                <li>✓ CI/CD Pipeline</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4">
                Phase 2
              </div>
              <h3 className="text-xl font-semibold mb-3">Core Features</h3>
              <ul className="text-gray-600 space-y-2">
                <li>Authentication System</li>
                <li>User Dashboard</li>
                <li>Payment Integration</li>
                <li>AI Chat Assistant</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4">
                Phase 3
              </div>
              <h3 className="text-xl font-semibold mb-3">Ecosystem</h3>
              <ul className="text-gray-600 space-y-2">
                <li>Multi-tenant Architecture</li>
                <li>Marketplace Platform</li>
                <li>API Ecosystem</li>
                <li>AI Recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}