'use client';

interface BlogPostSkeletonProps {
  className?: string;
}

export function BlogPostSkeleton({ className = '' }: BlogPostSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="w-full h-8 bg-gray-200 rounded mb-4"></div>
      <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
      <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
      <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
    </div>
  );
}
