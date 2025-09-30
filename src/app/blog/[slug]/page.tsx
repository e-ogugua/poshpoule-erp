import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/app/actions/blog';

interface PageProps {
  params: { slug: string };
}

export default async function Page({ params }: PageProps) {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
