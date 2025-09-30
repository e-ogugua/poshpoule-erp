// This is a minimal page component that will be handled by the client component
// All the logic is moved to the client component to avoid TypeScript errors
export { default } from './blog-post-page';

export const revalidate = 3600; // 1 hour in seconds

export async function generateStaticParams() {
  const { getBlogPosts } = await import('@/app/actions/blog');
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { getBlogPostBySlug } = await import('@/app/actions/blog');
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}
