export default function Loading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header skeleton */}
      <header className="relative z-10 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-5 w-5 bg-gray-800 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-800 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-7 w-7 bg-gray-800 rounded animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-800 rounded animate-pulse"></div>
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero section skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Poster skeleton */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 rounded-2xl animate-pulse"></div>
            </div>

            {/* Info skeleton */}
            <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
              <div className="h-12 w-3/4 bg-gray-800 rounded animate-pulse"></div>
              <div className="flex gap-4">
                <div className="h-6 w-20 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-800 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 w-4/6 bg-gray-800 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-48 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 w-40 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Video player skeleton */}
          <div className="mb-8">
            <div className="h-6 w-32 bg-gray-800 rounded mb-4 animate-pulse"></div>
            <div className="aspect-video bg-gray-800 rounded-lg animate-pulse"></div>
          </div>

          {/* Additional info skeleton */}
          <div className="bg-gray-900 rounded-2xl p-8">
            <div className="h-6 w-48 bg-gray-800 rounded mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="h-5 w-32 bg-gray-800 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-4 w-36 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-4 w-28 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-4 w-44 bg-gray-800 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-5 w-28 bg-gray-800 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-4 w-48 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-4 w-36 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-4 w-40 bg-gray-800 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
