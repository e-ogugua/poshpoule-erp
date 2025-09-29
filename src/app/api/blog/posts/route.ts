import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db', 'data.json');

export async function GET() {
  try {
    // Use fs.promises for better Vercel compatibility
    const fileContents = await fs.promises.readFile(DB_PATH, 'utf8');
    const data = JSON.parse(fileContents);
    
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
