import { Link } from '@/i18n/navigation'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-white">404</h1>
        <p className="mt-4 text-xl text-gray-300">Page not found</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-white px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
