import { notFound } from 'next/navigation';
import { BlogPostContent } from './BlogPostContent';
import type { BlogPost } from '@/lib/database-server';

// Server-side data fetching function
async function getBlogPostData(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blog/${slug}`, {
      cache: 'no-store' // For fresh data, or use 'force-cache' for static generation
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error('Failed to fetch blog post');
    }

    const { post, allPosts } = await response.json();

    if (!post) {
      notFound();
    }

    return { post, allPosts };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const { post, allPosts } = await getBlogPostData(slug);

  // Calculate reading time (approximately 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Sort all posts by date (newest first)
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Find current post index in the sorted array
  const currentIndex = sortedPosts.findIndex(p => p.id === post.id);

  // Get previous and next posts
  const previousPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  // Get related posts (same category, excluding current post)
  const relatedPosts = allPosts
    .filter((p: BlogPost) => p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BlogPostContent
        post={post}
        readingTime={readingTime}
        formattedDate={formattedDate}
        relatedPosts={relatedPosts}
        previousPost={previousPost}
        nextPost={nextPost}
      />
    </div>
  );
}
