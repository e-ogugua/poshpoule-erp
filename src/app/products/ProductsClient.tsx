'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { usePriceFormatter } from '@/utils/currency';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceNaira: number;
  category: string;
  image: string;
  images: string[];
  featured: boolean;
  available: boolean;
  stock: number;
  basePriceNaira: number;
  createdAt: string;
}

function ProductCard({ product }: { product: Product }) {
  const { formatPrice } = usePriceFormatter();
  
  return (
    <div className="card p-6">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="font-heading text-xl font-heading-semibold mb-2">{product.name}</h3>
      <p className="text-body mb-4 line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-primary text-lg">{formatPrice(product.priceNaira)}</span>
        <span className="text-sm text-neutral-500 capitalize">{product.category}</span>
      </div>
      <div className="flex space-x-2">
        <Link
          href={`/products/${product.slug}`}
          className="flex-1 btn-primary text-center"
        >
          View Details
        </Link>
        <Link
          href={`/preorder?product=${product.id}`}
          className="flex-1 btn-outline text-center"
        >
          Pre-Order
        </Link>
      </div>
    </div>
  );
}

function CategoryFilter({ categories, selectedCategory }: { categories: string[], selectedCategory: string | null }) {
  return (
    <div className="mb-8">
      <h3 className="font-heading text-lg font-heading-semibold mb-4">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !selectedCategory
              ? 'bg-primary text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          All Products
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/products?category=${encodeURIComponent(category)}`}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}

interface ProductsClientProps {
  searchParams: { category?: string };
  products: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
}

export default function ProductsClient({
  searchParams,
  products,
  categories,
  isLoading,
  error
}: ProductsClientProps) {
  const { formatPrice } = usePriceFormatter();
  const selectedCategory = searchParams.category || null;

  // Filter products by category if one is selected
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-heading font-heading-bold mb-4">Our Products</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover our range of high-quality products designed to meet your needs.
          </p>
        </div>

        <CategoryFilter categories={categories} selectedCategory={selectedCategory} />

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-neutral-500">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
