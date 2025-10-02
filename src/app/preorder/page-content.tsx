'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FormInput, FormTextarea, FormSelect } from '@/components/FormComponents';
import { OrderFormSkeleton } from '@/components/FormSkeleton';
import { Calendar, Clock, User, ShoppingCart } from 'lucide-react';
import { usePriceFormatter } from '@/utils/currency';
import { useForm } from '@/hooks/useForm';
import { getMinDate, formatCurrency } from '@/lib/validation';

interface Product {
  id: string;
  name: string;
  priceNaira: number;
  category: string;
  slug: string;
  description: string;
  stock: number;
  image: string;
  featured: boolean;
  available: boolean;
  createdAt: string;
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
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    priceNaira: number;
  }>;
  totalAmount: number;
}

export default function PreorderPageContent({
  searchParams,
}: {
  searchParams: { product?: string; quantity?: string }
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { format } = usePriceFormatter();

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Handle both array and object responses
        const productsData = Array.isArray(data) ? data : (data.data || []);
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError('Unable to load products. Please try again later.');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductChange = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (quantity <= 0) {
      setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
    } else {
      setSelectedProducts(prev => {
        const existing = prev.find(p => p.productId === productId);
        if (existing) {
          return prev.map(p =>
            p.productId === productId
              ? { ...p, quantity, totalPrice: product.priceNaira * quantity }
              : p
          );
        } else {
          return [...prev, {
            productId: product.id,
            name: product.name,
            quantity,
            priceNaira: product.priceNaira,
          }];
        }
      });
    }
  };

  // Initialize form with selected products from URL params
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [initialFormData] = useState<OrderFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    orderType: 'pickup',
    deliveryAddress: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: '',
    products: [],
    totalAmount: 0,
  });

  // Handle URL parameters for pre-selected products
  useEffect(() => {
    if (searchParams.product && products.length > 0) {
      const product = products.find(p => p.id === searchParams.product);
      if (product) {
        const quantity = parseInt(searchParams.quantity || '1');
        handleProductChange(product.id, quantity);
      }
    }
  }, [searchParams, products]);

  const totalAmount = selectedProducts.reduce((sum: number, product: any) =>
    sum + (product.priceNaira * product.quantity), 0
  );

  const formData = {
    ...initialFormData,
    products: selectedProducts,
    totalAmount,
  };

  const handleSubmit = async (values: OrderFormData) => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...values,
        status: 'new',
        createdAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to submit order');
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    submitError,
    submitSuccess,
    setValue,
    setTouched,
    markFieldAsTouched,
    formatField,
    handleSubmit: onSubmit,
    reset,
  } = useForm({
    initialValues: formData,
    onSubmit: handleSubmit,
    validateOnChange: true,
  });

  // Update form values when selected products change
  useEffect(() => {
    setValue('products', selectedProducts);
    setValue('totalAmount', totalAmount);
  }, [selectedProducts, totalAmount, setValue]);

  const timeOptions = [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <h1 className="font-heading text-3xl font-heading-bold mb-8 text-center">
              Place Your Pre-Order
            </h1>
            <OrderFormSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-heading text-3xl font-heading-bold mb-8 text-center">
            Place Your Pre-Order
          </h1>

          {error && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 max-w-4xl mx-auto">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    {error} Some features may be limited.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div className="card p-6">
                <h2 className="font-heading text-xl font-heading-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </h2>
                <div className="space-y-4">
                  <FormInput
                    label="Full Name *"
                    name="customerName"
                    value={values.customerName}
                    onChange={(e) => setValue('customerName', e.target.value)}
                    onBlur={() => markFieldAsTouched('customerName')}
                    error={touched.customerName ? errors.customerName : undefined}
                    placeholder="Enter your full name"
                    required
                  />

                  <FormInput
                    label="Email Address *"
                    type="email"
                    name="customerEmail"
                    value={values.customerEmail}
                    onChange={(e) => setValue('customerEmail', e.target.value)}
                    onBlur={() => markFieldAsTouched('customerEmail')}
                    error={touched.customerEmail ? errors.customerEmail : undefined}
                    placeholder="Enter your email address"
                    required
                  />

                  <FormInput
                    label="Phone Number *"
                    type="tel"
                    name="customerPhone"
                    value={values.customerPhone}
                    onChange={(e) => setValue('customerPhone', e.target.value)}
                    onBlur={() => markFieldAsTouched('customerPhone')}
                    error={touched.customerPhone ? errors.customerPhone : undefined}
                    placeholder="e.g., 08012345678"
                    helperText="Enter Nigerian phone number"
                    required
                  />
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
                          checked={values.orderType === 'pickup'}
                          onChange={(e) => setValue('orderType', e.target.value as 'pickup' | 'delivery')}
                          className="mr-2"
                        />
                        Pickup
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="orderType"
                          value="delivery"
                          checked={values.orderType === 'delivery'}
                          onChange={(e) => setValue('orderType', e.target.value as 'pickup' | 'delivery')}
                          className="mr-2"
                        />
                        Delivery
                      </label>
                    </div>
                  </div>

                  {values.orderType === 'delivery' && (
                    <FormTextarea
                      label="Delivery Address *"
                      name="deliveryAddress"
                      value={values.deliveryAddress}
                      onChange={(e) => setValue('deliveryAddress', e.target.value)}
                      onBlur={() => markFieldAsTouched('deliveryAddress')}
                      error={touched.deliveryAddress ? errors.deliveryAddress : undefined}
                      placeholder="Enter your complete delivery address"
                      required
                    />
                  )}

                  <FormInput
                    label="Preferred Date *"
                    type="date"
                    name="scheduledDate"
                    value={values.scheduledDate}
                    onChange={(e) => setValue('scheduledDate', e.target.value)}
                    onBlur={() => markFieldAsTouched('scheduledDate')}
                    error={touched.scheduledDate ? errors.scheduledDate : undefined}
                    min={getMinDate()}
                    required
                  />

                  <FormSelect
                    label="Preferred Time *"
                    name="scheduledTime"
                    value={values.scheduledTime}
                    onChange={(e) => setValue('scheduledTime', e.target.value)}
                    onBlur={() => markFieldAsTouched('scheduledTime')}
                    error={touched.scheduledTime ? errors.scheduledTime : undefined}
                    options={[
                      { value: '', label: 'Select a time' },
                      ...timeOptions
                    ]}
                    required
                  />

                  <FormTextarea
                    label="Additional Notes"
                    name="notes"
                    value={values.notes}
                    onChange={(e) => setValue('notes', e.target.value)}
                    onBlur={() => markFieldAsTouched('notes')}
                    error={touched.notes ? errors.notes : undefined}
                    placeholder="Any special instructions or dietary requirements"
                    helperText="Optional - maximum 500 characters"
                  />
                </div>
              </div>
            </div>

            {/* Products Selection */}
            <div className="card p-6 mt-8">
              <h2 className="font-heading text-xl font-heading-semibold mb-4 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Select Products
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {products.length > 0 ? products.map((product) => {
                  const selectedProduct = selectedProducts.find(p => p.productId === product.id);
                  const quantity = selectedProduct?.quantity || 0;

                  return (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-neutral-600">{format(product.priceNaira)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleProductChange(product.id, Math.max(0, quantity - 1))}
                          className="w-8 h-8 rounded border flex items-center justify-center hover:bg-neutral-100 transition-colors"
                          aria-label={`Decrease quantity for ${product.name}`}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleProductChange(product.id, quantity + 1)}
                          className="w-8 h-8 rounded border flex items-center justify-center hover:bg-neutral-100 transition-colors"
                          aria-label={`Increase quantity for ${product.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-gray-500">No products available at the moment.</p>
                  </div>
                )}
              </div>

              {selectedProducts.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-heading text-lg font-heading-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    {selectedProducts.map((product) => (
                      <div key={product.productId} className="flex justify-between">
                        <span>{product.name} × {product.quantity}</span>
                        <span>{formatCurrency(product.priceNaira * product.quantity)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center mt-8">
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting || selectedProducts.length === 0}
                  className={`w-full max-w-sm flex items-center justify-center py-3 px-6 rounded-lg font-medium transition-colors ${
                    isSubmitting || selectedProducts.length === 0
                      ? 'bg-primary/80 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>

                {submitError && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center max-w-md mx-auto">
                    <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{submitError}</span>
                  </div>
                )}

                {submitSuccess && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center max-w-md mx-auto">
                    <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{submitSuccess}</span>
                  </div>
                )}

                {selectedProducts.length === 0 && !isSubmitting && (
                  <p className="text-sm text-gray-500">
                    Please select at least one product to place your order.
                  </p>
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
