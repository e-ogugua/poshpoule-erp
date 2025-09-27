'use server';

import fs from 'fs';
import path from 'path';
import { BlogPost } from '@/lib/database-server';

const DB_PATH = path.join(process.cwd(), 'db', 'data.json');

async function readDatabase() {
  try {
    const fileContents = await fs.promises.readFile(DB_PATH, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading database:', error);
    return { blogPosts: [] };
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const data = await readDatabase();
    // Return all blog posts, regardless of published status
    return data.blogPosts || [];
  } catch (error) {
    console.error('Error getting blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const data = await readDatabase();
    return data.blogPosts.find((post: BlogPost) => post.slug === slug) || null;
  } catch (error) {
    console.error('Error getting blog post by slug:', error);
    return null;
  }
}
