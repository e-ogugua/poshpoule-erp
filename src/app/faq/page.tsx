import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, FileText, Shield, Scale } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      question: "What makes your eggs organic?",
      answer: "Our eggs come from free-range chickens that are fed only organic, non-GMO feed. They have access to outdoor pastures and are never given antibiotics or hormones."
    },
    {
      question: "How fresh are your products?",
      answer: "All our products are harvested fresh daily. Eggs are collected the same day they're laid, and vegetables are picked at peak ripeness for maximum nutrition and flavor."
    },
    {
      question: "Do you offer delivery?",
      answer: "Yes! We offer both pickup from our farm and delivery to your location. Delivery fees may apply based on distance and order size."
    },
    {
      question: "What's your return policy?",
      answer: "We stand behind the quality of our products. If you're not satisfied with your purchase, please contact us within 24 hours for a full refund or replacement."
    },
    {
      question: "Are your farming practices sustainable?",
      answer: "Absolutely. We use regenerative farming practices that improve soil health, conserve water, and support biodiversity. We're committed to environmental stewardship."
    },
    {
      question: "Can I visit your farm?",
      answer: "Yes! We offer farm tours by appointment. It's a great way to see our sustainable practices in action and learn about organic farming."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-heading-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Find answers to common questions about our products, farming practices, and services.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-neutral-200 pb-6">
                  <h3 className="font-heading text-lg font-heading-semibold mb-3 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                    {faq.question}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-16 bg-neutral-50 rounded-lg p-8 text-center">
              <h3 className="font-heading text-2xl font-heading-semibold mb-4">
                Still have questions?
              </h3>
              <p className="text-neutral-600 mb-6">
                Can&apos;t find the answer you&apos;re looking for? Get in touch with our team.
              </p>
              <Link href="/contact" className="btn-primary">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
