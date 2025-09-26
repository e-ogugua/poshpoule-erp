import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { readDatabase } from '@/lib/database-server';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function BlogPage() {
  const data = readDatabase();
  const blogPosts = data.blogPosts;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-green-600 text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/farm/GardenBeds.jpg"
              alt="PoshPOULE Farm Blog"
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          </div>
          <div className="relative container mx-auto px-4 text-center py-16">
            <h1 className="font-heading text-4xl md:text-5xl font-heading-bold mb-6">
              Farm Fresh Insights
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Discover the latest in sustainable farming, organic practices, and fresh food tips from our agricultural experts.
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="card p-6 group hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <div className="relative w-full h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center text-sm text-neutral-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <h2 className="font-heading text-xl font-heading-semibold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-neutral-600 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary font-medium hover:text-green-700 transition-colors"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </article>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="mt-16 bg-neutral-50 rounded-lg p-8 text-center">
              <h3 className="font-heading text-2xl font-heading-semibold mb-4">
                Stay Updated
              </h3>
              <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest farming tips, seasonal recipes, and updates from our farm.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="btn-primary px-6 py-3 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl font-heading-bold mb-6">
              Visit Our Farm
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Experience the difference fresh, organic produce makes. Schedule a farm tour and see where your food comes from.
            </p>
            <Link href="/contact" className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors">
              Schedule a Tour
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
