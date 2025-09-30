import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPosts } from '@/app/actions/blog';
import { BlogPostContent } from './BlogPostContent';

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const post = await getBlogPostBySlug(slug);
  const allPosts = await getBlogPosts();

  if (!post) {
    notFound();
  }

  // Calculate reading time (approximately 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Sort all posts by date (newest first)
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Find current post index in the sorted array
  const currentIndex = sortedPosts.findIndex(p => p.id === post.id);
  
  // Previous post is the next one in the array (newer post)
  const previousPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  
  // Next post is the previous one in the array (older post)
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  // Related posts (excluding current post)
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  return (
    <BlogPostContent 
      post={post}
      readingTime={readingTime}
      formattedDate={formattedDate}
      relatedPosts={relatedPosts}
      previousPost={previousPost}
      nextPost={nextPost}
    />
  );
}
