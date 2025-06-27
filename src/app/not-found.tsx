export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-white">404</h1>
        <p className="mt-4 text-xl text-gray-300">Page not found</p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-3 text-sm font-medium text-gray-900 bg-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
