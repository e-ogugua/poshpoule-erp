'use client';

import { BlogPost } from '@/lib/database-server';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { BlogPostCard } from '@/components/BlogPostCard';
import { ScrollToPostsButton } from '@/components/ScrollToPostsButton';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';

interface ClientBlogPageProps {
  blogPosts: BlogPost[];
}

export function ClientBlogPage({ blogPosts: initialBlogPosts }: ClientBlogPageProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/blog/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      const data = await response.json();
      setBlogPosts(data);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch blog posts on component mount
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  const handleScrollToPosts = useCallback(() => {
    const element = document.getElementById('blog-posts');
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Blog Posts</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchBlogPosts}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-green-600 text-white overflow-hidden">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="flex flex-col md:flex-row items-center">
              {/* Text Content - Left Side */}
              <div className="w-full md:w-1/2 md:pr-8 lg:pr-12 mb-8 md:mb-0 text-center md:text-left">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-heading-bold mb-6 leading-tight">
                  Farm Fresh Insights
                </h1>
                <p className="text-xl md:text-2xl opacity-90 mb-8">
                  Discover the latest in sustainable farming, organic practices, and fresh food tips from our agricultural experts.
                </p>
                <div className="mt-8">
                  <ScrollToPostsButton onClick={handleScrollToPosts}>
                    Read Our Stories
                  </ScrollToPostsButton>
                </div>
              </div>
              
              {/* Image - Right Side */}
              <div className="w-full md:w-1/2 h-64 md:h-96 relative rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <Image
                  src="/images/farm/GardenBeds.jpg"
                  alt="PoshPOULE Farm Blog"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Blog Posts Grid */}
        <section id="blog-posts" className="py-16">
          <div className="container mx-auto px-4">
            {blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No Blog Posts Found</h2>
                <p className="text-gray-600">Check back later for new articles and updates.</p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-heading-bold text-center mb-12">Latest Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogPosts.map((post) => (
                    <BlogPostCard
                      key={post.id}
                      post={post}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Newsletter Signup */}
            <div className="mt-16 bg-neutral-50 rounded-lg p-8 text-center">
              <h3 className="font-heading text-2xl font-heading-semibold mb-4">
                Stay Updated
              </h3>
              <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest farming tips, seasonal recipes, and updates from our farm.
              </p>
              <NewsletterSignup />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
