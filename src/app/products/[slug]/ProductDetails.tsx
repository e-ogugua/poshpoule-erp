'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { formatWithCurrency, getCurrencySymbol } from '@/utils/currency';

interface ProductDetailsProps {
  slug: string;
  initialProduct?: Product;
}

interface Product {
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

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Failed to fetch product');
    throw error;
  }
  return res.json();
};

export default function ProductDetails({ slug, initialProduct }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  // Format price in NGN (base currency)
  const formatPrice = (price: number) => {
    return formatWithCurrency(price, 'NGN');
  };
  
  // Get the currency symbol for display
  const currencySymbol = getCurrencySymbol('NGN');

  // Use SWR for client-side data fetching with revalidation
  const { data: product, error, isLoading } = useSWR<Product>(
    `/api/products/${slug}`,
    fetcher,
    {
      fallbackData: initialProduct,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    }
  );

  // Set the initial selected image when product loads
  useEffect(() => {
    if (!product) return;
    
    if (Array.isArray(product.images) && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    } else if (product.image) {
      setSelectedImage(product.image);
    } else {
      setSelectedImage('');
    }
  }, [product]);

  if (isLoading && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load product. Please try again later.
      </div>
    );
  }

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Added to cart:', { ...product, quantity });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (product.stock && newQuantity > product.stock) return;
    setQuantity(newQuantity);
  };

  const price = formatPrice(product.priceNaira);
  const totalPrice = formatPrice(product.priceNaira * quantity);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => {
                  // Fallback to product.image if selectedImage fails to load
                  if (product.image && selectedImage !== product.image) {
                    setSelectedImage(product.image);
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          
          {(Array.isArray(product.images) ? product.images.length > 0 : false) && (
            <div className="grid grid-cols-4 gap-2">
              {Array.from(new Set([product.image, ...(product.images || [])]))
                .filter((image): image is string => {
                  if (!image) return false;
                  try {
                    new URL(image);
                    return true;
                  } catch {
                    return false;
                  }
                })
                .map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setSelectedImage(image)}
                    className={`relative aspect-square bg-gray-100 rounded overflow-hidden ${
                      selectedImage === image ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                      onError={(e) => {
                        // Remove the image from the gallery if it fails to load
                        if (selectedImage === image && product.images?.[0]) {
                          setSelectedImage(product.images[0]);
                        }
                      }}
                    />
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-semibold text-gray-900">{price}</span>
            {product.stock > 0 ? (
              <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md overflow-hidden">
                <button 
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button 
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={product.stock ? quantity >= product.stock : false}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <button
                className={`px-6 py-2 rounded-md font-medium flex items-center space-x-2 ${
                  product.available && product.stock > 0
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleAddToCart}
                disabled={!product.available || product.stock <= 0}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>
            
            {product.stock > 0 && (
              <p className="mt-2 text-sm text-gray-500">
                Subtotal: <span className="font-medium">{totalPrice}</span>
              </p>
            )}
          </div>

          {/* Product Meta */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium capitalize">{product.category}</p>
              </div>
              <div>
                <p className="text-gray-500">Availability</p>
                <p className="font-medium">
                  {product.available && product.stock > 0 
                    ? `In Stock (${product.stock} available)` 
                    : 'Out of Stock'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
