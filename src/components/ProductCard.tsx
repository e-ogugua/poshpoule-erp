'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  priceNaira: number;
  image: string;
  slug: string;
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
      <div className="card p-6">
        <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-20"></div>
          <div className="h-8 bg-gray-200 animate-pulse rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="font-heading text-xl font-heading-semibold mb-2">{product.name}</h3>
      <p className="text-body mb-4 line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-primary text-lg">
            {formatPrice(product.priceNaira)}
          </span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="btn-outline text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
