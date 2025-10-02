import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/database';

export async function GET() {
  try {
    const data = readDatabase();
    const subscribers = data.blogSubscribers || [];

    // Return subscriber stats and list
    const stats = {
      total: subscribers.length,
      pending: subscribers.filter((sub: any) => sub.status === 'pending').length,
      confirmed: subscribers.filter((sub: any) => sub.status === 'confirmed').length,
      unsubscribed: subscribers.filter((sub: any) => sub.status === 'unsubscribed').length,
    };

    return NextResponse.json({
      success: true,
      stats,
      subscribers: subscribers.map((sub: any) => ({
        id: sub.id,
        email: sub.email,
        status: sub.status,
        subscribedAt: sub.subscribedAt,
        confirmedAt: sub.confirmedAt,
      }))
    });

  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({
      error: 'Failed to fetch subscribers'
    }, { status: 500 });
  }
}
