'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductPageClientProps {
  product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { name, description, priceNaira, images = [] } = product;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {images?.[selectedImage] ? (
              <Image
                src={images[selectedImage]}
                alt={name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-md overflow-hidden transition-all ${
                    selectedImage === index ? 'ring-2 ring-primary' : 'opacity-75 hover:opacity-100'
                  }`}
                  aria-label={`View image ${index + 1} of ${images.length}`}
                >
                  <Image
                    src={img}
                    alt={`"${name}" - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
          
          <div className="text-2xl font-semibold text-gray-800">
            ₦{priceNaira?.toLocaleString()}
          </div>

          {description && (
            <div className="prose max-w-none text-gray-700">
              <p>{description}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <div className="flex items-center border rounded-md">
              <button 
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="px-3 py-1 text-lg hover:bg-gray-100 transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button 
                type="button"
                onClick={() => setQuantity(prev => prev + 1)}
                className="px-3 py-1 text-lg hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>

            <button 
              type="button"
              onClick={() => {
                // Add to cart functionality will go here
                console.log('Added to cart:', { product, quantity });
              }}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors flex-1 md:flex-none"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
