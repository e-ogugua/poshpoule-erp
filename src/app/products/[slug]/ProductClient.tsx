'use client';

import { useState, useEffect, useMemo } from 'react';
import { notFound } from 'next/navigation';
import ProductDetails from './ProductDetails';

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
}

// Create a separate loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Memoize the product details component to prevent unnecessary re-renders
const MemoizedProductDetails = ({ slug, product }: { slug: string; product: Product }) => {
  return <ProductDetails slug={slug} initialProduct={product} />;
};

export default function ProductClient({ slug, initialProduct }: { 
  slug: string; 
  initialProduct: Product | null;
}) {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    // Only fetch if we don't have initial data and we're not already fetching
    if (initialProduct || isFetching) {
      if (initialProduct) {
        setIsLoading(false);
      }
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const fetchProduct = async () => {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/products/${slug}`, { signal });
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name !== 'AbortError') {
            setError(err.message);
          }
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
          setIsFetching(false);
        }
      }
    };

    fetchProduct();

    return () => {
      controller.abort();
    };
  }, [slug, initialProduct, isFetching]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          {error || 'Product not found. Please try again later.'}
        </p>
      </div>
    );
  }

  return <MemoizedProductDetails slug={slug} product={product} />;
}
