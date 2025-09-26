'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Calendar, Clock, MapPin, User, Phone, Mail } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  priceNaira: number;
  category: string;
}

interface OrderFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'pickup' | 'delivery';
  deliveryAddress: string;
  scheduledDate: string;
  scheduledTime: string;
  notes: string;
}

export default function PreorderPage({
  searchParams,
}: {
  searchParams: { product?: string; quantity?: string }
}) {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    orderType: 'pickup',
    deliveryAddress: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: '',
  });
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();

    // Handle URL parameters for pre-selected products
    if (searchParams.product && products.length > 0) {
      const product = products.find(p => p.id === searchParams.product);
      if (product) {
        const quantity = parseInt(searchParams.quantity || '1');
        setSelectedProducts([{
          ...product,
          quantity: quantity,
          totalPrice: product.priceNaira * quantity
        }]);
      }
    }
  }, [searchParams, products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (quantity <= 0) {
      setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    } else {
      setSelectedProducts(prev => {
        const existing = prev.find(p => p.id === productId);
        if (existing) {
          return prev.map(p =>
            p.id === productId
              ? { ...p, quantity, totalPrice: product.priceNaira * quantity }
              : p
          );
        } else {
          return [...prev, {
            ...product,
            quantity,
            totalPrice: product.priceNaira * quantity
          }];
        }
      });
    }
  };

  const totalAmount = selectedProducts.reduce((sum, product) => sum + product.totalPrice, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        products: selectedProducts.map(p => ({
          productId: p.id,
          name: p.name,
          quantity: p.quantity,
          priceNaira: p.priceNaira
        })),
        totalAmount,
        currency: 'NGN',
        status: 'new',
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-heading text-3xl font-heading-bold mb-8 text-center">
            Place Your Pre-Order
          </h1>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div className="card p-6">
                <h2 className="font-heading text-xl font-heading-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Order Type & Scheduling */}
              <div className="card p-6">
                <h2 className="font-heading text-xl font-heading-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Order Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Order Type *</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="orderType"
                          value="pickup"
                          checked={formData.orderType === 'pickup'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Pickup
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="orderType"
                          value="delivery"
                          checked={formData.orderType === 'delivery'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Delivery
                      </label>
                    </div>
                  </div>

                  {formData.orderType === 'delivery' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                      <textarea
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleInputChange}
                        required
                        className="input-field w-full h-24"
                        placeholder="Enter your delivery address"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Date *</label>
                    <input
                      type="date"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Time *</label>
                    <select
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                    >
                      <option value="">Select a time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="input-field w-full h-24"
                      placeholder="Any special instructions or notes"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Selection */}
            <div className="card p-6 mt-8">
              <h2 className="font-heading text-xl font-heading-semibold mb-4">Select Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-neutral-600">₦{product.priceNaira.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleProductChange(product.id, Math.max(0, (selectedProducts.find(p => p.id === product.id)?.quantity || 0) - 1))}
                        className="w-8 h-8 rounded border flex items-center justify-center hover:bg-neutral-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">
                        {selectedProducts.find(p => p.id === product.id)?.quantity || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleProductChange(product.id, (selectedProducts.find(p => p.id === product.id)?.quantity || 0) + 1)}
                        className="w-8 h-8 rounded border flex items-center justify-center hover:bg-neutral-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedProducts.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-heading text-lg font-heading-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    {selectedProducts.map((product) => (
                      <div key={product.id} className="flex justify-between">
                        <span>{product.name} × {product.quantity}</span>
                        <span>₦{product.totalPrice.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₦{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center mt-8">
              <button
                type="submit"
                disabled={isSubmitting || selectedProducts.length === 0}
                className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Order'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
