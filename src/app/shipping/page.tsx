import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Truck } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | PoshPOULE® Farms Ltd',
  description: 'Read PoshPOULE® Farms Ltd shipping and delivery policy. Find details on delivery areas, timelines, fees, and customer responsibilities for fresh farm products.',
  keywords: 'farm delivery Nigeria, organic farm shipping, PoshPOULE delivery, fresh poultry and eggs shipping',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-heading-bold mb-6">
              Shipping & Delivery Policy
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Fast, reliable delivery of fresh farm products to your doorstep.
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

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">Delivery Areas</h2>
              <p className="text-neutral-600 mb-6">
                We currently deliver within Enugu, Southeast Nigeria, and surrounding areas. Nationwide delivery may be arranged via third-party logistics at additional cost.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">Delivery Timeline</h2>
              <p className="text-neutral-600 mb-6">
                Orders are usually delivered within 24–72 hours depending on location and product availability. Fresh products are prioritized for same-day or next-day delivery when possible.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">Delivery Charges</h2>
              <p className="text-neutral-600 mb-6">
                Fees vary based on distance, weight, and delivery partner. Customers are informed of delivery charges before dispatch. Free delivery may be available for orders above certain amounts.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">Customer Responsibilities</h2>
              <ul className="list-disc list-inside text-neutral-600 mb-6 space-y-2">
                <li>Provide accurate delivery addresses and contact information</li>
                <li>Be available to receive goods during scheduled delivery times</li>
                <li>Inspect products upon delivery and report any issues immediately</li>
                <li>Ensure someone is available to receive perishable items</li>
              </ul>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">Delivery Partners</h2>
              <p className="text-neutral-600 mb-6">
                We work with trusted local delivery partners to ensure your products arrive fresh and on time. All delivery personnel follow food safety protocols.
              </p>

              <div className="mt-12 p-6 bg-neutral-50 rounded-lg">
                <h3 className="font-heading text-xl font-heading-semibold mb-4">Track Your Order</h3>
                <p className="text-neutral-600 mb-4">
                  Once your order is dispatched, you&apos;ll receive tracking information via SMS or email. For urgent inquiries, contact us directly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
