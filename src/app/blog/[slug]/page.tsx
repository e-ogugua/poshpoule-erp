import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPosts } from '@/app/actions/blog';
import { BlogPostContent } from './BlogPostContent';

// Revalidate the page every 1 hour
// This means the page will be statically generated at build time,
// and then revalidated every hour to check for updates
export const revalidate = 3600; // 1 hour in seconds

// Generate static params at build time
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Props = {
  params: { slug: string };
};

export default async function BlogPostPage({ params }: Props) {
  const slug = params.slug;
  
  try {
    // Fetch post and related data in parallel
    const [post, allPosts] = await Promise.allSettled([
      getBlogPostBySlug(slug),
      getBlogPosts()
    ]);

    // Handle potential errors in parallel requests
    if (post.status === 'rejected' || allPosts.status === 'rejected') {
      const error = post.status === 'rejected' 
        ? post.reason 
        : allPosts.status === 'rejected' 
          ? allPosts.reason 
          : 'Unknown error';
      console.error('Error fetching blog data:', error);
      throw new Error('Failed to load blog data');
    }

    const postData = post.value;
    const allPostsData = allPosts.value;

    if (!postData) {
      notFound();
    }

    // Calculate reading time (approximately 200 words per minute)
    const wordCount = postData.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Format date
    const formattedDate = new Date(postData.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Sort all posts by date (newest first)
    const sortedPosts = [...allPostsData].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Find current post index in the sorted array
    const currentIndex = sortedPosts.findIndex(p => p.id === postData.id);
    
    // Get previous and next posts
    const previousPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

    // Get related posts (same category, excluding current post)
    const relatedPosts = allPostsData
      .filter(p => p.id !== postData.id && p.category === postData.category)
      .slice(0, 2);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BlogPostContent 
          post={postData} 
          readingTime={readingTime}
          formattedDate={formattedDate}
          relatedPosts={relatedPosts}
          previousPost={previousPost}
          nextPost={nextPost}
        />
      </div>
    );
  } catch (error) {
    console.error('Error in blog post page:', error);
    notFound();
  }
}
