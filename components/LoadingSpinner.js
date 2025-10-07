'use client'
export default function LoadingSpinner({ size = 'medium', text = 'Loading...' }) {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  )
}
