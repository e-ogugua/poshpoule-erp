'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  priceNaira: number;
  image: string;
  slug: string;
  category: string;
  stock: number;
  featured?: boolean;
  originalPrice?: number;
  discountPercentage?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="w-full aspect-[4/3] bg-gray-200 animate-pulse"></div>
        <div className="p-3 sm:p-4">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 animate-pulse rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-20"></div>
            <div className="h-8 bg-gray-200 animate-pulse rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        {product.featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
        {product.discountPercentage && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            -{product.discountPercentage}%
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {product.category}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            product.stock > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        <h3 className="font-heading text-base sm:text-lg font-heading-semibold mb-2 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="font-bold text-primary text-lg">₦{product.priceNaira.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              ₦{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 bg-primary text-white text-center py-2.5 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors touch-target text-sm"
          >
            View Details
          </Link>
          {product.stock > 0 ? (
            <Link
              href={`/preorder?product=${product.id}`}
              className="flex-1 bg-green-600 text-white text-center py-2.5 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors touch-target text-sm"
            >
              Pre-Order
            </Link>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-500 text-center py-2.5 px-4 rounded-lg font-medium cursor-not-allowed touch-target text-sm"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
