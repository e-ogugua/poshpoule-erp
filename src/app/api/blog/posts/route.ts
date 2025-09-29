import { NextResponse } from 'next/server';
import { readDatabase } from '@/lib/database';

export async function GET() {
  try {
    const data = await readDatabase();
    
    // Get all blog posts and sort by date (newest first)
    const posts = Array.isArray(data.blogPosts) ? data.blogPosts : [];
    const sortedPosts = posts.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return NextResponse.json(sortedPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure this route is dynamic
