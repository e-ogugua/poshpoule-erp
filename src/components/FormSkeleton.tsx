'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'rounded' | 'circular';
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        {
          'rounded': variant === 'default',
          'rounded-md': variant === 'rounded',
          'rounded-full': variant === 'circular',
        },
        className
      )}
    />
  );
}

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn('flex items-center justify-between p-4 border rounded-lg', className)}>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
}

interface OrderFormSkeletonProps {
  className?: string;
}

export function OrderFormSkeleton({ className }: OrderFormSkeletonProps) {
  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Information Skeleton */}
        <div className="card p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        {/* Order Details Skeleton */}
        <div className="card p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex space-x-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Selection Skeleton */}
      <div className="card p-6 mt-8 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>

      {/* Submit Button Skeleton */}
      <div className="text-center mt-8">
        <Skeleton className="h-12 w-full max-w-sm mx-auto" />
      </div>
    </div>
  );
}
