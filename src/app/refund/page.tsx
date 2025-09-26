import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Return Policy | PoshPOULE® Farms Ltd',
  description: 'Learn about our refund and return policy at PoshPOULE® Farms Ltd. We guarantee quality organic produce with clear policies for damaged or unsatisfactory products.',
  keywords: 'farm product refund, organic farm returns, PoshPOULE refunds, Nigeria farm goods return policy',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-heading-bold mb-6">
              Refund & Return Policy
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              We stand behind our products. Learn about our refund and return policies.
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-neutral-600 mb-8">
                Effective Date: June 2025
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">Fresh Produce Returns</h2>
              <p className="text-neutral-600 mb-6">
                Due to the perishable nature of eggs, poultry, and vegetables, returns are not accepted once delivered. We recommend inspecting your order upon delivery.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">Damaged Goods</h2>
              <p className="text-neutral-600 mb-6">
                If products arrive damaged or unsafe, notify us within 24 hours with photo evidence. We may replace or refund at our discretion.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">Non-Perishable Items</h2>
              <p className="text-neutral-600 mb-6">
                Refunds may apply to packaged products if returned within 7 days in unopened condition.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">Refund Processing</h2>
              <p className="text-neutral-600 mb-6">
                Refunds are processed within 7–14 working days via the original payment method.
              </p>

              <div className="mt-12 p-6 bg-neutral-50 rounded-lg">
                <h3 className="font-heading text-xl font-heading-semibold mb-4">Contact Us</h3>
                <p className="text-neutral-600 mb-4">
                  For refund requests or questions about our return policy, please contact us:
                </p>
                <ul className="text-neutral-600 space-y-2">
                  <li>Email: poshpoulefarms@gmail.com</li>
                  <li>Phone: +234 812 239 4397 | 08064508595</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
