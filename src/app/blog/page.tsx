import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { debugLogger, safeApiCall } from '@/utils/debug';

export const metadata: Metadata = {
  title: 'Blog - PoshPOULE Farms Ltd',
  description: 'Read our latest articles about sustainable farming, organic practices, and agricultural insights.',
};

async function fetchBlogPosts() {
  debugLogger.info('Fetching blog posts from API');
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/blog/posts`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const posts = await response.json();
    debugLogger.info('Blog posts fetched successfully', { count: posts.length });
    return posts;
  } catch (error) {
    debugLogger.error('Failed to fetch blog posts', error);
    throw error;
  }
}

export default async function BlogPage() {
  debugLogger.info('BlogPage rendering');
  
  let posts = [];
  let error = null;
  
  try {
    posts = await fetchBlogPosts();
    debugLogger.info('BlogPage loaded successfully', { postCount: posts.length });
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load blog posts';
    debugLogger.error('BlogPage failed to load', err);
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-primary/5 via-white to-emerald-50 py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-heading-bold text-primary mb-6">
                  Our Blog
                </h1>
                <p className="text-body text-lg md:text-xl text-neutral-700 mb-8 leading-relaxed">
                  Discover insights about sustainable farming, organic practices, and the stories behind our farm-fresh products.
                </p>
              </div>
            </div>
          </section>

          {/* Blog Posts */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              {error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <h2 className="font-heading text-2xl font-heading-bold text-neutral-900 mb-2">
                    Error Loading Blog Posts
                  </h2>
                  <p className="text-body text-neutral-600 mb-6">
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                  >
                    Try Again
                  </button>
                  {process.env.NODE_ENV === 'development' && (
                    <details className="mt-6 text-left max-w-md mx-auto">
                      <summary className="cursor-pointer text-sm text-neutral-500">
                        Debug Info
                      </summary>
                      <pre className="mt-2 p-3 bg-neutral-100 rounded text-xs">
                        {debugLogger.getLogs().slice(-5).map(log => 
                          `${log.timestamp} [${log.level}] ${log.message}`
                        ).join('\n')}
                      </pre>
                    </details>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                      <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary/10 hover:border-primary/20 transition-colors">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-6">
                          <h2 className="font-heading text-xl font-heading-semibold mb-2 line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="text-body text-neutral-600 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-primary font-medium">
                              By {post.author}
                            </span>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="btn-outline text-sm"
                            >
                              Read More
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  
                  {posts.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-neutral-600">No blog posts available at the moment.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
