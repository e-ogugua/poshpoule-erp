'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Minus, Plus, ShoppingCart, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { usePriceFormatter } from '@/utils/currency';

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
  features?: string[];
}

interface ProductPageProps {
  params: { slug: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { format, convert } = usePriceFormatter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // For now, we'll use a simple approach to find the product
        // In a real app, you'd make an API call to get the specific product
        const response = await fetch('/api/products');
        if (response.ok) {
          const products: Product[] = await response.json();
          const foundProduct = products.find(p => p.slug === params.slug);
          setProduct(foundProduct || null);
          if (foundProduct) {
            setSelectedImage(foundProduct.image);
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-heading-bold mb-4">Product Not Found</h1>
            <p className="text-body mb-8">The product you're looking for doesn't exist.</p>
            <Link href="/products" className="btn-primary">
              View All Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalPrice = convert(product.priceNaira * quantity);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100 shadow-lg mb-4 lg:max-h-[420px] mx-auto">
                <Image
                  src={selectedImage || product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`relative aspect-square h-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                        selectedImage === image ? 'border-primary' : 'border-transparent hover:border-primary/60'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 25vw, 12.5vw"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                <span className="text-sm text-neutral-500 uppercase tracking-wide">
                  {product.category}
                </span>
                <h1 className="font-heading text-3xl font-heading-bold mt-2 mb-4">
                  {product.name}
                </h1>
                <p className="text-body text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-heading text-xl font-heading-semibold mb-4">What makes it premium</h2>
                  <div className="grid gap-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-primary/5 rounded-2xl">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                        <p className="text-neutral-700 leading-snug">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-2xl text-primary">
                    {format(product.priceNaira)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock > 10
                      ? 'bg-green-100 text-green-800'
                      : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-neutral-600">Quantity:</span>
                  <div className="flex items-center border border-neutral-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-neutral-100 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-neutral-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-lg font-semibold mb-6">
                  Total: {format(totalPrice)}
                </div>

                <div className="flex space-x-4">
                  <Link
                    href={`/preorder?product=${product.id}&quantity=${quantity}`}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Order</span>
                  </Link>
                  <Link
                    href="/preorder"
                    className="flex-1 btn-outline text-center"
                  >
                    Custom Order
                  </Link>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6">
                <h3 className="font-heading text-lg font-heading-semibold mb-4">
                  Product Information
                </h3>
                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex justify-between">
                    <span>Availability:</span>
                    <span>{product.available ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SKU:</span>
                    <span>{product.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
