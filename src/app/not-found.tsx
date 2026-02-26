import Link from 'next/link'
import { Search } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-section">
      <div className="max-w-md text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mx-auto">
          <Search size={24} strokeWidth={1.5} className="text-text-tertiary" />
        </div>
        <h1 className="text-title text-text-primary">Page not found</h1>
        <p className="text-body text-text-secondary">
          Looks like this page doesn&apos;t have any subtext — because it doesn&apos;t exist.
        </p>
        <Link
          href="/app"
          className="inline-flex items-center justify-center h-12 px-6 bg-accent text-white text-subtitle rounded-button hover:bg-accent-hover transition-all duration-200"
        >
          Go decode some messages
        </Link>
      </div>
    </main>
  )
}
