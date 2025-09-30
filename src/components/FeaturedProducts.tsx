'use client';

import dynamic from 'next/dynamic';

const ProductCard = dynamic(
  () => import('@/components/ProductCard').then(mod => mod.default),
  { 
    ssr: false, 
    loading: () => (
      <div className="card p-6">
        <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-20"></div>
          <div className="h-8 bg-gray-200 animate-pulse rounded w-24"></div>
        </div>
      </div>
    )
  }
);

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

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featuredProducts = products.filter(product => product.featured).slice(0, 4);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover our premium selection of farm-fresh products</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
