import { NextResponse } from 'next/server';
import { readDatabase } from '@/lib/database';
import { debugLogger } from '@/utils/debug';

export async function GET() {
  try {
    const data = await readDatabase();
    const logs = debugLogger.getLogs();
    const recentLogs = logs.slice(-20); // Last 20 logs
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      nodeVersion: process.version,
      databaseStatus: 'connected',
      productCount: data.products.length,
      blogPostCount: data.blogPosts.length,
      logs: recentLogs,
      logCount: logs.length,
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to fetch debug info',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
