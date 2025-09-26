import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { readDatabase } from '@/lib/database-server';
import { ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'PoshPOULE Farms Ltd - Premium Organic Poultry & Farm Produce',
  description: 'PoshPOULE Farms Ltd – Premium organic poultry, eggs, vegetables, and agribusiness solutions in Nigeria. Pure, healthy, and sustainable food for families and businesses.',
  keywords: 'Organic eggs Nigeria, poultry farm Enugu, buy fresh chicken Nigeria, organic vegetables Enugu, PoshPOULE Farms, sustainable farming Nigeria, healthy farm produce',
};

function ProductCard({ product }: { product: any }) {
  return (
    <div className="card p-6">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="font-heading text-xl font-heading-semibold mb-2">{product.name}</h3>
      <p className="text-body mb-4 line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between">
        <span className="font-bold text-primary text-lg">₦{product.priceNaira.toLocaleString()}</span>
        <Link
          href={`/products/${product.slug}`}
          className="btn-outline text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div className="card p-6">
      <div className="flex items-center mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-body mb-4 italic">"{testimonial.content}"</p>
      <div className="flex items-center">
        <div className="relative w-12 h-12 mr-4 rounded-full overflow-hidden">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div>
          <p className="font-semibold">{testimonial.name}</p>
          <p className="text-sm text-neutral-600">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );
}

function WhyChooseUsCard({ item }: { item: { icon: string; title: string; description: string } }) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-4">{item.icon}</div>
      <h3 className="font-heading text-xl font-heading-semibold mb-2">{item.title}</h3>
      <p className="text-body">{item.description}</p>
    </div>
  );
}

export default function Home() {
  const data = readDatabase();
  const featuredProducts = data.products.filter(product => product.featured);
  const testimonials = data.testimonials.filter(testimonial => testimonial.featured);
  const settings = data.settings;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary to-green-700 text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/farm/GrowingBroilers.JPG"
              alt="PoshPOULE Farm Hero"
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          </div>
          <div className="relative container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="font-heading text-5xl md:text-7xl font-heading-bold mb-6">
                {settings.siteName}
              </h1>
              <p className="font-heading text-2xl md:text-3xl font-heading-medium mb-8">
                {settings.slogan}
              </p>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                At PoshPOULE® Farms Ltd, our mission is to provide healthy, organic poultry and farm produce through sustainable practices while empowering communities with trusted agribusiness solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/preorder" className="btn-secondary">
                  Pre-Order Now
                </Link>
                <Link href="/products" className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors">
                  Shop Products
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-heading-bold mb-4">
                Why Choose PoshPOULE?
              </h2>
              <p className="text-lg text-body max-w-2xl mx-auto">
                Experience the difference with our commitment to quality, sustainability, and your health.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(data as any).whyChooseUs.map((item: { icon: string; title: string; description: string }, index: number) => (
                <WhyChooseUsCard key={index} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-heading-bold mb-4">
                Our Premium Products
              </h2>
              <p className="text-lg text-body max-w-2xl mx-auto">
                Fresh, organic, and sustainably grown produce from our farm to your table.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/products" className="btn-primary">
                View All Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Customer Testimonials Section */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-heading-bold mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-body max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our satisfied customers have to say.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/about" className="btn-outline">
                Read Our Story
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-heading-bold mb-6">
              Ready to Experience Pure Goodness?
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join hundreds of families who trust PoshPOULE for their fresh, organic food needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/preorder" className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors">
                Place Your Order
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors">
                Get In Touch
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
