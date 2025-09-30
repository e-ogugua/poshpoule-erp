'use client';

import { Button } from '@/components/ui/Button';
import { ShoppingCart, Heart } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the ProductPriceDisplay component with SSR disabled
const ProductPriceDisplay = dynamic(
  () => import('@/components/ProductPriceDisplay').then(mod => mod.default),
  { 
    ssr: false, 
    loading: () => <div className="h-10 w-48 bg-gray-200 animate-pulse rounded"></div> 
  }
);

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceNaira: number;
  category: string;
  stock: number;
  image: string;
  images: string[];
  featured: boolean;
  available: boolean;
  createdAt: string;
  originalPrice?: number;
  discountPercentage?: number;
}

interface ProductClientProps {
  product: Product;
}

export default function ProductClient({ product }: ProductClientProps) {
  if (!product) {
    return <div>Error: Product not found</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      
      <div className="mb-6">
        <ProductPriceDisplay 
          priceNaira={product.priceNaira}
          originalPrice={product.originalPrice}
          discountPercentage={product.discountPercentage}
        />
      </div>

      <div className="space-y-4">
        <p className="text-gray-700">{product.description}</p>
        
        <div className="flex items-center gap-4 pt-4">
          <Button className="flex-1" size="lg">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button variant="outline" size="lg">
            <Heart className="mr-2 h-4 w-4" />
            Wishlist
          </Button>
        </div>
      </div>
    </div>
  );
}
