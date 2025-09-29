'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { formatWithCurrency, getCurrencySymbol } from '@/utils/currency';
import { Product } from './ProductClient';

interface ProductDetailsProps {
  slug: string;
  initialProduct: Product;
}

export default function ProductDetails({ slug, initialProduct }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Format price in NGN (base currency)
  const formatPrice = (price: number) => {
    return formatWithCurrency(price, 'NGN');
  };

  // Get all product images, falling back to the main image if no images array exists
  const productImages = useMemo(() => {
    if (Array.isArray(initialProduct.images) && initialProduct.images.length > 0) {
      return initialProduct.images;
    }
    return initialProduct.image ? [initialProduct.image] : [];
  }, [initialProduct]);

  // Set initial selected image when component mounts or product changes
  useEffect(() => {
    if (productImages.length > 0) {
      setSelectedImage(productImages[0]);
    } else {
      setSelectedImage('');
    }
  }, [productImages]);
  // Handle quantity changes
  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (newQuantity < 1) return;
    if (initialProduct.stock && newQuantity > initialProduct.stock) return;
    setQuantity(newQuantity);
  }, [initialProduct.stock]);

  // Memoize the add to cart handler
  const handleAddToCart = useCallback(() => {
    console.log('Added to cart:', { ...initialProduct, quantity });
  }, [initialProduct, quantity]);

  const price = formatPrice(initialProduct.priceNaira);
  const totalPrice = formatPrice(initialProduct.priceNaira * quantity);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={initialProduct.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={80}
                onError={(e) => {
                  // Fallback to product.image if selectedImage fails to load
                  if (initialProduct.image && selectedImage !== initialProduct.image) {
                    setSelectedImage(initialProduct.image);
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          
          {productImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(image)}
                  className={`relative aspect-square bg-gray-100 rounded overflow-hidden ${
                    selectedImage === image ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${initialProduct.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                    quality={80}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{initialProduct.name}</h1>
          
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-semibold text-gray-900">{price}</span>
            {initialProduct.stock > 0 ? (
              <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                In Stock ({initialProduct.stock} available)
              </span>
            ) : (
              <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700">{initialProduct.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-4">
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
                disabled={initialProduct.stock ? quantity >= initialProduct.stock : false}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
              
            <button
              className={`px-6 py-2 rounded-md font-medium flex items-center space-x-2 ${
                initialProduct.available && initialProduct.stock > 0
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleAddToCart}
              disabled={!initialProduct.available || initialProduct.stock <= 0}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{initialProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
          </div>
            
          {initialProduct.stock > 0 && (
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
              <p className="font-medium capitalize">{initialProduct.category}</p>
            </div>
            <div>
              <p className="text-gray-500">Availability</p>
              <p className="font-medium">
                {initialProduct.available && initialProduct.stock > 0 
                  ? `In Stock (${initialProduct.stock} available)` 
                  : 'Out of Stock'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
