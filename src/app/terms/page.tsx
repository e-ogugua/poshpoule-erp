import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | PoshPOULE® Farms Ltd',
  description: 'Read the official terms and conditions of PoshPOULE® Farms Ltd. Learn about orders, payments, delivery, and customer responsibilities when buying organic farm products.',
  keywords: 'PoshPOULE terms, organic farm policies, Nigeria poultry terms, farm product conditions',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-heading-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Please read these terms carefully before using our services.
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-neutral-600 mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-neutral-600 mb-6">
                By accessing and using PoshPOULE Farms' services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">2. Use License</h2>
              <p className="text-neutral-600 mb-6">
                Permission is granted to temporarily use our website and services for personal, non-commercial transitory viewing only.
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-neutral-600 mb-6 space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on our website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">3. Product Information</h2>
              <p className="text-neutral-600 mb-6">
                We strive to provide accurate product descriptions and pricing information. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">4. Pricing and Payment</h2>
              <p className="text-neutral-600 mb-6">
                All prices are subject to change without notice. We reserve the right to refuse or cancel any orders placed for products listed at an incorrect price.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">5. Delivery and Pickup</h2>
              <p className="text-neutral-600 mb-6">
                Delivery times are estimates only. We are not responsible for delays caused by circumstances beyond our control. Pickup orders must be collected within the specified timeframe.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">6. Returns and Refunds</h2>
              <p className="text-neutral-600 mb-6">
                Fresh products like eggs and produce are non-returnable for health and safety reasons. If you're not satisfied with your order, please contact us within 24 hours for assistance.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">7. Limitation of Liability</h2>
              <p className="text-neutral-600 mb-6">
                In no event shall PoshPOULE Farms or its suppliers be liable for any damages arising out of the use or inability to use our products or services.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">8. Contact Information</h2>
              <p className="text-neutral-600 mb-8">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-neutral-50 p-6 rounded-lg">
                <p className="text-neutral-600">
                  <strong>Email:</strong> info@poshpoule.com<br />
                  <strong>Phone:</strong> +234 800 000 0000<br />
                  <strong>Address:</strong> Farm Location, Nigeria
                </p>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-12 text-center">
              <Link href="/" className="btn-outline inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
