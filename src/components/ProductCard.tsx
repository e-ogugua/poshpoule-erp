'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useEffect, useState } from 'react';
import PriceDisplay from '@/components/PriceDisplay';

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
  const { formatPrice } = useCurrency();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
        <div className="p-4">
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {product.category}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.stock > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        <h3 className="font-heading text-lg font-heading-semibold mb-2 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <PriceDisplay priceNaira={product.priceNaira} />
        </div>

        <div className="flex space-x-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 bg-primary text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            View Details
          </Link>
          {product.stock > 0 ? (
            <Link
              href={`/preorder?product=${product.id}`}
              className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Pre-Order
            </Link>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-500 text-center py-2 px-4 rounded-lg font-medium cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
