'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, User, Clock, ArrowLeft, Link as LinkIcon, Share2, Heart, MessageCircle, Bookmark } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useState, useEffect, useMemo } from 'react';
import type { Components } from 'react-markdown';

// Helper function to calculate reading time
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

import type { BlogPost } from '@/lib/database-server';

interface BlogPostContentProps {
  post: BlogPost;
  readingTime: number;
  formattedDate: string;
  relatedPosts: BlogPost[];
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}

const markdownComponents: Components = {
  p: ({ node, children, ...props }) => {
    // Check if the paragraph contains any block-level elements or images
    const hasBlockLevel = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        (child.type === 'div' ||
         child.type === 'img' ||
         child.type === 'figure' ||
         child.type === 'video' ||
         child.type === 'iframe' ||
         child.props?.className?.includes('grid') ||
         child.props?.className?.includes('flex') ||
         child.props?.className?.includes('block-level'))
    );

    // If it contains block-level elements, render as a div instead of p
    if (hasBlockLevel) {
      return <div className="my-4">{children}</div>;
    }

    // Regular paragraph with proper styling
    return (
      <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props}>
        {children}
      </p>
    );
  },
  code({ node, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !className?.includes('language-');
    return !isInline && match ? (
      <SyntaxHighlighter
        style={tomorrow}
        language={match[1]}
        PreTag="div"
        showLineNumbers
        wrapLines
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  img: ({ node, ...props }: any) => {
    const { src, alt = '' } = props;
    if (!src) return null;

    // Generate a stable key based on the image source
    const imageKey = `img-${src.replace(/[^a-z0-9]/gi, '-')}`;
    // Generate a meaningful alt text if none is provided
    const imageAlt = alt?.trim() || 'Blog post image';

    return (
      <div key={imageKey} className="my-8 max-w-4xl mx-auto block-level">
        <div className="relative aspect-video w-full">
          <Image
            src={src}
            alt={imageAlt}
            fill
            className="rounded-xl shadow-lg object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            priority={false}
            loading="lazy"
            unoptimized={process.env.NODE_ENV !== 'production'}
          />
        </div>
        {imageAlt && imageAlt !== 'Blog post image' && (
          <p className="text-center text-sm text-gray-500 mt-2 italic">
            {imageAlt}
          </p>
        )}
      </div>
    );
  },
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const { href, children, ...rest } = props;
    return (
      <a 
        href={href} 
        className="text-primary hover:underline hover:text-green-700 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  },
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const { children, ...rest } = props;
    return (
      <h2 
        className="text-2xl font-heading-semibold mt-12 mb-6 pb-2 border-b border-gray-200 group"
        {...rest}
      >
        {children}
        <a 
          href={`#${String(children).toLowerCase().replace(/[^\w]+/g, '-')}`}
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Direct link to heading"
        >
          <svg 
            className="h-5 w-5 text-gray-400 inline-block align-middle" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        </a>
      </h2>
    );
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const { children, ...rest } = props;
    return (
      <h3 
        className="text-xl font-heading-semibold mt-10 mb-4 flex items-center group"
        {...rest}
      >
        {children}
        <a 
          href={`#${String(children).toLowerCase().replace(/[^\w]+/g, '-')}`}
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Direct link to heading"
        >
          <svg 
            className="h-4 w-4 text-gray-400 inline-block align-middle" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        </a>
      </h3>
    );
  },
};

// Extract all images from markdown content
const extractImagesFromContent = (content: string) => {
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  const images: string[] = [];
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    if (match[1] && !match[1].startsWith('http')) {
      images.push(match[1]);
    }
  }
  
  return images;
};

export function BlogPostContent({ post, readingTime, formattedDate, relatedPosts, previousPost, nextPost }: BlogPostContentProps) {
  const [activeHeading, setActiveHeading] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const postImages = extractImagesFromContent(post.content);
  const hasMultipleImages = postImages.length > 1;

  // Handle scroll for table of contents highlighting
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 500);

      // Update active heading in table of contents
      const headings = document.querySelectorAll('h2, h3');
      let current = '';

      headings.forEach((heading) => {
        const headingTop = heading.getBoundingClientRect().top;
        if (headingTop >= 0 && headingTop < 200) {
          current = heading.id || '';
        }
      });

      if (current !== activeHeading) {
        setActiveHeading(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeHeading]);
  
  // Generate table of contents from markdown headings
  const tableOfContents = useMemo(() => {
    const headingRegex = /^##\s+(.+?)(?:\s*\{#(.+?)\})?$/gm;
    const headings: Array<{ text: string; id: string; level: number }> = [];
    let match;
    
    while ((match = headingRegex.exec(post.content)) !== null) {
      const text = match[1];
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      headings.push({ text, id, level: 2 });
    }
    
    return headings;
  }, [post.content]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sticky Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-gray-700 hover:text-primary transition-colors duration-200 group"
              passHref
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Blog</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Share2 className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bookmark className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Image */}
        {post.image && (
          <div className="relative w-full h-64 md:h-96 bg-gray-100 overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:flex gap-8">
            {/* Main Content */}
            <article className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
                <div className="mb-6">
                  <span className="inline-block px-4 py-1.5 text-sm font-medium bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors duration-200">
                    {post.category}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  {post.title}
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <span>{readingTime} min read</span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    components={markdownComponents}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[]}
                    urlTransform={(url) => {
                      // Ensure URLs are properly formatted
                      if (url.startsWith('http')) return url;
                      return url;
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
                
                {/* Tags */}
                <div className="mt-12 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {[post.category, 'sustainable farming', 'organic', 'agriculture'].map((tag) => (
                      <span 
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Social Share */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="h-5 w-5" />
                        <span>Like</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span>Comment</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Share:</span>
                      {['Twitter', 'Facebook', 'LinkedIn'].map((platform) => (
                        <button 
                          key={platform}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label={`Share on ${platform}`}
                        >
                          <Share2 className="h-5 w-5 text-gray-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Author Bio */}
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
                <div className="flex items-start">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/team/ChikwadoTeam4.png"
                      alt={post.author || 'Author profile picture'}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{post.author}</h3>
                    <p className="text-gray-600 text-sm mb-2">Farm Supervisor at PoshPOULE</p>
                    <p className="text-gray-600 text-sm">
                      Chikwado is passionate about sustainable farming practices and loves sharing knowledge about organic farming methods.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Next/Previous Post Navigation */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
                {previousPost ? (
                  <Link 
                    href={`/blog/${previousPost.slug}`}
                    className="flex-1 p-4 bg-white rounded-xl shadow-sm text-left hover:shadow-md transition-shadow group"
                  >
                    <span className="text-sm text-gray-500">Previous Post</span>
                    <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                      {previousPost.title}
                    </h4>
                  </Link>
                ) : (
                  <div className="flex-1 p-4 bg-gray-50 rounded-xl text-gray-400">
                    <span className="text-sm">Previous Post</span>
                    <h4 className="font-medium">No older posts</h4>
                  </div>
                )}
                
                {nextPost ? (
                  <Link 
                    href={`/blog/${nextPost.slug}`}
                    className="flex-1 p-4 bg-white rounded-xl shadow-sm text-right hover:shadow-md transition-shadow group"
                  >
                    <span className="text-sm text-gray-500">Next Post</span>
                    <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                      {nextPost.title}
                    </h4>
                  </Link>
                ) : (
                  <div className="flex-1 p-4 bg-gray-50 rounded-xl text-right text-gray-400">
                    <span className="text-sm">Next Post</span>
                    <h4 className="font-medium">No newer posts</h4>
                  </div>
                )}
              </div>
            </article>
            
            {/* Sidebar */}
            <aside className="lg:w-1/3 space-y-8">
              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <LinkIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Table of Contents
                  </h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block py-2 text-sm font-medium ${
                          activeHeading === item.id
                            ? 'text-primary'
                            : 'text-gray-600 hover:text-primary'
                        } transition-colors`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
              
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">You Might Also Like</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link 
                        key={relatedPost.id} 
                        href={`/blog/${relatedPost.slug}`}
                        className="group block"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={relatedPost.image}
                              alt={relatedPost.title || 'Related post image'}
                              width={80}
                              height={64}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {new Date(relatedPost.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Join Our Newsletter</h3>
                <p className="text-sm text-gray-600 mb-4">Get the latest farming tips and updates delivered to your inbox.</p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>

        {/* Back to Top Button */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 bg-white p-3 rounded-full shadow-lg text-gray-700 hover:bg-gray-100 transition-colors z-10"
            aria-label="Back to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </main>
    </div>
  );
}
