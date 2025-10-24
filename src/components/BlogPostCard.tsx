'use client';

import { Calendar, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SocialShare } from '@/components/SocialShare';

interface BlogPostCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    image: string;
    author: string;
    createdAt: string;
    category?: string;
  };
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const [formattedDate, setFormattedDate] = useState('');
  
  useEffect(() => {
    // Format date on client side to avoid hydration mismatch
    setFormattedDate(
      new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, [post.createdAt]);

  return (
    <article className="card p-6 group hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="flex-1">
        <div className="mb-4 overflow-hidden rounded-lg">
          <Link href={`/blog/${post.slug}`}>
            <div className="relative w-full h-48 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
              <div className="absolute top-2 right-2">
                <SocialShare
                  title={post.title}
                  description={post.excerpt}
                  image={post.image}
                  url={`/blog/${post.slug}`}
                  type="blog"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            </div>
          </Link>
        </div>

        <div className="mb-4">
          {post.category && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-3">
              {post.category}
            </span>
          )}
          
          <div className="flex items-center text-sm text-neutral-500 mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span suppressHydrationWarning>
              {formattedDate}
            </span>
            <span className="mx-2">-</span>
            <User className="h-4 w-4 mr-1" />
            <span>{post.author}</span>
          </div>
          
          <h2 className="font-heading text-xl font-heading-semibold mb-3 group-hover:text-primary transition-colors">
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h2>
          
          <p className="text-neutral-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <Link 
          href={`/blog/${post.slug}`} 
          className="inline-flex items-center text-primary font-medium group-hover:text-green-700 transition-colors"
          aria-label={`Read more about ${post.title}`}
        >
          Read More
          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
