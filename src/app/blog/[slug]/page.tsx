import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/app/actions/blog';
import type { BlogPost } from '@/lib/database-server';

type Props = {
  params: { slug: string };
};

export default async function BlogPostPage({ params }: Props) {
  let post: BlogPost | null = null;
  
  try {
    post = await getBlogPostBySlug(params.slug);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
  
  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
      <div 
        className="prose lg:prose-xl dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </article>
  );
}
