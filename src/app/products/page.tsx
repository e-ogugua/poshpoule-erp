'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { usePriceFormatter } from '@/utils/currency';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { debugLogger } from '@/utils/debug';

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
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formatPrice } = usePriceFormatter();
  const selectedCategory = searchParams.category || null;

  useEffect(() => {
    debugLogger.info('ProductsPage useEffect triggered');
    
    const fetchProducts = async () => {
      try {
        debugLogger.info('Fetching products from API');
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
        debugLogger.info('Products fetched successfully', { count: data.length });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load products. Please try again later.';
        setError(errorMessage);
        debugLogger.error('Error fetching products', err);
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
    <ErrorBoundary>
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
            <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-heading-bold mb-6">
                  Our Premium Products
                </h1>
                <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-90">
                  Discover our range of organic, farm-fresh products grown with care and sustainability in mind.
                  From free-range eggs to seasonal vegetables, every item tells a story of quality and tradition.
                </p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <section className="py-16 md:py-24 bg-neutral-50">
            <div className="container mx-auto px-4">
              {error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <h2 className="font-heading text-2xl font-heading-bold text-neutral-900 mb-2">
                    Failed to Load Products
                  </h2>
                  <p className="text-body text-neutral-600 mb-6">
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                  >
                    Try Again
                  </button>
                  {process.env.NODE_ENV === 'development' && (
                    <details className="mt-6 text-left max-w-md mx-auto">
                      <summary className="cursor-pointer text-sm text-neutral-500">
                        Debug Info
                      </summary>
                      <pre className="mt-2 p-3 bg-neutral-100 rounded text-xs">
                        {debugLogger.getLogs().slice(-5).map(log => 
                          `${log.timestamp} [${log.level}] ${log.message}`
                        ).join('\n')}
                      </pre>
                    </details>
                  )}
                </div>
              ) : (
                <>
                  {/* Category Filter */}
                  {categories.length > 0 && (
                    <div className="mb-8">
                      <div className="flex flex-wrap justify-center gap-2">
                        <Link
                          href="/products"
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            !selectedCategory
                              ? 'bg-primary text-white'
                              : 'bg-white text-neutral-700 hover:bg-primary/10'
                          }`}
                        >
                          All Products
                        </Link>
                        {categories.map((category) => (
                          <Link
                            key={category}
                            href={`/products?category=${encodeURIComponent(category)}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                              selectedCategory === category
                                ? 'bg-primary text-white'
                                : 'bg-white text-neutral-700 hover:bg-primary/10'
                            }`}
                          >
                            {category}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-neutral-600">Loading products...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                          <div key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-primary/10 hover:border-primary/20">
                            <div className="relative h-64 overflow-hidden">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              />
                              {product.featured && (
                                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                                  Featured
                                </div>
                              )}
                            </div>
                            
                            <div className="p-6">
                              <div className="flex items-start justify-between mb-2">
                                <span className="text-sm text-primary font-medium capitalize bg-primary/10 px-2 py-1 rounded-full">
                                  {product.category}
                                </span>
                                {product.available ? (
                                  <span className="text-sm text-green-600 font-medium">Available</span>
                                ) : (
                                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                                )}
                              </div>
                              
                              <h3 className="font-heading text-xl font-heading-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              
                              <p className="text-body mb-4 line-clamp-2 text-neutral-600">
                                {product.description}
                              </p>
                              
                              <div className="flex items-center justify-between mb-4">
                                <span className="font-bold text-primary text-lg">
                                  {formatPrice(product.priceNaira)}
                                </span>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Link
                                  href={`/products/${product.slug}`}
                                  className="flex-1 btn-primary text-center"
                                >
                                  View Details
                                </Link>
                                {product.available && (
                                  <Link
                                    href="/preorder"
                                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors text-center"
                                  >
                                    Pre-order
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {filteredProducts.length === 0 && !isLoading && (
                        <div className="text-center py-12">
                          <p className="text-neutral-600">No products found in this category.</p>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
