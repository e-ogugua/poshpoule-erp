'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
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

function ProductCard({ product }: { product: any }) {
  const { formatPrice, currency } = usePriceFormatter();
  
  // This component will automatically re-render when currency changes
  // because it's using the currency value from context
  
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

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectedCategory = searchParams.category || null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category)));
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary to-green-700 text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/farm/farmFreshEggs.PNG"
              alt="PoshPOULE Farm Products"
              fill
              priority
              className="object-cover opacity-20"
              sizes="100vw"
            />
          </div>
          <div className="relative container mx-auto px-4 text-center py-16">
            <h1 className="text-4xl md:text-5xl font-heading-bold mb-4">
              Our Products
            </h1>
            <p className="text-xl opacity-90">
              Fresh, organic, and sustainably grown produce from our farm
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <CategoryFilter categories={categories} selectedCategory={selectedCategory} />

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-neutral-500 text-lg">No products found in this category.</p>
                    <Link href="/products" className="btn-primary mt-4">
                      View All Products
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-neutral-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl font-heading-bold mb-4">
              Ready to Place Your Order?
            </h2>
            <p className="text-body text-lg mb-8 max-w-2xl mx-auto">
              Experience the freshness and quality of our organic products.
              Order now and taste the difference that sustainable farming makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/preorder" className="btn-primary">
                Start Your Order
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
