import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | PoshPOULE® Farms Ltd',
  description: 'Discover how PoshPOULE® Farms Ltd collects, uses, and protects your personal information when you shop for organic poultry, eggs, and farm produce.',
  keywords: 'PoshPOULE privacy, organic farm data policy, Nigeria farm customer data, secure farm shopping',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-heading-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-neutral-600 mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">1. Information We Collect</h2>
              <p className="text-neutral-600 mb-6">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
              </p>

              <h3 className="font-heading text-xl font-heading-semibold mb-3">Personal Information</h3>
              <ul className="list-disc list-inside text-neutral-600 mb-6 space-y-2">
                <li>Name and contact information (email, phone number, address)</li>
                <li>Payment information (processed securely by our payment partners)</li>
                <li>Order history and preferences</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="font-heading text-xl font-heading-semibold mb-3">Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-neutral-600 mb-6 space-y-2">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent on site)</li>
                <li>Location information (for delivery services)</li>
              </ul>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">2. How We Use Your Information</h2>
              <p className="text-neutral-600 mb-6">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-neutral-600 mb-6 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support</li>
                <li>Send order confirmations and updates</li>
                <li>Improve our products and services</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">3. Information Sharing</h2>
              <p className="text-neutral-600 mb-6">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-neutral-600 mb-6 space-y-2">
                <li>With service providers who assist us in operating our business</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
                <li>With your explicit consent</li>
              </ul>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">4. Data Security</h2>
              <p className="text-neutral-600 mb-6">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">5. Your Rights</h2>
              <p className="text-neutral-600 mb-6">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-neutral-600 mb-6 space-y-2">
                <li>Access the personal information we have about you</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">6. Cookies</h2>
              <p className="text-neutral-600 mb-6">
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">7. Children's Privacy</h2>
              <p className="text-neutral-600 mb-6">
                Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">8. Changes to This Policy</h2>
              <p className="text-neutral-600 mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">9. Contact Us</h2>
              <p className="text-neutral-600 mb-8">
                If you have any questions about this Privacy Policy, please contact us at:
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
