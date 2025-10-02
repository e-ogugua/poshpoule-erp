import { NextResponse } from 'next/server';
import { readDatabase } from '@/lib/database-server';

export async function GET() {
  try {
    // Read database asynchronously
    const data = await new Promise((resolve, reject) => {
      try {
        const result = readDatabase();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    // Add cache control headers
    const response = NextResponse.json(data);
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    
    return response;
  } catch (error) {
    console.error('Error fetching database:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch data', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
