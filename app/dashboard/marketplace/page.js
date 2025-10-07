"use client";
// Simple marketplace page for launch
export default function Marketplace() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Service Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sample services for launch */}
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold">Web Development</h3>
          <p className="text-gray-600 mt-2">Custom web applications</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Hire Now</button>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold">AI Integration</h3>
          <p className="text-gray-600 mt-2">Add AI to your business</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Hire Now</button>
        </div>
      </div>
    </div>
  )
}
