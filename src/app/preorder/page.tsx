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
  // Add error boundary
  if (typeof window === 'undefined') {
    return null; // Return null during SSR
  }
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
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample product data to use when API is not available
  const sampleProducts: Product[] = [
    { id: '1', name: 'Fresh Eggs (Tray of 30)', priceNaira: 3000, category: 'Eggs' },
    { id: '2', name: 'Organic Chicken (Whole)', priceNaira: 8000, category: 'Poultry' },
    { id: '3', name: 'Fresh Vegetables (Seasonal)', priceNaira: 2000, category: 'Vegetables' },
    { id: '4', name: 'Farm Fresh Fruits', priceNaira: 2500, category: 'Fruits' }
  ];

  useEffect(() => {
    // Try to fetch products from API, fallback to sample data if it fails
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          // If API call fails, use sample data
          setProducts(sampleProducts);
        }
      } catch (error) {
        console.error('Failed to fetch products, using sample data:', error);
        setProducts(sampleProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle URL parameters for pre-selected products
  useEffect(() => {
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
    setSubmitStatus('loading');
    setErrorMessage('');

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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit order');
      }
      
      setSubmitStatus('success');
      // Reset form on successful submission
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        orderType: 'pickup',
        deliveryAddress: '',
        scheduledDate: '',
        scheduledTime: '',
        notes: '',
      });
      setSelectedProducts([]);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting order:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit order. Please try again.');
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 5000);
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
                <div className="mt-4 space-y-2">
                  <button
                    type="submit"
                    disabled={submitStatus === 'loading' || selectedProducts.length === 0}
                    className={`w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium transition-colors ${
                      submitStatus === 'loading'
                        ? 'bg-primary/80 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                  >
                    {submitStatus === 'loading' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                  
                  {submitStatus === 'success' && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Order submitted successfully! We'll contact you shortly.
                    </div>
                  )}
                  
                  {submitStatus === 'error' && errorMessage && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {errorMessage}
                    </div>
                  )}
                </div>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
