import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black mb-4">404</h1>
        <h2 className="text-xl text-gray-600 mb-6">Agent Not Found</h2>
        <p className="text-gray-500 mb-8">
          The agent you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}