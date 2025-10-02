import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/database';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = readDatabase();
    const subscribers = data.blogSubscribers || [];
    const subscriberIndex = subscribers.findIndex((sub: any) => sub.id === params.id);

    if (subscriberIndex === -1) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    // Update subscriber status to unsubscribed
    subscribers[subscriberIndex].status = 'unsubscribed';
    subscribers[subscriberIndex].unsubscribedAt = new Date().toISOString();

    writeDatabase(data);

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed'
    });

  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json({
      error: 'Failed to unsubscribe'
    }, { status: 500 });
  }
}
