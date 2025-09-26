import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | PoshPOULE® Farms Ltd',
  description: 'Disclaimer for PoshPOULE® Farms Ltd. Our organic produce may vary naturally, and information provided is for educational purposes, not medical advice.',
  keywords: 'farm disclaimer Nigeria, organic produce disclaimer, PoshPOULE policies, farm health info',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-heading-bold mb-6">
              Disclaimer
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Important information about our products and services.
            </p>
          </div>
        </section>

        {/* Disclaimer Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-neutral-600 mb-8">
                Effective Date: June 2025
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">Product Variations</h2>
              <p className="text-neutral-600 mb-6">
                PoshPOULE® Farms strives to provide high-quality organic products, but natural variations in size, weight, color, or appearance may occur. These variations do not affect the quality or safety of our products.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">Educational Information</h2>
              <p className="text-neutral-600 mb-6">
                Nutritional and health content on our website and blog is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with questions about medical conditions.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">Product Storage and Consumption</h2>
              <p className="text-neutral-600 mb-6">
                Customers are responsible for proper storage, preparation, and consumption of products. Follow recommended storage guidelines and consume perishable items within appropriate timeframes.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">Limitation of Liability</h2>
              <p className="text-neutral-600 mb-6">
                We are not liable for issues arising from mishandling, improper storage, or consumption after delivery. Our liability is limited to the value of the products purchased.
              </p>

              <h2 className="font-heading text-2xl font-heading-semibold mb-4">External Links</h2>
              <p className="text-neutral-600 mb-6">
                Our website may contain links to external sites. We are not responsible for the content, privacy policies, or practices of third-party websites.
              </p>

              <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-amber-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-heading text-lg font-heading-semibold text-amber-800 mb-2">
                      Important Notice
                    </h3>
                    <p className="text-amber-700">
                      Information provided on this website is for general guidance only. For specific health concerns or dietary requirements, please consult with qualified healthcare professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
