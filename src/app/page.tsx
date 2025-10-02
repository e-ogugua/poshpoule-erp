import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { readDatabase } from '@/lib/database-server';
import { ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import { HeroCarousel } from '@/components/HeroCarousel';
import FeaturedProducts from '@/components/FeaturedProducts';
import { Product } from '@/types/product';

type Testimonial = {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating: number;
  image?: string;
  location?: string;
  featured?: boolean;
};

type Settings = {
  siteName: string;
  slogan: string;
};

type WhyChooseUsItem = {
  icon: string;
  title: string;
  description: string;
};

type HomePageData = {
  products: Product[];
  testimonials: Testimonial[];
  settings: Settings;
  whyChooseUs: WhyChooseUsItem[];
};

export const metadata: Metadata = {
  title: 'PoshPOULE Farms Ltd - Premium Organic Poultry & Farm Produce',
  description: 'PoshPOULE Farms Ltd – Premium organic poultry, eggs, vegetables, and agribusiness solutions in Nigeria. Pure, healthy, and sustainable food for families and businesses.',
  keywords: 'Organic eggs Nigeria, poultry farm Enugu, buy fresh chicken Nigeria, organic vegetables Enugu, PoshPOULE Farms, sustainable farming Nigeria, healthy farm produce',
  openGraph: {
    title: 'PoshPOULE Farms - Premium Organic Farm Produce',
    description: 'Fresh, organic, and sustainably grown produce from our farm to your table.',
    type: 'website',
    locale: 'en_NG',
    siteName: 'PoshPOULE Farms',
  },
};

// Revalidate every 1 hour (3600 seconds)
export const revalidate = 3600;

async function getHomePageData(): Promise<HomePageData> {
  const data = readDatabase();
  
  return {
    products: data.products || [],
    testimonials: data.testimonials?.filter(t => t.featured) || [],
    settings: data.settings || { siteName: 'PoshPOULE Farms', slogan: 'Pure. Healthy. Sustainable.' },
    whyChooseUs: data.whyChooseUs || []
  };
}

// ProductCard component has been moved to a separate file

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
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
      <div className="flex items-center mt-4">
        {testimonial.image && (
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div>
          <p className="font-semibold">{testimonial.name}</p>
          {testimonial.location && (
            <p className="text-sm text-neutral-600">{testimonial.location}</p>
          )}
          {testimonial.role && (
            <p className="text-sm text-neutral-600">{testimonial.role}</p>
          )}
        </div>
      </div>
    </div>
  );
}
function WhyChooseUsCard({ item }: { item: WhyChooseUsItem }) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-4">{item.icon}</div>
      <h3 className="font-heading text-xl font-heading-semibold mb-2">{item.title}</h3>
      <p className="text-body">{item.description}</p>
    </div>
  );
}

export default async function Home() {
  const { products, testimonials, settings, whyChooseUs } = await getHomePageData();
  const featuredProducts = products.filter(product => product.featured);
  const heroSlides = [
    {
      src: '/images/products/OrganicShopShelve.jpg',
      alt: 'Organic shop display at PoshPOULE',
    },
    {
      src: '/images/products/eggs/freshEgg2.JPG',
      alt: 'Freshly collected organic eggs from PoshPOULE',
    },
    {
      src: '/images/gallery/HowToFarmSustainably.png',
      alt: 'Sustainable farming practices at PoshPOULE',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroCarousel slides={heroSlides} />

        {/* Introductory Copy */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="font-heading text-4xl md:text-5xl font-heading-bold">
                {settings.siteName}
              </h1>
              <p className="font-heading text-xl md:text-2xl font-heading-medium text-primary">
                {settings.slogan}
              </p>
              <p className="text-lg text-neutral-700">
                At PoshPOULE® Farms Ltd, our mission is to provide healthy, organic poultry and farm produce through sustainable practices while empowering communities with trusted agribusiness solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-heading-bold mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our premium selection of farm-fresh products
              </p>
            </div>
            <FeaturedProducts products={products} />
            <div className="text-center mt-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-emerald-600 px-8 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:from-primary/90 hover:to-emerald-700"
              >
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
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
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience the difference with our commitment to quality, sustainability, and your health.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseUs.map((item, index) => (
                <WhyChooseUsCard key={index} item={item} />
              ))}
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
