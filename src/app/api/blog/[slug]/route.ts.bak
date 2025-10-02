import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getBlogPostBySlug, getBlogPosts } from '@/app/actions/blog';

export const revalidate = 3600; // 1 hour in seconds

export async function GET(
  request: NextRequest,
  context: any
) {
  const { slug } = context.params;
  try {
    const post = await getBlogPostBySlug(slug);
    if (!post) {
      return new NextResponse('Not Found', { status: 404 });
    }
    
    const allPosts = await getBlogPosts();
    
    return NextResponse.json({
      post,
      allPosts
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
