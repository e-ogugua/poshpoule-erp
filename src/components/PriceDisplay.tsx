'use client';

import { usePriceFormatter } from '@/utils/currency';

export default function PriceDisplay({ priceNaira }: { priceNaira: number }) {
  const { formatPrice } = usePriceFormatter();
  
  return <span className="font-bold text-primary text-lg">{formatPrice(priceNaira)}</span>;
}
