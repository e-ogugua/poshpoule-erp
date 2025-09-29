'use client';

import { useEffect, useState } from 'react';
import { ClientBlogPage } from './client-blog-page';
import { BlogPost } from '@/lib/database-server';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { debugLogger } from '@/utils/debug';

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    debugLogger.info('BlogPage useEffect triggered');
    
    const fetchBlogPosts = async () => {
      try {
        debugLogger.info('Fetching blog posts from API');
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/blog/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        
        const data = await response.json();
        setBlogPosts(data);
        debugLogger.info('Blog posts fetched successfully', { count: data.length });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load blog posts. Please try again later.';
        setError(errorMessage);
        debugLogger.error('Error fetching blog posts', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
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
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ClientBlogPage 
        initialBlogPosts={blogPosts} 
        isLoading={isLoading} 
      />
    </ErrorBoundary>
  );
}
