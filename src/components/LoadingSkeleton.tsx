export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-16"></div>
            </div>
            <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 animate-pulse rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3 mb-4"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 animate-pulse rounded w-20"></div>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded"></div>
              <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
