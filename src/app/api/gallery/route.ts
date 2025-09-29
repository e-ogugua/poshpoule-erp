import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db', 'data.json');

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    return NextResponse.json({ galleryImages: data.galleryImages || [] });
  } catch (error) {
    console.error('Error reading gallery data:', error);
    return NextResponse.json(
      { error: 'Failed to load gallery data' },
      { status: 500 }
    );
  }
}
