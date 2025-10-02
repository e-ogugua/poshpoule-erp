export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb skeleton */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-12"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-16"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
          </div>
        </div>
      </div>

      {/* Product details skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image skeleton */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full bg-gray-200 animate-pulse rounded-lg"></div>
          </div>

          {/* Right Column - Details skeleton */}
          <div className="space-y-6">
            <div>
              <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4 mb-4"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-20"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded w-16"></div>
              </div>
              <div className="flex gap-2 mb-6">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-20"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded w-16"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
            </div>

            <div className="space-y-3">
              <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
            </div>

            <div className="border-t pt-6">
              <div className="h-5 bg-gray-200 animate-pulse rounded w-32 mb-3"></div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-16"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-16"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-10"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
