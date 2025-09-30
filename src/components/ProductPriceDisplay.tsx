'use client';

import { useEffect, useState } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ProductPriceDisplayProps {
  priceNaira: number;
  originalPrice?: number;
  discountPercentage?: number;
}

export default function ProductPriceDisplay({ 
  priceNaira, 
  originalPrice, 
  discountPercentage 
}: ProductPriceDisplayProps) {
  const { formatPrice } = useCurrency();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-3xl font-bold text-primary">
        {formatPrice(priceNaira)}
      </div>
      {originalPrice && (
        <span className="text-lg text-gray-500 line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
      {discountPercentage && (
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {discountPercentage}% OFF
        </span>
      )}
    </div>
  );
}
